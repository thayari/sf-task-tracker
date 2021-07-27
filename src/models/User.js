import { BaseModel } from "./BaseModel";
import { getFromStorage, addToStorage, removeFromStorage } from "../utils";

export class User extends BaseModel {
  constructor(login, password, isAdmin = false) {
    super();
    this.login = login;
    this.password = password;
    this.isAdmin = isAdmin;
    this.storageKey = "users";
  }

  get hasAccess() {
    let users = getFromStorage(this.storageKey);
    if (users.length == 0) return false;
    for (let user of users) {
      if (user.login == this.login && user.password == this.password)
        return true;
    }
    return false;
  }

  checkIsAdmin() {
    let users = getFromStorage(this.storageKey);
    let user = users.filter((user) => user.login == this.login && user.password == this.password)[0];
    this.isAdmin = user.isAdmin;
  }

  static save(user) {
    try {
      addToStorage(user, user.storageKey);
      return true;
    } catch (e) {
      throw new Error(e);
    }
  }

  static delete(id) {
    try {
      removeFromStorage(id, 'users');
      return true;
    } catch (e) {
      throw new Error(e);
    }
  }
}
