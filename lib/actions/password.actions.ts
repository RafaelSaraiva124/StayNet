"use server";

import { db } from "@/database/drizzle";
import { users, verificationTokens } from "@/database/schema";
import { eq, and } from "drizzle-orm";
import { hash, compare } from "bcryptjs";
import { Resend } from "resend";
import crypto from "crypto";
import PasswordResetEmail from "@/emails/password-reset-template";

const resend = new Resend(process.env.RESEND_API_KEY);

function generateSecureToken(): string {
  return crypto.randomBytes(32).toString("base64url");
}

async function hashToken(token: string): Promise<string> {
  return hash(token, 10);
}

export async function sendPasswordResetLink(email: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    if (!email || !email.includes("@")) {
      return { success: false, error: "Email inválido" };
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, normalizedEmail))
      .limit(1);

    if (existingUser.length === 0) {
      return { success: true };
    }

    const existingToken = await db
      .select()
      .from(verificationTokens)
      .where(
        and(
          eq(verificationTokens.email, normalizedEmail),
          eq(verificationTokens.tokenType, "password_reset"),
        ),
      )
      .limit(1);

    if (existingToken.length > 0) {
      const canSendAt = new Date(existingToken[0].nextEmailAt || 0);

      if (new Date() < canSendAt) {
        const timeLeft = Math.ceil(
          (canSendAt.getTime() - Date.now()) / (1000 * 60),
        );
        return {
          success: false,
          error: `Já foi enviado um email. Aguarde ${timeLeft} minuto(s).`,
        };
      }

      await db
        .delete(verificationTokens)
        .where(
          and(
            eq(verificationTokens.email, normalizedEmail),
            eq(verificationTokens.tokenType, "password_reset"),
          ),
        );
    }

    const token = generateSecureToken();
    const tokenHash = await hashToken(token);

    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    const nextEmailAt = new Date();
    nextEmailAt.setMinutes(nextEmailAt.getMinutes() + 1);

    await db.insert(verificationTokens).values({
      email: normalizedEmail,
      tokenHash,
      tokenType: "password_reset",
      expiresAt,
      nextEmailAt,
    });

    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;

    const { error: emailError } = await resend.emails.send({
      from: "StayNet <onboarding@resend.dev>",
      to: [normalizedEmail],
      subject: "Recuperação de Password - StayNet",
      react: PasswordResetEmail({
        resetUrl,
        expiresInMinutes: 60,
      }),
    });

    if (emailError) {
      console.error("Erro ao enviar email:", emailError);
      await db
        .delete(verificationTokens)
        .where(
          and(
            eq(verificationTokens.email, normalizedEmail),
            eq(verificationTokens.tokenType, "password_reset"),
          ),
        );

      return {
        success: false,
        error: "Erro ao enviar email. Tente novamente.",
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error("Erro ao enviar link:", error);
    return {
      success: false,
      error: "Erro ao processar pedido",
    };
  }
}
