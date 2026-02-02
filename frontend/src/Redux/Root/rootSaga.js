import { all } from "redux-saga/effects";
import { authWatcher } from "../Authentication/saga";
import { taskWatcher } from "../Tasks/saga";

export default function* rootSaga() {
  yield all([authWatcher(), taskWatcher()]);
}
