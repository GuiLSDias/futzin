import { createClient } from "@/lib/supabase-server";
import { notFound, redirect } from "next/navigation";
import EntrarGrupoClient from "./EntrarGrupoClient";

export default async function EntrarGrupoPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const callbackUrl = encodeURIComponent(`/grupos/${params.id}/entrar`);
    redirect(`/login?redirect=${callbackUrl}`);
  }

  const { data: grupo, error } = await supabase
    .from("groups")
    .select("id, name, description")
    .eq("id", params.id)
    .single();

  if (error || !grupo) {
    notFound();
  }

  // Verificar se já é membro (user existe pois redirect() foi chamado acima caso contrário)
  const { data: membro } = await supabase
    .from("group_members")
    .select("id")
    .eq("group_id", params.id)
    .eq("user_id", user!.id)
    .single();

  if (membro) {
    redirect(`/grupos/${params.id}`);
  }

  return <EntrarGrupoClient grupo={grupo as any} />;
}
