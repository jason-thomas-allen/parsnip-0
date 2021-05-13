import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import './App.css';
import TasksPage from './components/TasksPage';
import { createTask, editTask, fetchTasks } from './actions';
import FlashMessage from './components/FlashMessage';

const App = (props) => {
  console.log(props);

  const { dispatch } = props;

  useEffect(() => {
    console.log('App mounted');
    dispatch(fetchTasks());
  }, [dispatch]);

  const onCreateTask = (title, description) => {
    props.dispatch(createTask({ title, description }));
  };

  const onStatusChange = (id, status) => {
    props.dispatch(editTask(id, { status }));
  };

  return (
    <div className="container">
      {props.error && <FlashMessage message={props.error} />}

      <div className="main-content">
        <TasksPage
          tasks={props.tasks}
          onCreateTask={onCreateTask}
          onStatusChange={onStatusChange}
          isLoading={props.isLoading}
        />
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  const { tasks, isLoading, error } = state.tasks;
  return { tasks, isLoading, error };
};

export default connect(mapStateToProps)(App);
