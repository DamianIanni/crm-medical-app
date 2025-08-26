import api from "./http";

export const deleteAccount = () => {
  return api.delete(`/account/me`);
};

export const updateAccount = (
  userId: string,
  updated: { first_name?: string; last_name?: string }
) => {
  return api.patch(`/account/me`, { ...updated, user_id: userId });
};
