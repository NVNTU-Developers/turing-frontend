import { all } from 'redux-saga/effects';
import middleware from './middleware';
import auth from './auth';

export default function* rootSaga() {
	yield all([
		middleware(),
		auth(),
	]);
}
