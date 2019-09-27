import { take, call, put, cancel, fork } from 'redux-saga/effects';

import fetchApi from '../../utils/fetchApi';
import AuthStorage from '../../utils/AuthStorage';

import { REQUEST_ERROR } from '../actions/type';

function* authorize(payload, next, nextErr) {
    const response = yield call(fetchApi, {
        uri: '/customers/login',
        params: payload,
        opt: { method: 'POST' },
        loading: false,
    });
    if (response && !response.error) {
        const data = {
            token: response.data.accessToken,
            customer_name: response.data.customer.name,
            customer_id: response.data.customer.customer_id,
        };
        AuthStorage.value = data;

        yield put({
            type: 'LOGIN_SUCCESS',
            payload: response.data.customer,
        });
        if (typeof next === 'function') {
            next();
        }
    } else {
        yield put({
            type: 'LOGIN_FAILED',
            payload: response.error,
        });
        if (typeof nextErr === 'function') {
            nextErr(response.error);
        }
    }
}

function* loginFlow() {
    const INFINITE = true;
    while (INFINITE) {
        const { payload, next, nextErr } = yield take('LOGIN_REQUEST');
        const authorizeTask = yield fork(authorize, payload, next, nextErr);
        const action = yield take(['LOGOUT_REQUEST', 'LOGIN_FAILED', REQUEST_ERROR]);

        if (action.type === 'LOGOUT_REQUEST') {
            yield cancel(authorizeTask);
        }
    }
}

function* loginGoogleFlow() {
    const INFINITE = true;

    while (INFINITE) {
        const { payload, next, nextErr } = yield take('LOGIN_GOOGLE');

        const response = yield call(fetchApi, {
            uri: 'users/login-google',
            params: payload,
            opt: { method: 'POST' },
        });

        if (response && !response.error) {
            const data = {
                token: response.id,
                userId: response.userId,
                role: response.user.role,
            };
            AuthStorage.value = data;

            yield put({
                type: 'LOGIN_SUCCESS',
                payload: response.user,
            });
            if (typeof next === 'function') {
                next();
            }
        } else {
            if (typeof nextErr === 'function') {
                nextErr();
            }
        }
    }
}

function* loginFacebookFlow() {
    const INFINITE = true;

    while (INFINITE) {
        const { payload, next, nextErr } = yield take('LOGIN_FACEBOOK');

        const response = yield call(fetchApi, {
            uri: '/customers/loginFB',
            params: { fbToken: payload },
            opt: { method: 'POST' },
        });
        if (response && !response.error) {
            const data = {
                token: response.data.accessToken,
                customer_name: response.data.customer.name,
                customer_id: response.data.customer.customer_id,
            };
            AuthStorage.value = data;

            yield put({
                type: 'LOGIN_SUCCESS',
                payload: response.data.customer,
            });
            if (typeof next === 'function') {
                next();
            }
        } else {
            if (typeof nextErr === 'function') {
                nextErr();
            }
        }
    }
}

function* logoutFlow() {
    const INFINITE = true;

    while (INFINITE) {
        const { next } = yield take('LOGOUT_REQUEST');

        const response = yield call(fetchApi, {
            uri: '/users/logout',
            opt: { method: 'DELETE' },
        });

        AuthStorage.destroy();

        yield put({ type: 'LOGOUT_SUCCESS' });
        if (typeof next === 'function') {
            next();
        }
    }
}

function* signUpFlow() {
    const INFINITE = true;

    while (INFINITE) {
        const { payload, next, nextErr } = yield take('SIGN_UP_REQUEST');

        const response = yield call(fetchApi, {
            uri: 'users',
            params: payload,
            opt: { method: 'POST' },
            loading: false,
        });

        if (response && !response.error) {
            console.log('error signup 1');
            const authorizeTask = yield fork(authorize, payload, next, nextErr);
            const action = yield take(['LOGOUT_REQUEST', 'LOGIN_FAILED', REQUEST_ERROR]);

            if (action.type === 'LOGOUT_REQUEST') {
                yield cancel(authorizeTask);
            }
        } else {
            console.log('error signup 2');
            if (typeof nextErr === 'function') {
                nextErr();
            }
        }
    }
}

export default function* authFlow() {
    yield fork(loginFlow);
    yield fork(loginGoogleFlow);
    yield fork(loginFacebookFlow);
    yield fork(logoutFlow);
    yield fork(signUpFlow);
}
