const analytics = (store) => (next) => (action) => {
  if (!action || !action.meta || !action.meta.analytics) {
    return next(action);
  }

  const { event, data } = action.meta.analytics;

  fakeAnalyticsApi(event, data)
    .then((resp) => {
      console.log('Recorded: ', event, data);
    })
    .catch((err) => {
      console.error(
        'An error occurred whilst sending analytics: ',
        err.toString()
      );
    });
  return next(action);
};

const fakeAnalyticsApi = (eventName, data) => {
  return new Promise((resolve, reject) => {
    resolve('Success');
  });
};

export default analytics;
