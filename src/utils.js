export const getFromStorage = function (key) {
  return JSON.parse(localStorage.getItem(key) || "[]");
};

export const addToStorage = function (obj, key) {
  const storageData = getFromStorage(key);
  storageData.push(obj);
  localStorage.setItem(key, JSON.stringify(storageData));
};

export const removeFromStorage = function (id, key) {
  const storageData = getFromStorage(key);
  const i = storageData.findIndex(item => item.id == id);
  storageData.splice(i, 1);
  localStorage.setItem(key, JSON.stringify(storageData));
}

export const generateTestUser = function (User) {
  localStorage.clear();
  const testUser = new User("test", "qwerty123");
  User.save(testUser);
};
