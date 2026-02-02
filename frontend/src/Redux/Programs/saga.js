import { all, put, takeEvery } from "redux-saga/effects";
import {
  addTaskApi,
  deleteTaskApi,
  editTaskApi,
  getIndividualUserTasksApi,
} from "../../Services/Api/tasks";
import { toast } from "react-toastify";
import { getUserTasks } from "./action";
import {
  addTaskFDB,
  deleteTaskFDB,
  updateTaskFDB,
} from "../../Database/Firebase/useListenTasks";

function* addTaskWorker(action) {
  try {
    if (process.env.REACT_APP_DATABASE === "firebase") {
      yield addTaskFDB(action.payload.task);
      toast.success("Task Added");
    } else {
      yield addTaskApi(action.payload.task, action.payload.token);
      toast.success("Task Added");
      yield getUserTasks(action.payload.task.email, action.payload.token);
    }
  } catch (error) {
    toast.error(error.message);
  }
}

function* getUserTasksWorker(action) {
  try {
    var userTasks = [];
    if (process.env.REACT_APP_DATABASE !== "firebase") {
      userTasks = yield getIndividualUserTasksApi(
        action.payload.email,
        action.payload.token
      );
      if (userTasks.length) {
        yield put({
          type: "SET_USER_TASKS",
          payload: {
            userTasks: userTasks,
          },
        });
      }
    }
  } catch (error) {
    if (error.message === "No Tasks") {
      yield put({
        type: "SET_USER_TASKS",
        payload: {
          userTasks: [],
        },
      });
    }
    toast.error(error.message);
  }
}

function* editTaskWorker(action) {
  try {
    if (process.env.REACT_APP_DATABASE === "firebase") {
      yield updateTaskFDB(
        action.payload.editTask.taskId,
        action.payload.editTask.entry
      );
    } else {
      yield editTaskApi(
        action.payload.editTask.taskId,
        action.payload.editTask.entry,
        action.payload.token
      );
      yield getUserTasks(action.payload.editTask.email, action.payload.token);
    }
    toast.success("Task Edited");
  } catch (error) {
    toast.error(error.message);
  }
}

function* deleteTaskWorker(action) {
  try {
    if (process.env.REACT_APP_DATABASE === "firebase") {
      yield deleteTaskFDB(action.payload.taskId);
    } else {
      yield deleteTaskApi(action.payload.taskId, action.payload.token);
      yield getUserTasks(action.payload.email, action.payload.token);
    }
    toast.success("Task deleted");
  } catch (error) {
    toast.error(error.message);
  }
}

function* clearUserTasksWorker() {
  try {
    yield put({
      type: "SET_USER_TASKS",
      payload: {
        userTasks: [],
      },
    });
  } catch (error) {
    toast.error(error.message);
  }
}

function* putUserTasksWorker(action) {
  try {
    yield put({
      type: "SET_USER_TASKS",
      payload: {
        userTasks: action.payload.userTasks,
      },
    });
  } catch (error) {
    toast.error(error.message);
  }
}

export function* taskWatcher() {
  yield all([
    takeEvery("GET_USER_TASKS", getUserTasksWorker),
    takeEvery("ADD_TASK", addTaskWorker),
    takeEvery("EDIT_TASK", editTaskWorker),
    takeEvery("DELETE_TASK", deleteTaskWorker),
    takeEvery("CLEAR_USER_TASKS", clearUserTasksWorker),
    takeEvery("PUT_USER_TASKS", putUserTasksWorker),
  ]);
}
