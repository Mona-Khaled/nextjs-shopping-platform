import { auth } from "@/auth";
import { unauthorized } from "next/navigation";

export async function requireAdmin() {
  const session = await auth();

  if (session?.user?.role !== "admin") unauthorized();

  return session;
}
