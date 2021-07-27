import { appState } from "../app";

export const logout = function () {
  appState.currentUser = null;
  appState.currentTasks = null;
  appState.taskCount = {
    backlog: 0,
    ready: 0,
    inprogress: 0,
    finished: 0,
  };
  return true;
};
