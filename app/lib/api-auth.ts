import { auth } from "@clerk/nextjs/server";

export async function getAuthUserId(): Promise<string | null> {
  let userId = (await auth()).userId;

  // Dev bypass: inyectar userId si está en desarrollo
  if (
    !userId &&
    process.env.NODE_ENV === "development" &&
    process.env.DEV_BYPASS === "true"
  ) {
    userId = "user_3GvDXLehFYaF4fb0qQpnD73FUEM";
  }

  return userId;
}
