import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import './App.css';
import TasksPage from './components/TasksPage';
import {
  createTask,
  editTask,
  fetchProjects,
  filterTasks,
  setCurrentProjectId,
} from './actions';
import FlashMessage from './components/FlashMessage';
import { getGroupedAndFilteredTasks, getProjects } from './reducers';
import Header from './components/Header';

const App = (props) => {
  console.log(props);

  const { dispatch } = props;

  useEffect(() => {
    console.log('App mounted');
    dispatch(fetchProjects());
  }, [dispatch]);

  const onCurrentProjectChange = (id) => {
    props.dispatch(setCurrentProjectId(id));
  };

  const onCreateTask = (title, description) => {
    props.dispatch(
      createTask({ projectId: props.currentProjectId, title, description })
    );
  };

  const onStatusChange = (task, status) => {
    props.dispatch(editTask(task, { status }));
  };

  const onSearch = (searchTerm) => {
    props.dispatch(filterTasks(searchTerm));
  };

  return (
    <div className="container">
      {props.error && <FlashMessage message={props.error} />}

      <div className="main-content">
        <Header
          projects={props.projects}
          onCurrentProjectChange={onCurrentProjectChange}
        />
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
  const { isLoading, error } = state.projects;
  return {
    tasks: getGroupedAndFilteredTasks(state),
    projects: getProjects(state),
    isLoading,
    error,
    currentProjectId: state.page.currentProjectId,
  };
};

export default connect(mapStateToProps)(App);
