import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "../Authentication/reducer";
import tasksReducer from "../Tasks/reducer";

const authPersistConfig = {
  key: "auth",
  storage: storage,
  blacklist: [],
};
const tasksPersistConfig = {
  key: "tasks",
  storage: storage,
  blacklist: ["userTasks"],
};

const rootPersistConfig = {
  key: "root",
  storage: storage,
  blacklist: ["auth ", "task"],
};

//root reducer
const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  tasks: persistReducer(tasksPersistConfig, tasksReducer),
});

export const persistedReducer = persistReducer(rootPersistConfig, rootReducer);
