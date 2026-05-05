"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient, createRawClient } from "@/lib/supabase";
import type { TablesInsert } from "@/types/database";
import { ArrowLeft, Users } from "lucide-react";

export default function NovoGrupoPage() {
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleCriarGrupo(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    setLoading(true);

    const supabase = createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      setErro("Você precisa estar autenticado.");
      setLoading(false);
      return;
    }

    const novoGrupo: TablesInsert<"groups"> = {
      name: nome,
      description: descricao,
      created_by: user.id
    };

    const rawSupabase = createRawClient();
    const { data: grupo, error } = await rawSupabase
      .from("groups")
      .insert(novoGrupo)
      .select()
      .single();

    if (error) {
      setErro("Ocorreu um erro ao criar o grupo. Tente novamente.");
      console.error(error);
      setLoading(false);
      return;
    }

    router.push(`/grupos/${grupo.id}`);
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/grupos"
          className="flex h-10 w-10 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-900"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Novo Grupo</h1>
          <p className="mt-1 text-sm text-gray-500">
            Crie um grupo para começar a organizar as peladas
          </p>
        </div>
      </div>

      <div className="card p-6 sm:p-8">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-brand-50">
          <Users size={32} className="text-brand-600" />
        </div>

        <form onSubmit={handleCriarGrupo} className="space-y-6">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Nome do grupo *
            </label>
            <input
              type="text"
              required
              maxLength={50}
              placeholder="Ex: Pelada da Empresa, Galera do Bairro"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="input-base"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Descrição <span className="font-normal text-gray-400">(opcional)</span>
            </label>
            <textarea
              rows={3}
              maxLength={200}
              placeholder="Uma breve descrição sobre o grupo e suas regras..."
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              className="input-base resize-none"
            />
          </div>

          {erro && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {erro}
            </div>
          )}

          <div className="flex items-center gap-3 pt-2">
            <Link
              href="/grupos"
              className="btn-secondary flex-1 justify-center text-center"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={loading || !nome.trim()}
              className="btn-primary flex-1 justify-center"
            >
              {loading ? "Criando..." : "Criar Grupo"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
