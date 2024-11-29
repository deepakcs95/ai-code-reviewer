"server only";
import { auth } from "@clerk/nextjs/server";

export const checkAuth = (handler: Function) => {
  return async (data: any) => {
    const { userId } = await auth();

    if (!userId) {
      return { error: "Unauthorized" };
    }

    await new Promise((resolve) => setTimeout(resolve, 2000));

    return handler(data, userId);
  };
};
