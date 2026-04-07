import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

/**
 * Rota de callback do Supabase Auth
 * Chamada automaticamente após login com OAuth (Google, etc)
 * ou após confirmação de email
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Em caso de erro, redireciona para login com mensagem
  return NextResponse.redirect(`${origin}/login?error=auth`);
}
