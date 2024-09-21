import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const config = {
  matcher: ["/((?!api/|_next/|_static/|[\\w-]+\\.\\w+).*)"],
};

export async function middleware(req: NextRequest) {
  const url = req.nextUrl;
  let hostname = req.headers.get("host") || "";

  hostname = hostname.split(":")[0];

  const allowedDomains = [
    "ziamatix.vercel.app",
    "www.ziamatix.vercel.app",
    "localhost",
  ];

  const isMainDomain = allowedDomains.includes(hostname);

  const subdomain = isMainDomain ? null : hostname.split(".")[0];

  console.log("Middleware: Hostname:", hostname);
  console.log("Middleware: Subdomain:", subdomain);

  if (isMainDomain) {
    console.log("Middleware: Main domain detected, passing through");
    return NextResponse.next();
  }

  if (subdomain) {
    try {
      const response = await fetch(
        `${url.origin}/api/dashboard?subdomain=${subdomain}`
      );

      if (response.ok) {
        console.log("Middleware: Valid subdomain detected, rewriting URL");

        return NextResponse.rewrite(
          new URL(`/${subdomain}${url.pathname}`, req.url)
        );
      }
    } catch (error) {
      console.error("Middleware: Error fetching dashboard:", error);
    }
  }

  console.log("Middleware: Invalid subdomain or domain, returning 404");

  return new NextResponse(null, { status: 404 });
}
