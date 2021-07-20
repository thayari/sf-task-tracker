export class State {
  constructor() {
    this.currentUser = null;
    this.currentTasks = null;
    this.positions = ['backlog', 'ready', 'inprogress', 'finished'];
  }
  set currentUser(user) {
    this._currentUser = user;
  }
  get currentUser() {
    return this._currentUser;
  }
  set currentTasks(tasks) {
    this._currentTasks = tasks;
  }
  get currentTasks() {
    return this._currentTasks;
  }
}
