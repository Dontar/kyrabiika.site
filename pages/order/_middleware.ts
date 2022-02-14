
import { NextApiRequest } from "next";
import { getToken, GetTokenValue } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

interface MyMessageProps {
  req: NextRequest;
  secret: String
}
// /** @param {import("next/server").NextRequest} req */
export async function middleware(req: NextRequest) {
  if (req.nextUrl.pathname === "/order") {
    const session = await getToken({
      req,
      secret: process.env.SECRET ?? "",
    });
    // You could also check for any property on the session object,
    // like role === "admin" or name === "John Doe", etc.
    if (!session) return NextResponse.redirect("/login");
    // If user is authenticated, continue.
  }
}
