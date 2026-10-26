import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const AUTH_COOKIE_NAME = "virat_admin_auth";

/**
 * Verifies whether the incoming request contains a valid admin session cookie.
 */
export async function verifyAdminAuth(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const authCookie = cookieStore.get(AUTH_COOKIE_NAME);
    return Boolean(authCookie && authCookie.value === "authenticated");
  } catch {
    return false;
  }
}

/**
 * Returns a standardized 401 Unauthorized NextResponse.
 */
export function unauthorizedResponse(message = "Unauthorized. Admin session required.") {
  return NextResponse.json(
    { success: false, error: message },
    { status: 401 }
  );
}
