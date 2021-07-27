import { appState } from "../app";
import Task from "./Task";
import { update } from "../services/update";
import { logout } from "../services/logout";
import { getFromStorage } from "../utils";
import { User } from "./User";

export default class Interface {
  constructor() {
    this.appState = appState;
  }

  init() {
    this.buttonsAdd = document.querySelectorAll('.app-add-btn');
    this.inputElems = document.querySelectorAll('.app-input-wrapper');
    this.taskElems = document.querySelectorAll('.app-tasks');
    this.loginForm = document.querySelector("#app-login-form");
    this.activeTasks = document.querySelector('#active-tasks');
    this.finishedTasks = document.querySelector('#finished-tasks');
    this.userMenu = {
      elem: document.querySelector('#user-menu'),
      active: false,
    };

    this.hideLoginForm();

    update();

    if (appState.currentUser.isAdmin) {
      this.usersForm = document.querySelector('#users-form')
      this.generateUsersList();
    }
    this.assignEventListeners();
  }

  assignEventListeners() {
    this.buttonsAdd.forEach((elem) => {
      elem.addEventListener('click', () => this.handleAddBtn(elem));
    });
    this.inputElems.forEach((elem) => {
      elem.addEventListener('click', this.handleDropdowns);
    });
    this.taskElems.forEach((elem) => {
      elem.addEventListener('click', this.handleDeleteBtn);
      elem.addEventListener('click', this.handleEditBtn);
    })
    

    if (this.usersListElem) {
      this.usersListElem.addEventListener('click', (e) => this.handleDeleteUserBtn(e));
      document.querySelector('#users-form').addEventListener('submit', (e) => this.handleAddUserForm(e));
    }
  };

  initializeHeader() {
    this.userInfoElem = document.querySelector('#user-info');
    this.userInfoElem.addEventListener('click', (e) => this.handleUserInfoDropdown(e));
  }

  handleAddUserForm(e) {
    e.preventDefault();
    const formData = new FormData(this.usersForm);
    
    const login = formData.get('admin-input-login');
    const password = formData.get('admin-input-password');
    const isAdmin = formData.get('admin-input-isadmin');
    const user = new User(login, password, isAdmin ? true : false);
    User.save(user, 'users');
    this.usersForm.reset();
    this.generateUsersList();
  }

  handleAddBtn(elem) {
    if (elem.dataset.function == 'add') {
      if (elem.dataset.id == 'backlog') { // первый столбец - input
        elem.previousElementSibling.innerHTML = '<input type="text" class="app-input-task form-control">';
        Interface.changeBtn(elem, 'Submit', 'submit'); // изменить кнопку на submit
      } else { // остальные столбцы - dropdown
        elem.previousElementSibling.innerHTML = this.generateDropdown(elem.dataset.id);
      }
    } else {
      const newTaskText = document.querySelector('.app-input-task').value;
      if (newTaskText != '') {
        const task = new Task(newTaskText, elem.dataset.id, appState.currentUser.id);
        Task.save(task);
      }
      update();
      // убрать input или dropdown
      elem.previousElementSibling.innerHTML = '';
      Interface.changeBtn(elem, '+ Add task', 'add'); // изменить кнопку на Add
    };
  }

  handleDeleteBtn(e) {
    if (e.target.classList.contains('task-delete')) {
      Task.delete(e.target.parentNode.dataset.id);
      update();
    }
  };

  handleEditBtn(e) {
    if (e.target.classList.contains('task-edit')) {
      const id = e.target.parentNode.dataset.id;
      const taskElem = document.querySelector(`.app-task[data-id="${id}"]`);
      const input = document.createElement('input');
      let editedText = '';
      input.classList = 'form-control';
      input.setAttribute('type', 'text');
      taskElem.insertAdjacentElement('beforeend', input);
      input.value = taskElem.querySelector('.app-task__text').innerHTML;
      input.addEventListener('keydown', (e) => {
        if (e.code == 'Enter') {
          e.preventDefault();
          editedText = input.value;
          Task.edit(id, editedText);
          input.remove();
          update();  
        }
      });
    }
  };

