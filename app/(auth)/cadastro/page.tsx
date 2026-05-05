"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient, createRawClient } from "@/lib/supabase";
import { POSICOES, type Posicao } from "@/lib/utils";

export default function CadastroPage() {
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [posicao, setPosicao] = useState<Posicao | "">("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleCadastro(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    setLoading(true);

    if (senha.length < 6) {
      setErro("A senha precisa ter pelo menos 6 caracteres.");
      setLoading(false);
      return;
    }

    const supabase = createClient();

    const { error, data } = await supabase.auth.signUp({
      email,
      password: senha,
      options: {
        data: { full_name: nome },
      },
    });

    if (error) {
      setErro(
        error.message === "User already registered"
          ? "Este email já está cadastrado."
          : "Erro ao criar conta. Tente novamente.",
      );
      setLoading(false);
      return;
    }

    // Como o trigger do Supabase cria a linha na tabala `users` de forma automatizada, 
    // nós podemos apenas atualizar o valor de posição com o ID do usuário criado.
    if (posicao && data.user) {
      const rawSupabase = createRawClient();
      const { error: posError } = await rawSupabase
        .from("users")
        .update({ position: posicao })
        .eq("id", data.user.id);

      if (posError) {
        setErro("Erro ao salvar a posição preferida.");
        setLoading(false);
        return;
      }
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="card p-8">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Criar conta</h2>
        <p className="mt-1 text-sm text-gray-500">
          Preencha seus dados para começar
        </p>
      </div>

      <form onSubmit={handleCadastro} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Nome completo
          </label>
          <input
            type="text"
            required
            placeholder="João Silva"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="input-base"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            required
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-base"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Senha
          </label>
          <input
            type="password"
            required
            placeholder="mínimo 6 caracteres"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="input-base"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Posição no campo
          </label>
          <select
            value={posicao}
            onChange={(e) => setPosicao(e.target.value as Posicao)}
            className="input-base"
          >
            <option value="">Selecione sua posição</option>
            {Object.entries(POSICOES).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {erro && <p className="text-sm text-red-600">{erro}</p>}

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? "Criando conta..." : "Criar conta"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        Já tem conta?{" "}
        <Link
          href="/login"
          className="font-medium text-brand-600 hover:text-brand-700"
        >
          Faça login
        </Link>
      </p>
    </div>
  );
}
