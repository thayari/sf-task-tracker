import { appState, ui } from "../app";
import { getFromStorage } from "../utils";

export const update = () => {
  appState.currentTasks = getFromStorage('tasks');
  ui.generateTasks();
  appState.setTaskCount();
  ui.activeTasks.textContent = appState.taskCount.backlog;
  ui.finishedTasks.textContent = appState.taskCount.finished;
  ui.assignButtonsAvail();
}