  handleDeleteUserBtn(e) {
    if (e.target.classList.contains('user-delete')) {
      User.delete(e.target.parentNode.dataset.id);
      this.generateUsersList();
    }

  }

// отрисовать таски

  generateTasks() {
    this.taskElems.forEach((elem) => {
      elem.innerHTML = '';
      const id = elem.dataset.id;
      const filteredTasks = appState.currentTasks.filter((item) => item.position === id);
      filteredTasks.forEach((item) => {
        elem.insertAdjacentHTML('beforeend', `<div class="card app-task mb-2" data-id="${item.id}">
          <div class="card-body">
            <div class="app-task__buttons float-end" data-id="${item.id}">
              <img class="app-task__icon task-edit" src="https://img.icons8.com/material-outlined/24/000000/edit--v1.png"/>
              <img class="app-task__icon task-delete" src="https://img.icons8.com/material-outlined/24/000000/delete-sign.png"/>
            </div>
            <span class="app-task__text">${item.text}</span>
          </div>
        </div>`);
      });
    });
  };

  generateUsersList() {
    let users = getFromStorage('users');
    this.usersListElem = document.querySelector('#users-list');
    this.usersListElem.innerHTML = '';
    users.forEach((user) => {
      this.usersListElem.insertAdjacentHTML('beforeend', `<div class="card">
      <div class="card-body" data-id="${user.id}">
        <div class="float-end" data-id="${user.id}">
          <img class="app-task__icon user-delete" src="https://img.icons8.com/material-outlined/24/000000/delete-sign.png"/>
        </div>
        <span>${user.login}</span>
        <span>${user.password}</span>
      </div>
    </div>`)
    });
  }

  generateDropdown(id) {
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
  
  handleDropdowns (e) {
    e.preventDefault();
    if (e.target.classList.contains('dropdown-item')) {
      let targetTask = appState.currentTasks.find((task) => task.id === e.target.dataset.id);
      Task.delete(e.target.dataset.id);
      targetTask.position = e.currentTarget.dataset.id;
      Task.save(targetTask);
      update();
      e.currentTarget.innerHTML = '';
      Interface.changeBtn(e.currentTarget.parentNode.querySelector('.app-add-btn'), '+ Add task', 'add');
    };
  };

  handleUserInfoDropdown (e) {
    if (!this.userMenu.active) {
      Interface.showElem(this.userMenu.elem);
      this.userMenu.active = true;
      document.querySelector('#dropdown-arrow').classList.add('active');
    } else {
      if (e.target.id == 'logout') {
        this.clearInterface();
        logout();
      }
      Interface.hideElem(this.userMenu.elem);
      this.userMenu.active = false;
      document.querySelector('#dropdown-arrow').classList.remove('active');
    }
  };

  clearInterface() {
    document.querySelector('#content').innerHTML = 'Please Sign In to see your tasks!';
    Interface.hideElem(this.userInfoElem);
    Interface.showElem(this.loginForm);
    this.activeTasks.textContent = 0;
    this.finishedTasks.textContent = 0;
    this.loginForm.reset();
  }

  // if the previous column is empty, disable button
  assignButtonsAvail() {
    for (let i = 0; i < 3; i += 1) {
      if (appState.taskCount[this.buttonsAdd[i].dataset.id] == 0) {
        this.disableBtn(this.buttonsAdd[i+1]);
      } else {
        this.enableBtn(this.buttonsAdd[i+1]);
      }
    }
  };

  hideLoginForm() {
    if (appState.currentUser) {
      Interface.hideElem(this.loginForm);
      Interface.showElem(this.userInfoElem);
    }
  }

  static hideElem(elem) {
    elem.classList.add('d-none');
  }
  static showElem(elem) {
    elem.classList.remove('d-none');
  }
  disableBtn(elem) {
    elem.classList.add('disabled');
    elem.disabled = true;
  };
  enableBtn(elem) {
    elem.classList.remove('disabled');
    elem.disabled = false;
  };
  static changeBtn(elem, content, func) {
    elem.innerHTML = content;
    elem.dataset.function = func;
  }
}
