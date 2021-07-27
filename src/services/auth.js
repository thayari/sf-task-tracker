import { appState } from "../app";
import { User } from "../models/User";

export const authUser = function (login, password) {
  let user = new User(login, password, false);
  if (!user.hasAccess) return false;
  appState.currentUser = user.getUser();
  return true;
};
