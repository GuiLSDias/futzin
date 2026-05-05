import { createClient } from "@/lib/supabase-server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Users, Calendar, Crown, ArrowLeft } from "lucide-react";
import { CopyLinkButton } from "@/components/CopyLinkButton";

export default async function GrupoPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();

  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) {
    return null;
  }

  // Buscar informações do grupo
  const { data: grupo, error: grupoError } = await supabase
    .from("groups")
    .select("*")
    .eq("id", params.id)
    .single();

  if (grupoError || !grupo) {
    notFound();
  }

  const grupoData: any = grupo;

  // Buscar membros
  const { data: membros } = await supabase
    .from("group_members")
    .select(`
      role,
      joined_at,
      users:user_id ( id, name, position, avatar_url )
    `)
    .eq("group_id", params.id)
    .order("joined_at", { ascending: true });

  // O "users" vem como array ou objeto em joins do supabase. Se for 1:N é objeto mas se for M:N pode ser array.
  // Como `group_members.user_id` -> `users.id` é Many-to-One, "users" será um objeto ou array de 1.
  
  const formattedMembers = membros?.map((m: any) => ({
    ...m,
    user: Array.isArray(m.users) ? m.users[0] : m.users
  })) || [];

  // Verificar meu papel no grupo
  const meuMembro = formattedMembers.find((m: any) => m.user?.id === authUser.id);
  const isAdmin = meuMembro?.role === "admin";

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/grupos"
            className="flex h-10 w-10 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-900"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{grupoData.name}</h1>
            <p className="mt-1 max-w-xl text-sm text-gray-500">
              {grupoData.description || "Sem descrição"}
            </p>
          </div>
        </div>
        
        {isAdmin && <CopyLinkButton groupId={grupoData.id} />}
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* COLUNA ESQUERDA - PELADAS */}
        <div className="md:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-xl font-semibold text-gray-900">
              <Calendar size={24} className="text-brand-600" />
              Próximas Peladas
            </h2>
            {isAdmin && (
              <button className="btn-primary flex items-center gap-2 text-sm px-4 py-2">
                Nova Pelada
              </button>
            )}
          </div>

          <div className="card flex flex-col items-center justify-center p-12 text-center text-gray-500">
            <Calendar size={48} className="mb-4 text-gray-300" />
            <span className="text-sm font-medium">Nenhuma pelada agendada</span>
            {isAdmin && (
              <span className="mt-1 text-xs">
                Clique no botão acima para criar a primeira pelada do grupo.
              </span>
            )}
          </div>
        </div>

        {/* COLUNA DIREITA - MEMBROS */}
        <div className="space-y-6">
          <h2 className="flex items-center gap-2 text-xl font-semibold text-gray-900">
            <Users size={24} className="text-blue-600" />
            Membros ({formattedMembers.length})
          </h2>

          <div className="card p-0">
            <ul className="divide-y divide-gray-100">
              {formattedMembers.map((membro: any) => {
                const user = membro.user;
                if (!user) return null;
                
                return (
                  <li key={user.id} className="flex items-center gap-3 p-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-700">
                      {user.name ? user.name[0].toUpperCase() : "?"}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-gray-900">
                        {user.name}
                        {user.id === authUser.id && " (Você)"}
                      </p>
                      <p className="truncate text-xs text-gray-500">
                        {user.position || "Sem posição"}
                      </p>
                    </div>
                    {membro.role === "admin" && (
                      <span title="Admin">
                        <Crown size={16} className="text-yellow-500" />
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
