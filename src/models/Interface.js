import { appState, ui } from "../app";
import Task from "./Task";
import { getFromStorage, removeFromStorage, addToStorage } from '../utils';
import { update } from "../services/update";

export default class Interface {
  constructor() {
    this.appState = appState;
  }

  init() {
    this.buttonsAdd = document.querySelectorAll('.app-add-btn');
    this.inputElems = document.querySelectorAll('.app-input-wrapper');

    this.assignEventListeners();
    update();
  }

  assignEventListeners() {
    this.buttonsAdd.forEach((elem) => {
      elem.addEventListener('click', () => this.handleAddBtn(elem));
    });
    this.inputElems.forEach((elem) => {
      elem.addEventListener('click', this.handleDropdowns);
    })
  };

  handleAddBtn(elem) {
    if (elem.dataset.function == 'add') {
      if (elem.dataset.id == 'backlog') { // первый столбец - input
        elem.previousElementSibling.innerHTML = '<input type="text" class="app-input-task">';
      } else { // остальные столбцы - dropdown
        elem.previousElementSibling.innerHTML = this.generateDropdown(elem.dataset.id);
      }
      // изменить кнопку на submit
      Interface.changeBtn(elem, 'Submit', 'submit');
    } else {
      const newTaskText = document.querySelector('.app-input-task').value;
      if (newTaskText != '') {
        const task = new Task(newTaskText, elem.dataset.id, appState.currentUser.id);
        Task.save(task);
      }
      update();
      // убрать input или dropdown
      elem.previousElementSibling.innerHTML = '';
      // изменить кнопку на Add
      Interface.changeBtn(elem, '+ Add task', 'add');
    };
  }

// отрисовать таски

  generateTasks() {
    document.querySelectorAll('.app-tasks').forEach((elem) => {
      elem.innerHTML = '';
      const id = elem.dataset.id;
      const filteredTasks = appState.currentTasks.filter((item) => item.position === id);
      filteredTasks.forEach((item) => {
        elem.insertAdjacentHTML('beforeend', `<li>${item.text}</li>`);
      });
    });
  };

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
        removeFromStorage(e.target.dataset.id, 'tasks');
        targetTask.position = e.currentTarget.dataset.id;
        addToStorage(targetTask, 'tasks');
        update();
        e.currentTarget.innerHTML = '';
        Interface.changeBtn(e.currentTarget.parentNode.querySelector('.app-add-btn'), '+ Add task', 'add');
      };
  };

  // если в предыдущем столбце нет тасков, disable кнопку add
  assignButtonsAvail() {
    for (let i = 0; i < 3; i += 1) {
      if (appState.taskCount[this.buttonsAdd[i].dataset.id] == 0) {
        this.disableBtn(this.buttonsAdd[i+1]);
      } else {
        this.enableBtn(this.buttonsAdd[i+1]);
      }
    }
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
