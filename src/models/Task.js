import { BaseModel } from './BaseModel';
import { getFromStorage, addToStorage } from "../utils";

export default class Task extends BaseModel {
  constructor (text, position, user) {
    super();
    this.text = text;
    this.position = position;
    this.storageKey = "tasks";
    this.user = user;
  }

  static save(task) {
    try {
      addToStorage(task, task.storageKey);
      return true;
    } catch (e) {
      throw new Error(e);
    }
  }
}