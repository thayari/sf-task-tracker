import { appState, ui } from "../app";
import { getFromStorage } from "../utils";

export const update = () => {
  appState.currentTasks = getFromStorage('tasks');
  ui.generateTasks();
  appState.setTaskCount();
  ui.assignButtonsAvail();
}