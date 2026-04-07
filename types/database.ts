/**
 * Tipos gerados a partir do schema do banco de dados.
 *
 * Para regenerar automaticamente após mudanças no banco, execute:
 *   npx supabase gen types typescript --project-id rwfjpsmytagukzdtojcx > types/database.ts
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          name: string;
          email: string;
          avatar_url: string | null;
          position: string | null;
          created_at: string;
          senha: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          avatar_url?: string | null;
          position?: string | null;
          created_at?: string;
          senha: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          avatar_url?: string | null;
          position?: string | null;
          created_at?: string;
          senha?: string;
        };
      };
      groups: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          created_by: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          created_by: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          created_by?: string;
          created_at?: string;
        };
      };
      group_members: {
        Row: {
          id: string;
          group_id: string;
          user_id: string;
          role: "admin" | "member";
          joined_at: string;
        };
        Insert: {
          id?: string;
          group_id: string;
          user_id: string;
          role?: "admin" | "member";
          joined_at?: string;
        };
        Update: {
          id?: string;
          group_id?: string;
          user_id?: string;
          role?: "admin" | "member";
          joined_at?: string;
        };
      };
      matches: {
        Row: {
          id: string;
          group_id: string;
          date: string;
          time: string;
          location: string;
          players_per_team: number;
          status: "agendada" | "em_andamento" | "finalizada" | "cancelada";
          created_at: string;
        };
        Insert: {
          id?: string;
          group_id: string;
          date: string;
          time: string;
          location: string;
          players_per_team?: number;
          status?: "agendada" | "em_andamento" | "finalizada" | "cancelada";
          created_at?: string;
        };
        Update: {
          id?: string;
          group_id?: string;
          date?: string;
          time?: string;
          location?: string;
          players_per_team?: number;
          status?: "agendada" | "em_andamento" | "finalizada" | "cancelada";
          created_at?: string;
        };
      };
      match_confirmations: {
        Row: {
          id: string;
          match_id: string;
          user_id: string;
          status: "confirmado" | "recusado" | "talvez";
          responded_at: string;
        };
        Insert: {
          id?: string;
          match_id: string;
          user_id: string;
          status: "confirmado" | "recusado" | "talvez";
          responded_at?: string;
        };
        Update: {
          id?: string;
          match_id?: string;
          user_id?: string;
          status?: "confirmado" | "recusado" | "talvez";
          responded_at?: string;
        };
      };
      teams: {
        Row: {
          id: string;
          match_id: string;
          name: string;
          score: number;
        };
        Insert: {
          id?: string;
          match_id: string;
          name: string;
          score?: number;
        };
        Update: {
          id?: string;
          match_id?: string;
          name?: string;
          score?: number;
        };
      };
      team_players: {
        Row: {
          id: string;
          team_id: string;
          user_id: string;
        };
        Insert: {
          id?: string;
          team_id: string;
          user_id: string;
        };
        Update: {
          id?: string;
          team_id?: string;
          user_id?: string;
        };
      };
      match_goals: {
        Row: {
          id: string;
          match_id: string;
          team_id: string;
          user_id: string;
          scored_at: string;
        };
        Insert: {
          id?: string;
          match_id: string;
          team_id: string;
          user_id: string;
          scored_at?: string;
        };
        Update: {
          id?: string;
          match_id?: string;
          team_id?: string;
          user_id?: string;
          scored_at?: string;
        };
      };
      match_payments: {
        Row: {
          id: string;
          match_id: string;
          user_id: string;
          amount: number;
          paid: boolean;
          paid_at: string | null;
        };
        Insert: {
          id?: string;
          match_id: string;
          user_id: string;
          amount: number;
          paid?: boolean;
          paid_at?: string | null;
        };
        Update: {
          id?: string;
          match_id?: string;
          user_id?: string;
          amount?: number;
          paid?: boolean;
          paid_at?: string | null;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
};

// ─── Tipos auxiliares para uso nos componentes ───────────────────────────────

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];

export type InsertTables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];

export type UpdateTables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];

// Tipos nomeados para facilitar o uso
export type User = Tables<"users">;
export type Group = Tables<"groups">;
export type GroupMember = Tables<"group_members">;
export type Match = Tables<"matches">;
export type MatchConfirmation = Tables<"match_confirmations">;
export type Team = Tables<"teams">;
export type TeamPlayer = Tables<"team_players">;
export type MatchGoal = Tables<"match_goals">;
export type MatchPayment = Tables<"match_payments">;
