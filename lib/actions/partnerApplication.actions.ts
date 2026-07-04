"use server";

import { auth } from "@/auth";
import { db } from "@/database/drizzle";
import { partnerApplications, users } from "@/database/schema";
import { eq } from "drizzle-orm";

export async function partnerApplicationActions(
  hotelName: string,
  description: string,
) {
  const session = await auth();

  if (!session?.user?.id) {
    return { success: false, error: "sem sessão ativa" };
  }

  await db.insert(partnerApplications).values({
    userId: session.user.id,
    hotelName,
    description,
  });

  return { success: true };
}

export async function getPendingApplications() {
  return await db
    .select({
      id: partnerApplications.id,
      userId: partnerApplications.userId,
      hotelName: partnerApplications.hotelName,
      description: partnerApplications.description,
      status: partnerApplications.status,
      userFullName: users.fullName,
      userEmail: users.email,
      createdAt: partnerApplications.createdAt,
    })
    .from(partnerApplications)
    .innerJoin(users, eq(partnerApplications.userId, users.id))
    .where(eq(partnerApplications.status, "Pending"))
    .orderBy(partnerApplications.createdAt);
}

export async function approveApplication(applicationId: string) {
  await db
    .update(partnerApplications)
    .set({ status: "Approved" })
    .where(eq(partnerApplications.id, applicationId));

  const app = await db
    .select({ userId: partnerApplications.userId })
    .from(partnerApplications)
    .where(eq(partnerApplications.id, applicationId))
    .limit(1);

  if (app.length > 0) {
    const userId = app[0].userId;
    await db.update(users).set({ role: "Partner" }).where(eq(users.id, userId));
  }

  return { success: true };
}

export async function rejectApplication(applicationId: string) {
  await db
    .update(partnerApplications)
    .set({ status: "Rejected" })
    .where(eq(partnerApplications.id, applicationId));

  return { success: true };
}

export async function getAllPartners() {
  try {
    const partners = await db
      .select({
        id: users.id,
        fullName: users.fullName,
        email: users.email,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.role, "Partner"));

    return { success: true, partners };
  } catch (error) {
    console.error("Erro ao buscar parceiros:", error);
    return { success: false, error: "Erro ao buscar parceiros" };
  }
}

export async function removePartner(userId: string) {
  try {
    await db.update(users).set({ role: "User" }).where(eq(users.id, userId));
    return { success: true };
  } catch (error) {
    console.error("Erro ao remover partner:", error);
    return { success: false, error: "Erro ao remover partner" };
  }
}
