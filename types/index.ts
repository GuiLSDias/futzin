export type {
  User,
  Group,
  GroupMember,
  Match,
  MatchConfirmation,
  Team,
  TeamPlayer,
  MatchGoal,
  MatchPayment,
  Tables,
  InsertTables,
  UpdateTables,
} from "./database";

// Tipos compostos usados nas páginas (com joins)

import type { Tables } from "./database";

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
