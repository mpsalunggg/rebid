import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decodeJwt } from "jose";

const PUBLIC_ROUTES = ["/login", "/register", "/"];

export function proxy(request: NextRequest) {
	const { pathname } = request.nextUrl;

	const isPublicRoute =
		PUBLIC_ROUTES.some((route) => pathname.startsWith(route)) ||
		pathname.startsWith("/auth/");

	if (isPublicRoute) {
		return NextResponse.next();
	}

	const token = request.cookies.get("token")?.value;

	if (!token) {
		return NextResponse.redirect(new URL("/login", request.url));
	}

	try {
		const decoded = decodeJwt(token);
		const now = Math.floor(Date.now() / 1000);

		if (decoded.exp && decoded.exp < now) {
			return NextResponse.redirect(new URL("/login", request.url));
		}

		return NextResponse.next();
	} catch (error) {
		return NextResponse.redirect(new URL("/login", request.url));
	}
}

export const config = {
	matcher: [
		"/((?!_next/static|_next/image|favicon.ico|.*\\.svg$|.*\\.png$|.*\\.jpg$).*)",
	],
};
