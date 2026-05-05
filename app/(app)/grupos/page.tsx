import { createClient } from "@/lib/supabase-server";
import Link from "next/link";
import { Users, Plus, ChevronRight } from "lucide-react";

export const metadata = {
  title: "Meus Grupos | Pelada App",
  description: "Liste e organize seus grupos de pelada.",
};

export default async function GruposPage() {
  const supabase = await createClient();

  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) {
    return null; // O middleware já vai redirecionar se não tiver usuário
  }

  const { data: meusGrupos } = await supabase
    .from("group_members")
    .select(
      `
      role,
      joined_at,
      groups ( id, name, description, created_at )
    `,
    )
    .eq("user_id", authUser.id)
    .order("joined_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Meus Grupos</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gerencie e participe de grupos de futebol
          </p>
        </div>
        <Link href="/grupos/novo" className="btn-primary flex items-center gap-2">
          <Plus size={18} />
          <span className="hidden sm:inline">Novo Grupo</span>
        </Link>
      </div>

      {!meusGrupos || meusGrupos.length === 0 ? (
        <div className="card flex flex-col items-center justify-center p-12 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand-50">
            <Users size={32} className="text-brand-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            Nenhum grupo ainda
          </h3>
          <p className="max-w-sm mt-2 text-sm text-gray-500">
            Você ainda não participa de nenhum grupo. Crie um novo grupo para
            começar a organizar suas peladas!
          </p>
          <Link href="/grupos/novo" className="btn-primary mt-6 inline-flex">
            Criar meu primeiro grupo
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {meusGrupos.map((membro: any) => {
            const grupo = membro.groups;
            return (
              <Link
                key={grupo.id}
                href={`/grupos/${grupo.id}`}
                className="card flex flex-col p-5 transition-all hover:border-brand-200 hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-100 text-lg font-bold text-brand-700">
                    {grupo.name[0].toUpperCase()}
                  </div>
                  {membro.role === "admin" && (
                    <span className="badge badge-blue">Admin</span>
                  )}
                </div>

                <div className="mt-4 flex-1">
                  <h3 className="truncate text-lg font-semibold text-gray-900">
                    {grupo.name}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-sm text-gray-500">
                    {grupo.description ||
                      "Nenhuma descrição definida para este grupo."}
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4">
                  <span className="text-xs text-gray-400">
                    Membro desde{" "}
                    {new Date(membro.joined_at).toLocaleDateString("pt-BR", {
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                  <div className="flex items-center text-sm font-medium text-brand-600">
                    Acessar <ChevronRight size={16} className="ml-1" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
