import "bootstrap/dist/css/bootstrap.min.css";
import { Tooltip, Toast, Popover } from 'bootstrap';
import "./styles/style.css";
import taskFieldTemplate from "./templates/taskField.html";
import noAccessTemplate from "./templates/noAccess.html";
import { getFromStorage, generateTestUser, removeFromStorage, addToStorage } from './utils';
import { User } from "./models/User";
import { State } from "./state";
import { authUser } from "./services/auth";
import { Task } from "./models/Task";

export const appState = new State();

const loginForm = document.querySelector("#app-login-form");

generateTestUser(User);

// всегда быть залогиненным -->
  authUser("test", "qwerty123");
  document.querySelector("#content").innerHTML = taskFieldTemplate;
// <-- для разработки, потом убрать

// обработка кнопки add
const buttonsAdd = document.querySelectorAll('.app-add-btn');
buttonsAdd.forEach((elem) => {
  elem.addEventListener('click', () => {
    if (elem.dataset.function == 'add') {
      if (elem.dataset.id == 'backlog') {
        elem.previousElementSibling.innerHTML = '<input type="text" class="app-input-task">';
      } else {
        elem.previousElementSibling.innerHTML = generateDropdown(elem.dataset.id);
      }
      elem.innerHTML = 'Submit';
      elem.dataset.function = 'submit';
    } else {
      const newTaskText = document.querySelector('.app-input-task').value;
      if (newTaskText != '') {
        const task = new Task(newTaskText, elem.dataset.id, appState.currentUser.id);
        Task.save(task);
      }
      generateTasks();
      elem.previousElementSibling.innerHTML = '';
      elem.innerHTML = '+ Add task';
      elem.dataset.function = 'add';
    };
  });
});

// отрисовать таски
function generateTasks() {
  appState.currentTasks = getFromStorage('tasks');
  document.querySelectorAll('.app-tasks').forEach((elem) => {
    elem.innerHTML = '';
    const id = elem.dataset.id;
    const filteredTasks = appState.currentTasks.filter((item) => item.position === id);
    filteredTasks.forEach((item) => {
      elem.insertAdjacentHTML('beforeend', `<li>${item.text}</li>`);
    });
  });
};

function generateDropdown(id) {
  const prevPosition = appState.positions[appState.positions.indexOf(id) - 1];
  const list = appState.currentTasks.filter((item) => item.position === prevPosition);
  let htmlList = '';
  for (let item of list) {
    htmlList += `<li><a class="dropdown-item" href="#" data-id="${item.id}">${item.text}</a></li>`
  };
  const html = `<div class="dropdown">
      <a class="btn btn-secondary dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false">
        Dropdown link
      </a>
      <ul class="dropdown-menu" aria-labelledby="dropdownMenuLink">
      ${htmlList}
      </ul>
    </div>`;
  return html;
};

function handleDropdowns() {
  const inputElems = document.querySelectorAll('.app-input-wrapper');
  inputElems.forEach((elem) => {
    elem.addEventListener('click', (e) => {
      e.preventDefault();
      if (e.target.classList.contains('dropdown-item')) {
        const targetTask = appState.currentTasks.find((task) => task.id === e.target.dataset.id);
        removeFromStorage(targetTask, 'tasks');
        targetTask.position = elem.dataset.id;
        addToStorage(targetTask, 'tasks');
        elem.innerHTML = '';
        generateTasks();
      };
    });
  })
};

handleDropdowns();


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
