"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient, createRawClient } from "@/lib/supabase";
import type { TablesInsert } from "@/types/database";
import { Users, LogIn } from "lucide-react";
import Link from "next/link";

export default function EntrarGrupoClient({ grupo }: { grupo: any }) {
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const router = useRouter();

  async function handleEntrar() {
    setLoading(true);
    setErro("");
    const supabase = createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      setErro("Usuário não encontrado.");
      setLoading(false);
      return;
    }

    const novoMembro: TablesInsert<"group_members"> = {
      group_id: grupo.id,
      user_id: user.id,
      role: "member"
    };

    const rawSupabase = createRawClient();
    const { error } = await rawSupabase
      .from("group_members")
      .insert(novoMembro);

    if (error) {
      console.error(error);
      setErro("Não foi possível entrar no grupo. Tente novamente.");
      setLoading(false);
      return;
    }

    router.push(`/grupos/${grupo.id}`);
    router.refresh();
  }

  return (
    <div className="flex min-h-[50vh] flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-100">
          <Users size={32} className="text-brand-600" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Convite para entrar
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Você foi convidado para o grupo
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="card p-8 shadow-sm text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-2">{grupo.name}</h3>
          {grupo.description && (
            <p className="text-sm text-gray-500 mb-6">{grupo.description}</p>
          )}

          {erro && (
            <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {erro}
            </div>
          )}

          <div className="flex flex-col gap-3">
            <button
              onClick={handleEntrar}
              disabled={loading}
              className="btn-primary w-full flex justify-center items-center gap-2"
            >
              <LogIn size={20} />
              {loading ? "Entrando..." : "Entrar no Grupo"}
            </button>
            <Link
              href="/grupos"
              className="btn-secondary w-full text-center"
            >
              Cancelar
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
