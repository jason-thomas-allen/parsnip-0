import React from 'react';
import { TASK_STATUSES } from '../common';

const Task = (props) => {
  const { task } = props;
  const onStatusChange = (e) => {
    props.onStatusChange(task, e.target.value);
  };

  return (
    <div className="task">
      <div className="task-header">
        <div>{task.title}</div>
        <select value={task.status} onChange={onStatusChange}>
          {TASK_STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>
      <hr />
      <div className="task-body">{task.description}</div>
      <div className="task-timer">{task.timer}s</div>
    </div>
  );
};

export default Task;
