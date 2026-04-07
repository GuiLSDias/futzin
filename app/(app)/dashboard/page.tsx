import { createClient } from "@/lib/supabase-server";
import { formatarHorario } from "@/lib/utils";
import Link from "next/link";
import { CalendarDays, Users, ChevronRight, MapPin, Clock } from "lucide-react";

type Pelada = {
  id: string;
  date: string;
  time: string;
  location: string;
  groups?: { name: string };
  match_confirmations?: Array<{ status: string; user_id: string }>;
};

type GroupMembership = {
  role: string;
  groups: {
    id: string;
    name: string;
    description?: string;
  };
};

type Profile = {
  name: string;
};

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", authUser!.id)
    .single();

  const profileData = profile as Profile | null;

  const proximasPeladas = (
    await supabase
      .from("matches")
      .select(
        `
      *,
      groups ( id, name ),
      match_confirmations ( status, user_id )
    `,
      )
      .eq("status", "agendada")
      .gte("date", new Date().toISOString().split("T")[0])
      .order("date", { ascending: true })
      .limit(5)
  ).data as Pelada[] | null;

  const meusGrupos = (
    await supabase
      .from("group_members")
      .select(
        `
      role,
      groups ( id, name, description )
    `,
      )
      .eq("user_id", authUser!.id)
      .limit(5)
  ).data as GroupMembership[] | null;

  const primeiroNome = profileData?.name.split(" ")[0] ?? "jogador";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Olá, {primeiroNome}! 👋
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Veja o que está rolando nas suas peladas
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2">
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-100">
              <CalendarDays size={20} className="text-brand-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {proximasPeladas?.length ?? 0}
              </p>
              <p className="text-xs text-gray-500">Peladas agendadas</p>
            </div>
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
              <Users size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {meusGrupos?.length ?? 0}
              </p>
              <p className="text-xs text-gray-500">Grupos</p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Próximas peladas</h2>
          <Link
            href="/grupos"
            className="text-sm text-brand-600 hover:text-brand-700"
          >
            Ver grupos
          </Link>
        </div>

        {!proximasPeladas || proximasPeladas.length === 0 ? (
          <div className="card p-8 text-center">
            <p className="text-sm text-gray-500">Nenhuma pelada agendada.</p>
            <Link href="/grupos" className="btn-primary mt-4 inline-flex">
              Ver meus grupos
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {proximasPeladas.map((pelada) => {
              const confirmados =
                pelada.match_confirmations?.filter(
                  (c) => c.status === "confirmado",
                ).length ?? 0;

              const minhaConfirmacao = pelada.match_confirmations?.find(
                (c) => c.user_id === authUser!.id,
              );

              return (
                <Link
                  key={pelada.id}
                  href={`/peladas/${pelada.id}`}
                  className="card flex items-center gap-4 p-4 transition hover:shadow-md"
                >
                  <div className="flex h-12 w-12 flex-shrink-0 flex-col items-center justify-center rounded-xl bg-brand-50 text-center">
                    <span className="text-xs font-medium text-brand-600">
                      {new Date(pelada.date + "T12:00:00")
                        .toLocaleDateString("pt-BR", { month: "short" })
                        .toUpperCase()}
                    </span>
                    <span className="text-lg font-bold leading-none text-brand-700">
                      {new Date(pelada.date + "T12:00:00").getDate()}
                    </span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-gray-900">
                      {pelada.groups?.name}
                    </p>
                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {formatarHorario(pelada.time)}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin size={12} />
                        {pelada.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users size={12} />
                        {confirmados} confirmados
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-shrink-0 items-center gap-2">
                    {minhaConfirmacao ? (
                      <span
                        className={`badge ${
                          minhaConfirmacao.status === "confirmado"
                            ? "badge-green"
                            : minhaConfirmacao.status === "talvez"
                              ? "badge-yellow"
                              : "badge-red"
                        }`}
                      >
                        {minhaConfirmacao.status === "confirmado"
                          ? "Vou"
                          : minhaConfirmacao.status === "talvez"
                            ? "Talvez"
                            : "Não vou"}
                      </span>
                    ) : (
                      <span className="badge badge-gray">Pendente</span>
                    )}
                    <ChevronRight size={16} className="text-gray-400" />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Meus grupos</h2>
          <Link
            href="/grupos/novo"
            className="text-sm text-brand-600 hover:text-brand-700"
          >
            + Novo grupo
          </Link>
        </div>

        {!meusGrupos || meusGrupos.length === 0 ? (
          <div className="card p-8 text-center">
            <p className="text-sm text-gray-500">
              Você ainda não participa de nenhum grupo.
            </p>
            <Link href="/grupos/novo" className="btn-primary mt-4 inline-flex">
              Criar um grupo
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {meusGrupos.map((membro) => (
              <Link
                key={membro.groups.id}
                href={`/grupos/${membro.groups.id}`}
                className="card flex items-center gap-3 p-4 transition hover:shadow-md"
              >
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-brand-100 font-bold text-brand-700">
                  {membro.groups.name[0].toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-gray-900">
                    {membro.groups.name}
                  </p>
                  {membro.groups.description && (
                    <p className="truncate text-xs text-gray-500">
                      {membro.groups.description}
                    </p>
                  )}
                </div>
                <div className="flex flex-shrink-0 items-center gap-2">
                  {membro.role === "admin" && (
                    <span className="badge badge-blue">Admin</span>
                  )}
                  <ChevronRight size={16} className="text-gray-400" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
