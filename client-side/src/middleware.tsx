import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose"; // lightweight JWT verification lib

const secret = new TextEncoder().encode(process.env.JWT_SECRET); // your JWT secret

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;
  console.log("Cookie: ",token)
  if (!token) {

    return NextResponse.redirect(new URL("/accounts/signIn", request.url));
  }

  try {
    await jwtVerify(token, secret); // Verify the token
    return NextResponse.next(); // All good, allow request
  } catch (err) {
    console.error("Invalid token:", err);
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/repositories"], // protect only these routes
};
