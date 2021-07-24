import "bootstrap/dist/css/bootstrap.min.css";
import { Tooltip, Toast, Popover } from 'bootstrap';
import "./styles/style.css";
import taskFieldTemplate from "./templates/taskField.html";
import noAccessTemplate from "./templates/noAccess.html";
import { getFromStorage, generateTestUser, removeFromStorage, addToStorage } from './utils';
import { User } from "./models/User";
import { State } from "./state";
import { authUser } from "./services/auth";
import Interface from "./models/Interface";

export const appState = new State();
export const ui = new Interface();

const loginForm = document.querySelector("#app-login-form");

generateTestUser(User);

// всегда быть залогиненным -->
  authUser("test", "qwerty123");
  document.querySelector("#content").innerHTML = taskFieldTemplate;
// <-- для разработки, потом убрать

ui.init();



loginForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const formData = new FormData(loginForm);
  const login = formData.get("login");
  const password = formData.get("password");

  let fieldHTMLContent = authUser(login, password)
    ? taskFieldTemplate
    : noAccessTemplate;

  document.querySelector("#content").innerHTML = fieldHTMLContent;
});
