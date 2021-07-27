import { appState, ui } from "../app";
import { filterUserTasks } from "../utils";

export const update = () => {
  appState.currentTasks = filterUserTasks(appState.currentUser.id);
  ui.generateTasks();
  appState.setTaskCount();
  ui.activeTasks.textContent = appState.taskCount.backlog;
  ui.finishedTasks.textContent = appState.taskCount.finished;
  ui.assignButtonsAvail();
}