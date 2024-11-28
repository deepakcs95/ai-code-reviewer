import { auth } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import { clerkClient } from "@clerk/nextjs/server";
import db from "../../lib/db.ts";

export default async function Page() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const client = await clerkClient();

  const user = await client.users.getUser(userId);

  if (!user.emailAddresses[0]?.emailAddress) {
    return notFound();
  }

  await db.user.upsert({
    where: {
      emailAddress: user.emailAddresses[0]?.emailAddress,
    },
    update: {
      imageUrl: user.imageUrl,
      firstName: user.firstName,
      lastName: user.lastName,
    },
    create: {
      id: user.id,
      emailAddress: user.emailAddresses[0]?.emailAddress,
      imageUrl: user.imageUrl,
      firstName: user.firstName,
      lastName: user.lastName,
    },
  });

  redirect("/dashboard");
}
