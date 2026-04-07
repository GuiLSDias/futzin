"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import type { User } from "@/types";

interface UseUserReturn {
  authUser: SupabaseUser | null;
  profile: User | null;
  loading: boolean;
}

/**
 * Hook para acessar o usuário autenticado e seu perfil
 * Uso: const { authUser, profile, loading } = useUser()
 */
export function useUser(): UseUserReturn {
  const [authUser, setAuthUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    async function carregarUsuario() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setAuthUser(user);

      if (user) {
        const { data } = await supabase
          .from("users")
          .select("*")
          .eq("id", user.id)
          .single();

        setProfile(data);
      }

      setLoading(false);
    }

    carregarUsuario();

    // Atualiza quando a sessão mudar (login/logout)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthUser(session?.user ?? null);
      if (!session?.user) setProfile(null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return { authUser, profile, loading };
}
