"use server";

import { db } from "@/database/drizzle";
import { users, verificationTokens } from "@/database/schema";
import { eq, and } from "drizzle-orm";
import { hash, compare } from "bcryptjs";
import { signIn, signOut } from "@/auth";
import { Resend } from "resend";
import crypto from "crypto";
import VerifyEmailTemplate from "@/emails/verify-email-template";

const resend = new Resend(process.env.RESEND_API_KEY);

function generateSecureToken(): string {
  return crypto.randomBytes(32).toString("base64url");
}

async function hashToken(token: string): Promise<string> {
  return hash(token, 10);
}

export const signInWithCredentials = async (
  params: Pick<AuthCredentials, "email" | "password">,
) => {
  const { email, password } = params;

  try {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      return { success: false, error: result.error };
    }

    return { success: true };
  } catch (error) {
    console.error("Signin error:", error);
    return { success: false, error: "Erro ao iniciar sessão" };
  }
};

export const signUp = async (params: AuthCredentials) => {
  const { fullName, email, password } = params;

  try {
    if (!email || !password || password.length < 6) {
      return { success: false, error: "Dados inválidos" };
    }

    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase()))
      .limit(1);

    if (existingUser.length > 0) {
      return { success: false, error: "Este email já está registado" };
    }

    const existingToken = await db
      .select()
      .from(verificationTokens)
      .where(
        and(
          eq(verificationTokens.email, email.toLowerCase()),
          eq(verificationTokens.tokenType, "email_verification"),
        ),
      )
      .limit(1);

    if (existingToken.length > 0) {
      if (new Date() < new Date(existingToken[0].expiresAt)) {
        return {
          success: false,
          error:
            "Já foi enviado um email de verificação. Verifique a sua caixa de entrada.",
        };
      }

      await db
        .delete(verificationTokens)
        .where(eq(verificationTokens.email, email.toLowerCase()));
    }

    const passwordHash = await hash(password, 12);
    const token = generateSecureToken();
    const tokenHash = await hashToken(token);

    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    await db.insert(verificationTokens).values({
      email: email.toLowerCase(),
      fullName,
      passwordHash,
      tokenHash,
      tokenType: "email_verification",
      expiresAt,
    });

    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}`;

    const { error: emailError } = await resend.emails.send({
      from: "StayNet <onboarding@resend.dev>",
      to: [email.toLowerCase()],
      subject: "Verifique o seu email - StayNet",
      react: VerifyEmailTemplate({
        fullName,
        verificationUrl,
      }),
    });

    if (emailError) {
      console.error("Erro ao enviar email:", emailError);
      await db
        .delete(verificationTokens)
        .where(eq(verificationTokens.email, email.toLowerCase()));

      return {
        success: false,
        error: "Erro ao enviar email. Tente novamente.",
      };
    }

    return {
      success: true,
      pendingVerification: true,
    };
  } catch (error) {
    console.error("Signup error:", error);
    return { success: false, error: "Erro ao criar conta" };
  }
};

export async function verifyEmailToken(token: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    if (!token || token.length < 20) {
      return { success: false, error: "Token inválido" };
    }

    const allTokens = await db
      .select()
      .from(verificationTokens)
      .where(eq(verificationTokens.tokenType, "email_verification"));

    let matchedToken = null;
    for (const tokenData of allTokens) {
      const isMatch = await compare(token, tokenData.tokenHash);
      if (isMatch) {
        matchedToken = tokenData;
        break;
      }
    }

    if (!matchedToken) {
      return {
        success: false,
        error: "Token inválido ou expirado",
      };
    }

    if (new Date() > new Date(matchedToken.expiresAt)) {
      await db
        .delete(verificationTokens)
        .where(eq(verificationTokens.email, matchedToken.email));

      return {
        success: false,
        error: "Token expirado. Registe-se novamente.",
      };
    }

    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, matchedToken.email))
      .limit(1);

    if (existingUser.length > 0) {
      await db
        .delete(verificationTokens)
        .where(eq(verificationTokens.email, matchedToken.email));

      return {
        success: false,
        error: "Este email já está registado",
      };
    }

    await db.insert(users).values({
      fullName: matchedToken.fullName!,
      email: matchedToken.email,
      password: matchedToken.passwordHash!,
      role: "User",
      emailVerified: true,
    });

    await db
      .delete(verificationTokens)
      .where(eq(verificationTokens.email, matchedToken.email));

    return {
      success: true,
    };
  } catch (error) {
    console.error("Erro ao verificar token:", error);
    return {
      success: false,
      error: "Erro ao verificar email",
    };
  }
}

export async function handleSignOut() {
  await signOut({ redirectTo: "/sign-in" });
}
