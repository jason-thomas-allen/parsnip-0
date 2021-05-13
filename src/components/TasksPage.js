import React, { useState } from 'react';
import TaskList from './TaskList';
import { TASK_STATUSES } from '../common';

const TasksPage = (props) => {
  const renderTaskLists = () => {
    return TASK_STATUSES.map((status) => {
      const statusTasks = props.tasks.filter((task) => task.status === status);
      return (
        <TaskList
          status={status}
          tasks={statusTasks}
          onStatusChange={props.onStatusChange}
        />
      );
    });
  };

  const initialState = {
    showNewCardForm: false,
    title: '',
    description: '',
  };

  const [state, setState] = useState(initialState);

  const onTitleChange = (e) => {
    setState({ ...state, title: e.target.value });
  };

  const onDescriptionChange = (e) => {
    setState({ ...state, description: e.target.value });
  };

  const toggleForm = () => {
    setState({ ...state, showNewCardForm: !state.showNewCardForm });
  };

  const resetForm = () => {
    setState(initialState);
  };

  const onCreateTask = (e) => {
    e.preventDefault();
    props.onCreateTask(state.title, state.description);
    resetForm();
  };

  return (
    <div className="task-list">
      <div className="task-list-header">
        <button className="button button-default" onClick={toggleForm}>
          + New Task
        </button>
      </div>
      {state.showNewCardForm && (
        <form className="task-list-form" onSubmit={onCreateTask}>
          <input
            className="full-width-input"
            onChange={onTitleChange}
            value={state.title}
            type="text"
            placeholder="title"
          />
          <input
            className="full-width-input"
            onChange={onDescriptionChange}
            value={state.description}
            type="text"
            placeholder="description"
          />
          <button className="button" type="submit">
            Save
          </button>
        </form>
      )}
      {props.isLoading && <div className="tasks-loading">Loading...</div>}
      <div className="task-lists">{renderTaskLists()}</div>
    </div>
  );
};

export default TasksPage;
