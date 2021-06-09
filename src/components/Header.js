import React from 'react';

const Header = (props) => {
  const projectOptions = props.projects.map((project) => (
    <option key={project.id} value={project.id}>
      {project.name}
    </option>
  ));

  const onCurrentProjectChange = (e) => {
    props.onCurrentProjectChange(Number(e.target.value));
  };

  return (
    <div className="project-item">
      Project:
      <select onChange={onCurrentProjectChange} className="project-menu">
        {projectOptions}
      </select>
    </div>
  );
};

export default Header;
