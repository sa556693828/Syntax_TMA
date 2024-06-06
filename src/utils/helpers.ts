import { UserData } from "@/types/types";

export function getUsernameOrName({
  user_id,
  username,
  first_name,
  last_name,
}: UserData) {
  if (username) {
    return `${username}`;
  }

  if (first_name && first_name.trim().length > 0) {
    if (last_name && last_name.trim().length > 0) {
      return `${first_name} ${last_name}`;
    }

    return `${first_name}`;
  }

  if (last_name) {
    return `${last_name}`;
  }

  return `${user_id}`;
}
