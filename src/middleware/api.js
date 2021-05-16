import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001';

export const CALL_API = 'CALL_API';

const makeCall = ({ endpoint, method = 'GET', body }) => {
  const url = `${API_BASE_URL}${endpoint}`;

  const params = {
    method,
    url,
    data: body,
    headers: {
      'Content-Type': 'application/json',
    },
  };
  return axios(params)
    .then((resp) => resp)
    .catch((err) => err);
};

const apiMiddleware = (store) => (next) => (action) => {
  const callApi = action[CALL_API];
  if (typeof callApi === 'undefined') {
    return next(action);
  }
  const [requestStartedType, successType, failureType] = callApi.types;
  next({ type: requestStartedType });

  const { endpoint, method, body } = callApi;

  return makeCall({
    method,
    body,
    endpoint,
  }).then(
    (resp) =>
      next({
        type: successType,
        payload: resp.data,
      }),
    (error) =>
      next({
        type: failureType,
        payload: error.message,
      })
  );
};

export default apiMiddleware;
