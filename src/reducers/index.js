import { createSelector } from 'reselect';
import { TASK_STATUSES } from '../common';

const initialState = {
  tasks: [],
  isLoading: false,
  error: null,
  searchTerm: '',
};

const getTasks = (state) => state.tasks.tasks;
const getSearchTerm = (state) => state.tasks.searchTerm;

export const getFilteredTasks = createSelector(
  [getTasks, getSearchTerm],
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

export default function tasks(state = initialState, action) {
  switch (action.type) {
    case 'FILTER_TASKS': {
      return {
        ...state,
        searchTerm: action.payload.searchTerm,
      };
    }
    case 'PROGRESS_TIMER_INCREMENT': {
      const { payload } = action;
      const nextTasks = state.tasks.map((task) => {
        if (task.id === payload.taskId)
          return { ...task, timer: task.timer + 1 };
        return task;
      });
      return {
        ...state,
        tasks: nextTasks,
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
    case 'CREATE_TASK_SUCCEEDED': {
      return {
        ...state,
        tasks: state.tasks.concat(action.payload.task),
      };
    }
    case 'EDIT_TASK_SUCCEEDED': {
      const { payload } = action;
      const nextTasks = state.tasks.map((task) => {
        if (task.id === payload.task.id) return { ...task, ...payload.task };
        return task;
      });
      return {
        ...state,
        tasks: nextTasks,
      };
    }
    default: {
      return state;
    }
  }
}
