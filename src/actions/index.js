import * as api from '../api';

export const fetchTasks = () => {
  return (dispatch) => {
    dispatch(fetchTasksStarted());
    api
      .fetchTasks()
      .then((resp) => {
        setTimeout(() => {
          dispatch(fetchTasksSucceeded(resp.data));
        }, 2000);
      })
      .catch((err) => {
        dispatch(fetchTasksFailed(err.message));
      });
  };
};

export const fetchTasksStarted = () => {
  return {
    type: 'FETCH_TASKS_STARTED',
  };
};

export const fetchTasksSucceeded = (tasks) => {
  return {
    type: 'FETCH_TASKS_SUCCEEDED',
    payload: { tasks },
  };
};

export const fetchTasksFailed = (error) => {
  return {
    type: 'FETCH_TASKS_FAILED',
    payload: { error },
  };
};

export const createTaskSucceeded = (task) => {
  return {
    type: 'CREATE_TASK_SUCCEEDED',
    payload: { task },
  };
};

export const createTask = ({ title, description, status = 'To Do' }) => {
  return (dispatch) => {
    api.createTask({ title, description, status }).then((resp) => {
      dispatch(createTaskSucceeded(resp.data));
    });
  };
};

export const editTaskSucceeded = (task) => {
  return {
    type: 'EDIT_TASK_SUCCEEDED',
    payload: { task },
  };
};

export const editTask = (id, params = {}) => {
  return (dispatch, getState) => {
    const task = getTaskById(getState().tasks, id);
    const updatedTask = { ...task, ...params };
    api.editTask(id, updatedTask).then((resp) => {
      dispatch(editTaskSucceeded(resp.data));
    });
  };
};

const getTaskById = (tasks, id) => {
  return tasks.tasks.find((task) => task.id === id);
};
