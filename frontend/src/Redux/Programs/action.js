/**
 * @module Saga-Tasks
 */

import store from "../Store/store";

const actionTypes = {
  ADD_TASK: "ADD_TASK",
  EDIT_TASK: "EDIT_TASK",
  DELETE_TASK: "DELETE_TASK",
  GET_USER_TASKS: "GET_USER_TASKS",
  CLEAR_USER_TASKS: "CLEAR_USER_TASKS",
  PUT_USER_TASKS: "PUT_USER_TASKS",
};

/**
 * Dispatches an action to add a task.
 *
 * @function
 * @param {Object} task - The task to be added.
 * @param {string} token - User authentication token.
 */
export const addTask = (task, token) => {
  store.dispatch({
    type: actionTypes.ADD_TASK,
    payload: {
      task: { ...task },
      token: token,
    },
  });
};

/**
 * Dispatches an action to edit a task.
 *
 * @function
 * @param {Object} task - The task to be edited.
 * @param {string} token - User authentication token.
 */
export const editTask = (task, token) => {
  store.dispatch({
    type: actionTypes.EDIT_TASK,
    payload: {
      editTask: { ...task },
      token: token,
    },
  });
};

/**
 * Dispatches an action to delete a task.
 *
 * @function
 * @param {Object} task - The task to be deleted.
 * @param {string} token - User authentication token.
 */
export const deleteTask = (task, token) => {
  store.dispatch({
    type: actionTypes.DELETE_TASK,
    payload: {
      taskId: task.taskId,
      email: task.email,
      token: token,
    },
  });
};

/**
 * Dispatches an action to get tasks for a user.
 *
 * @function
 * @param {string} email - The user's ID.
 * @param {string} token - User authentication token.
 */
export const getUserTasks = (email, token, mode) => {
  store.dispatch({
    type: actionTypes.GET_USER_TASKS,
    payload: {
      email: email,
      token: token,
      mode: mode,
    },
  });
};
export const putUserTasks = (userTasks) => {
  store.dispatch({
    type: actionTypes.PUT_USER_TASKS,
    payload: {
      userTasks: userTasks,
    },
  });
};

/**
 * Dispatches an action to clear user tasks.
 *
 * @function
 */
export const clearUserTasks = () => {
  store.dispatch({
    type: actionTypes.CLEAR_USER_TASKS,
  });
};
