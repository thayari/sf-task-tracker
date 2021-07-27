export const getFromStorage = function (key) {
  return JSON.parse(localStorage.getItem(key) || "[]");
};

export const addToStorage = function (obj, key) {
  const storageData = getFromStorage(key);
  storageData.push(obj);
  localStorage.setItem(key, JSON.stringify(storageData));
};

export const updateStorageData = function (obj, key) {
  const dataArr = JSON.parse(localStorage.getItem(key) || "[]");
  const newDataArr = dataArr && dataArr.map(t => t.id === obj.id ? obj : t);
  localStorage.setItem(key, JSON.stringify(newDataArr));
}

export const removeFromStorage = function (id, key) {
  const storageData = getFromStorage(key);
  const i = storageData.findIndex(item => item.id == id);
  storageData.splice(i, 1);
  localStorage.setItem(key, JSON.stringify(storageData));
}

export const generateTestUser = function (User) {
  localStorage.clear();
  const testUser = new User("test", "qwerty123", false);
  const testAdmin = new User("admin", "admin", true);
  User.save(testUser);
  User.save(testAdmin);
};

// filter tasks from db by user id
export const filterUserTasks = function (id) {
  const tasks = getFromStorage('tasks');
  return tasks.filter((task) => task.user == id);
}
