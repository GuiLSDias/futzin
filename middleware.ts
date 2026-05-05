import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Rotas públicas — acessíveis sem login
 */
const ROTAS_PUBLICAS = ["/login", "/cadastro", "/auth/callback"];

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          // Passo 1: escreve nos cookies do request (para que getAll() veja a sessão nesta mesma requisição)
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          // Passo 2: recria a resposta com o request já atualizado
          supabaseResponse = NextResponse.next({ request });
          // Passo 3: escreve os cookies na resposta para o browser persistir a sessão
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options as any),
          );
        },
      },
    },
  );

  // IMPORTANTE: não remova esta chamada — renova o token e popula os cookies acima
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const isPublic = ROTAS_PUBLICAS.some((rota) => pathname.startsWith(rota));

  // Usuário não autenticado tentando acessar rota protegida → redireciona para /login
  if (!user && !isPublic) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  // Usuário autenticado tentando acessar /login ou /cadastro → redireciona para /dashboard
  if (user && isPublic && pathname !== "/auth/callback") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // IMPORTANTE: retorne sempre supabaseResponse (com os cookies de sessão)
  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
