const tasksReducer = (
  state = {
    userTasks: [],
  },
  action
) => {
  switch (action.type) {
    case "SET_USER_TASKS":
      return {
        ...state,
        userTasks: action.payload.userTasks,
      };

    default:
      return state;
  }
};

export default tasksReducer;
