export class State {
  constructor() {
    this.currentUser = null;
    this.currentTasks = null;
    this.positions = ['backlog', 'ready', 'inprogress', 'finished'];
    this.taskCount = {
      backlog: 0,
      ready: 0,
      inprogress: 0,
      finished: 0,
    };
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

  setTaskCount() {
    if (this.currentTasks != null) {
      this.positions.forEach((pos) => {
        this.taskCount[pos] = this.currentTasks.filter((item) => item.position == pos).length;
      })
    }
  }
}
