import React, { useState } from 'react';
import TaskList from './TaskList';

const TasksPage = (props) => {
  const renderTaskLists = () => {
    const { onStatusChange, tasks } = props;

    return Object.keys(tasks).map((status) => {
      const tasksByStatus = tasks[status];
      return (
        <TaskList
          key={status}
          status={status}
          tasks={tasksByStatus}
          onStatusChange={onStatusChange}
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

  const onSearch = (e) => {
    props.onSearch(e.target.value);
  };

  if (props.isLoading) {
    return <div className="tasks-loading">Loading...</div>;
  }

  return (
    <div className="tasks">
      <div className="tasks-header">
        <input onChange={onSearch} type="text" placeholder="Search..." />
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

      <div className="task-lists">{renderTaskLists()}</div>
    </div>
  );
};

export default TasksPage;
