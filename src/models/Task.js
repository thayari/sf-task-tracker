import { BaseModel } from './BaseModel';
import { appState } from '../app';
import { updateStorageData, addToStorage, removeFromStorage } from "../utils";

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
      addToStorage(task, 'tasks');
      return true;
    } catch (e) {
      throw new Error(e);
    }
  }

  static delete(id) {
    try {
      removeFromStorage(id, 'tasks');
      return true;
    } catch (e) {
      throw new Error(e);
    }
  }

  static edit(id, text) {
    const editTask = appState.currentTasks.find((item) => item.id == id);
    editTask.text = text;
    try {
      updateStorageData(editTask, 'tasks');
      return true;
    } catch (e) {
      throw new Error(e);
    }
  }
}