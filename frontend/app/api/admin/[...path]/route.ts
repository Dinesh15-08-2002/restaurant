import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const BACKEND_URL =
  process.env.INTERNAL_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:8000/api";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return handleProxy(request, (await params).path);
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return handleProxy(request, (await params).path);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return handleProxy(request, (await params).path);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return handleProxy(request, (await params).path);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return handleProxy(request, (await params).path);
}

async function handleProxy(request: Request, pathParts: string[]) {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;

  if (!token) {
    return NextResponse.json({ detail: "Unauthorized" }, { status: 401 });
  }

  const endpointPath = pathParts.join("/");
  const url = new URL(request.url);
  const targetUrl = `${BACKEND_URL}/admin/${endpointPath}${url.search}`;

  const headers: HeadersInit = {
    Authorization: `Bearer ${token}`,
  };

  const contentType = request.headers.get("content-type");
  if (contentType) {
    headers["Content-Type"] = contentType;
  }

  let body: BodyInit | null = null;
  if (["POST", "PUT", "PATCH"].includes(request.method)) {
    body = await request.text();
  }

  try {
    const backendRes = await fetch(targetUrl, {
      method: request.method,
      headers,
      body,
    });

    if (backendRes.status === 204) {
      return new NextResponse(null, { status: 204 });
    }

    const data = await backendRes.json().catch(() => null);
    return NextResponse.json(data, { status: backendRes.status });
  } catch {
    return NextResponse.json(
      { detail: "Backend API communication failed" },
      { status: 502 }
    );
  }
}
