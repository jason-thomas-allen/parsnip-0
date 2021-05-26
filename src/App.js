import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import './App.css';
import TasksPage from './components/TasksPage';
import { createTask, editTask, fetchTasks, filterTasks } from './actions';
import FlashMessage from './components/FlashMessage';
import { getGroupedAndFilteredTasks } from './reducers';

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

  const onSearch = (searchTerm) => {
    props.dispatch(filterTasks(searchTerm));
  };

  return (
    <div className="container">
      {props.error && <FlashMessage message={props.error} />}

      <div className="main-content">
        <TasksPage
          tasks={props.tasks}
          onCreateTask={onCreateTask}
          onStatusChange={onStatusChange}
          onSearch={onSearch}
          isLoading={props.isLoading}
        />
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  const { isLoading, error } = state.tasks;
  return { tasks: getGroupedAndFilteredTasks(state), isLoading, error };
};

export default connect(mapStateToProps)(App);
