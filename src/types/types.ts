export type TableName =
  | "artist"
  | "users"
  | "msgs"
  | "chat_members"
  | "group_config"
  | "group_tags"
  | "user_in_chat";
export const tableMap: Record<TableName, TableName> = {
  artist: "artist",
  users: "users",
  msgs: "msgs",
  chat_members: "chat_members",
  group_config: "group_config",
  group_tags: "group_tags",
  user_in_chat: "user_in_chat",
};
export type UserData = {
  user_id: number | null;
  username: string;
  first_name: string;
  last_name: string;
  evm_address: string;
  google: string;
  twitter: string;
  github: string;
  recaptcha: boolean;
  email: string;
  score: Array<number>;
  ton_address: string;
  inviteFrom_id: number | null;
};
export type UserTG = {
  allowsWriteToPm: boolean;
  firstName: string;
  id: number | null;
  isPremium: boolean;
  languageCode: string;
  lastName: string;
  username: string;
};
