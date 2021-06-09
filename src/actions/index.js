import * as api from '../api';
import { normalize, schema } from 'normalizr';

export const FETCH_PROJECTS_STARTED = 'FETCH_PROJECTS_STARTED';
export const FETCH_PROJECTS_SUCCEEDED = 'FETCH_PROJECTS_SUCCEEDED';
export const FETCH_PROJECTS_FAILED = 'FETCH_PROJECTS_FAILED';
export const FILTER_TASKS = 'FILTER_TASKS';
export const SET_CURRENT_PROJECT_ID = 'SET_CURRENT_PROJECT_ID';
export const CREATE_TASK_SUCCEEDED = 'CREATE_TASK_SUCCEEDED';
export const EDIT_TASK_SUCCEEDED = 'EDIT_TASK_SUCCEEDED';
export const RECEIVE_ENTITIES = 'RECEIVE_ENTITIES';
export const PROGRESS_TIMER_INCREMENT = 'PROGRESS_TIMER_INCREMENT';

const taskSchema = new schema.Entity('tasks');
const projectSchema = new schema.Entity('projects', {
  tasks: [taskSchema],
});

export const fetchProjects = () => {
  return (dispatch, getState) => {
    dispatch(fetchProjectsStarted());
    api
      .fetchProjects()
      .then((resp) => {
        setTimeout(() => {
          const projects = resp.data;
          const normalizedData = normalize(projects, [projectSchema]);
          dispatch(receiveEntities(normalizedData));

          if (!getState().page.currentProjectId) {
            const defaultProjectId = projects[0].id;
            dispatch(setCurrentProjectId(defaultProjectId));
          }
        }, 1000);
      })
      .catch((err) => {
        dispatch(fetchProjectsFailed(err.message));
      });
  };
};

export const fetchProjectsStarted = () => {
  return {
    type: FETCH_PROJECTS_STARTED,
  };
};

export const fetchProjectsSucceeded = (projects) => {
  return {
    type: FETCH_PROJECTS_SUCCEEDED,
    payload: { projects },
  };
};

export const fetchProjectsFailed = (error) => {
  return {
    type: FETCH_PROJECTS_FAILED,
    payload: { error },
  };
};

export const receiveEntities = (entities) => {
  return (dispatch) => {
    const { tasks } = entities.entities;
    debugger;
    Object.keys(tasks).forEach((taskId) => {
      debugger;
      const task = tasks[taskId];
      if (task.status === 'In Progress') {
        dispatch(progressTimerStart(task.id));
      }
    });
    dispatch(receiveEventsSucceeded(entities));
  };
};

export const receiveEventsSucceeded = (entities) => {
  return {
    type: RECEIVE_ENTITIES,
    payload: entities,
  };
};

export const setCurrentProjectId = (id) => {
  return {
    type: SET_CURRENT_PROJECT_ID,
    payload: { id },
  };
};

export const filterTasks = (searchTerm) => {
  return {
    type: FILTER_TASKS,
    payload: { searchTerm },
  };
};

export const fetchTasks = () => {
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
    type: CREATE_TASK_SUCCEEDED,
    payload: { task },
  };
};

export const createTask = ({
  projectId,
  title,
  description,
  status = 'To Do',
}) => {
  return (dispatch) => {
    api.createTask({ projectId, title, description, status }).then((resp) => {
      dispatch(createTaskSucceeded(resp.data));
    });
  };
};

export const editTaskSucceeded = (task) => {
  return {
    type: EDIT_TASK_SUCCEEDED,
    payload: { task },
  };
};

const progressTimerStart = (taskId) => {
  debugger;
  return {
    type: 'PROGRESS_TIMER_STARTED',
    payload: { taskId },
  };
};

const progressTimerStop = (taskId) => {
  return {
    type: 'PROGRESS_TIMER_STOPPED',
    payload: { taskId },
  };
};

export const progressTimerIncrement = (taskId) => {
  return {
    type: PROGRESS_TIMER_INCREMENT,
    payload: { taskId },
  };
};

export const editTask = (task, params = {}) => {
  return (dispatch) => {
    const updatedTask = { ...task, ...params };
    api.editTask(task.id, updatedTask).then((resp) => {
      dispatch(editTaskSucceeded(resp.data));
      debugger;
      if (resp.data.status === 'In Progress') {
        dispatch(progressTimerStart(resp.data.id));
      } else {
        dispatch(progressTimerStop(resp.data.id));
      }
    });
  };
};
