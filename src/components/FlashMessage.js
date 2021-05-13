import React from 'react';

const FlashMessage = (props) => {
  return <div className="flash-message">{props.message}</div>;
};

export default FlashMessage;

Error.defaultProps = {
  message: 'An error occurred',
};
