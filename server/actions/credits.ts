"use server";

import db from "../../lib/db.ts";
import { auth } from "@clerk/nextjs/server";

export const getUserCredits = async () => {
  const { userId } = await auth();

  if (!userId) return { error: "Unauthorized" };

  try {
    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) {
      return { error: "User not found" };
    }
    return { credits: user.credits };
  } catch (error) {
    console.error("Error fetching user credits:", error);
    return { error: "Failed to fetch user credits" };
  }
};

export const createPaymentTransaction = async (credits: number) => {
  const { userId } = await auth();
  if (!userId) return { error: "Unauthorized" };

  try {
    await db.paymentTransaction.create({
      data: {
        userId,
        credits,
      },
    });
    await db.user.update({
      where: { id: userId },
      data: { credits: { increment: credits } },
    });

    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Failed to create payment transaction" };
  }
};
