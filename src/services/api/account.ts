import { request } from "./http";

export async function deleteAccount() {
  return request({
    url: `/account/me`,
    method: "DELETE",
  });
}

export async function updateAccount(
  userId: string,
  updated: { first_name?: string; last_name?: string }
) {
  return request({
    url: `/account/me`,
    method: "PATCH",
    data: { ...updated, user_id: userId },
  });
}
