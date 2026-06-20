import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";

export async function getUserFromRequest() {
  try {
    const token = (await cookies()).get("token")?.value;

    if (!token) return null;

    const decoded = verifyToken(token);

    return decoded; // { userId, email, role }
  } catch (error) {
    return null;
  }
}