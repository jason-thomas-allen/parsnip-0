import { createSelector } from 'reselect';
import { TASK_STATUSES } from '../common';
import {
  FETCH_PROJECTS_STARTED,
  FETCH_PROJECTS_SUCCEEDED,
  FETCH_PROJECTS_FAILED,
  FILTER_TASKS,
  SET_CURRENT_PROJECT_ID,
  CREATE_TASK_SUCCEEDED,
  EDIT_TASK_SUCCEEDED,
  RECEIVE_ENTITIES,
  PROGRESS_TIMER_INCREMENT,
} from '../actions';

export const getProjects = (state) => {
  return Object.keys(state.projects.items).map((id) => {
    return state.projects.items[id];
  });
};

const getTasksByProjectId = (state) => {
  const { currentProjectId } = state.page;

  if (!currentProjectId || !state.projects.items[currentProjectId]) {
    return [];
  }

  const taskIds = state.projects.items[currentProjectId].tasks;
  return taskIds.map((id) => state.tasks.items[id]);
};

const getSearchTerm = (state) => state.page.tasksSearchTerm;

export const getFilteredTasks = createSelector(
  [getTasksByProjectId, getSearchTerm],
  (tasks, searchTerm) => {
    return tasks.filter((task) => {
      return task.title.match(new RegExp(searchTerm, 'i'));
    });
  }
);

export const getGroupedAndFilteredTasks = createSelector(
  [getFilteredTasks],
  (tasks) => {
    const grouped = {};
    TASK_STATUSES.forEach((status) => {
      grouped[status] = tasks.filter((task) => task.status === status);
    });
    return grouped;
  }
);

const initialTasksState = {
  items: {},
  isLoading: false,
  error: null,
};

export function tasks(state = initialTasksState, action) {
  switch (action.type) {
    case RECEIVE_ENTITIES: {
      debugger;
      const { entities } = action.payload;
      if (entities && entities.tasks) {
        return {
          ...state,
          isLoading: false,
          items: entities.tasks,
        };
      }
      return state;
    }
    case CREATE_TASK_SUCCEEDED:
    case EDIT_TASK_SUCCEEDED: {
      const { task } = action.payload;
      const nextTasks = {
        ...state.items,
        [task.id]: task,
      };
      return {
        ...state,
        items: nextTasks,
      };
    }
    case PROGRESS_TIMER_INCREMENT: {
      debugger;
      const { taskId } = action.payload;
      const task = state.items[taskId];
      let timer = 1;
      if (typeof task.timer != 'undefined') {
        timer = task.timer + 1;
      }
      const nextTasks = {
        ...state.items,
        [taskId]: {
          ...task,
          timer: timer,
        },
      };
      return {
        ...state,
        items: nextTasks,
      };
    }
    default: {
      return state;
    }
  }
}

const initialProjectsState = {
  items: {},
  isLoading: false,
  error: null,
};

export function projects(state = initialProjectsState, action) {
  switch (action.type) {
    case RECEIVE_ENTITIES: {
      debugger;
      const { entities } = action.payload;
      if (entities && entities.projects) {
        return {
          ...state,
          isLoading: false,
          items: entities.projects,
        };
      }
      return state;
    }
    case FETCH_PROJECTS_STARTED: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case FETCH_PROJECTS_SUCCEEDED: {
      return {
        ...state,
        isLoading: false,
        items: action.payload.projects,
      };
    }
    case FETCH_PROJECTS_FAILED: {
      return {
        ...state,
        isLoading: false,
        error: action.payload.error,
      };
    }

    case 'FETCH_TASKS_STARTED': {
      return {
        ...state,
        isLoading: true,
      };
    }
    case 'FETCH_TASKS_SUCCEEDED': {
      return {
        ...state,
        isLoading: false,
        tasks: action.payload.tasks,
      };
    }
    case 'FETCH_TASKS_FAILED': {
      return {
        ...state,
        isLoading: false,
        error: action.payload.error,
      };
    }
    case CREATE_TASK_SUCCEEDED: {
      const { task } = action.payload;
      const project = state.items[task.projectId];

      return {
        ...state,
        items: {
          ...state.items,
          [task.projectId]: {
            ...project,
            tasks: project.tasks.concat(task.id),
          },
        },
      };
    }
    default: {
      return state;
    }
  }
}

const initialPageState = {
  currentProjectId: null,
  tasksSearchTerm: '',
};

export function page(state = initialPageState, action) {
  switch (action.type) {
    case SET_CURRENT_PROJECT_ID: {
      return {
        ...state,
        currentProjectId: action.payload.id,
      };
    }
    case FILTER_TASKS: {
      return {
        ...state,
        tasksSearchTerm: action.payload.searchTerm,
      };
    }
    default: {
      return state;
    }
  }
}
