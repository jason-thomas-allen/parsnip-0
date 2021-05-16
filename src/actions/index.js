import * as api from '../api';
import { CALL_API } from '../middleware/api';

export const FETCH_TASKS_STARTED = 'FETCH_TASKS_STARTED';
export const FETCH_TASKS_SUCCEEDED = 'FETCH_TASKS_SUCCEEDED';
export const FETCH_TASKS_FAILED = 'FETCH_TASKS_FAILED';

export const CREATE_TASK_STARTED = 'CREATE_TASK_STARTED';
export const CREATE_TASK_SUCCEEDED = 'CREATE_TASK_SUCCEEDED';
export const CREATE_TASK_FAILED = 'CREATE_TASK_FAILED';

export const fetchTasks = () => {
  return {
    [CALL_API]: {
      types: [FETCH_TASKS_STARTED, FETCH_TASKS_SUCCEEDED, FETCH_TASKS_FAILED],
      endpoint: '/tasks',
      method: 'GET',
      body: {},
    },
  };
};

export const createTask = ({ title, description, status = 'To Do' }) => {
  return {
    [CALL_API]: {
      types: [CREATE_TASK_STARTED, CREATE_TASK_SUCCEEDED, CREATE_TASK_FAILED],
      endpoint: './tasls',
      method: 'POST',
      body: { title, description, status },
    },
  };
};

// export const fetchTasks = () => {
//   return (dispatch) => {
//     dispatch(fetchTasksStarted());
//     api
//       .fetchTasks()
//       .then((resp) => {
//         setTimeout(() => {
//           dispatch(fetchTasksSucceeded(resp.data));
//         }, 2000);
//       })
//       .catch((err) => {
//         dispatch(fetchTasksFailed(err.message));
//       });
//   };
// };

// export const fetchTasksStarted = () => {
//   return {
//     type: 'FETCH_TASKS_STARTED',
//   };
// };

// export const fetchTasksSucceeded = (tasks) => {
//   return {
//     type: 'FETCH_TASKS_SUCCEEDED',
//     payload: { tasks },
//   };
// };

// export const fetchTasksFailed = (error) => {
//   return {
//     type: 'FETCH_TASKS_FAILED',
//     payload: { error },
//   };
// };

// export const createTaskSucceeded = (task) => {
//   return {
//     type: 'CREATE_TASK_SUCCEEDED',
//     payload: { task },
//     meta: {
//       analytics: {
//         event: 'create_task',
//         data: {
//           id: task.id,
//         },
//       },
//     },
//   };
// };

// export const createTask = ({ title, description, status = 'To Do' }) => {
//   return (dispatch) => {
//     api.createTask({ title, description, status }).then((resp) => {
//       dispatch(createTaskSucceeded(resp.data));
//     });
//   };
// };

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
