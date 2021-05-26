import { channel } from 'redux-saga';
import { call, delay, put, take, takeLatest } from 'redux-saga/effects';
import * as api from './api';
import {
  fetchTasksSucceeded,
  fetchTasksFailed,
  progressTimerIncrement,
} from './actions';

export default function* rootSaga() {
  yield takeLatest('FETCH_TASKS_STARTED', fetchTasks);
  yield takeLatestById(
    ['PROGRESS_TIMER_STARTED', 'PROGRESS_TIMER_STOPPED'],
    handleProgressTimer
  );
}

function* takeLatestById(actionType, saga) {
  const channelsMap = {};

  while (true) {
    const action = yield take(actionType);
    const { taskId } = action.payload;

    if (!channelsMap[taskId]) {
      channelsMap[taskId] = channel();
      yield takeLatest(channelsMap[taskId], saga);
    }

    yield put(channelsMap[taskId], action);
  }
}

function* fetchTasks() {
  try {
    const { data } = yield call(api.fetchTasks);
    yield delay(1000);
    yield put(fetchTasksSucceeded(data));
  } catch (e) {
    yield put(fetchTasksFailed(e.message));
  }
}

function* handleProgressTimer({ type, payload }) {
  if (type === 'PROGRESS_TIMER_STARTED') {
    while (true) {
      yield delay(1000);
      yield put(progressTimerIncrement(payload.taskId));
    }
  }
}
