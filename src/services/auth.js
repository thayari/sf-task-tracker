import { appState } from "../app";
import { User } from "../models/User";

export const authUser = function (login, password) {
  const user = new User(login, password, false);
  if (!user.hasAccess) return false;
  user.checkIsAdmin();
  appState.currentUser = user;
  return true;
};
