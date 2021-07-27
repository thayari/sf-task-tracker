import "bootstrap/dist/css/bootstrap.min.css";
import { Tooltip, Toast, Popover } from 'bootstrap';
import "./styles/style.css";
import taskFieldTemplate from "./templates/taskField.html";
import noAccessTemplate from "./templates/noAccess.html";
import adminFieldTemplate from "./templates/adminField.html";
import { generateTestUser } from './utils';
import { User } from "./models/User";
import { State } from "./state";
import { authUser } from "./services/auth";
import Interface from "./models/Interface";

export const appState = new State();
export const ui = new Interface();

ui.initializeHeader();

generateTestUser(User);

const loginForm = document.querySelector('#app-login-form')
loginForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const formData = new FormData(loginForm);
  const login = formData.get("login");
  const password = formData.get("password");

  let fieldHTMLContent = authUser(login, password)
    ? taskFieldTemplate
    : noAccessTemplate;

  document.querySelector("#content").innerHTML = fieldHTMLContent;

  if (appState.currentUser.isAdmin) {
    document.querySelector("#content").insertAdjacentHTML('afterbegin', adminFieldTemplate);
  }
  
  ui.init();

});
