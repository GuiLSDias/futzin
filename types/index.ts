export type { Database, Json } from "./database";

// Type helpers para acesso facilitado
export type Tables<
  T extends keyof import("./database").Database["public"]["Tables"],
> = import("./database").Database["public"]["Tables"][T]["Row"];

// Aliases para tipos principais
export type User = Tables<"users">;
export type Group = Tables<"groups">;
export type GroupMember = Tables<"group_members">;
export type Match = Tables<"matches">;
export type MatchConfirmation = Tables<"match_confirmations">;
export type Team = Tables<"teams">;
export type TeamPlayer = Tables<"team_players">;
export type MatchGoal = Tables<"match_goals">;
export type MatchPayment = Tables<"match_payments">;

// Tipos de Insert/Update
export type InsertTables<
  T extends keyof import("./database").Database["public"]["Tables"],
> = import("./database").Database["public"]["Tables"][T]["Insert"];
export type UpdateTables<
  T extends keyof import("./database").Database["public"]["Tables"],
> = import("./database").Database["public"]["Tables"][T]["Update"];

// Tipos compostos usados nas páginas (com joins)
export type GroupWithMembers = Tables<"groups"> & {
  group_members: (Tables<"group_members"> & {
    users: Tables<"users">;
  })[];
};

export type MatchWithDetails = Tables<"matches"> & {
  groups: Pick<Tables<"groups">, "id" | "name">;
  match_confirmations: (Tables<"match_confirmations"> & {
    users: Pick<Tables<"users">, "id" | "name" | "avatar_url" | "position">;
  })[];
};

export type TeamWithPlayers = Tables<"teams"> & {
  team_players: (Tables<"team_players"> & {
    users: Pick<Tables<"users">, "id" | "name" | "avatar_url" | "position">;
  })[];
};
