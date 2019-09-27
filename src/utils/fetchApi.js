import merge from 'lodash/merge';
import { put, call } from 'redux-saga/effects';
import axios from 'axios';
import AuthStorage from './AuthStorage';
import { REQUEST_ERROR } from '../store/actions/type';
import systemConfig from '../config/system';

const { serverBaseUrl } = systemConfig;

const fetchWithAxios = (options) => axios(options).then(res => res).catch(err => { throw err; });

/* The example data is structured as follows:

Params: {
	uri: ,
	params: ,
	opt: ,
	loading: ,
	uploadImg: ,
}
*/

export default function* ({ uri, params = {}, opt = {}, loading = true, uploadImg = false }) {
    const defaultOptions = {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
    };

    if (!uri) {
        return;
    }

    const options = merge(defaultOptions, opt);

    if (uploadImg && params.files) {
        options.headers = {};
    }
    // set token
    if (AuthStorage.loggedIn) {
        options.headers['user-key'] = 'Bearer ' + AuthStorage.token;
    }

    let url = uri;

    if (params && Object.keys(params).length > 0) {
        if (options && options.method === 'GET') {
            url += '?' + Object.keys(params).map(k => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`).join('&');
        } else if (uploadImg && params.files) {
            const formData = new FormData();
            params.files.forEach((img) => {
                formData.append('files', img, img.name);
            });

            options.data = formData;
        } else {
            options.data = params;
        }
    }

    if (loading) {
        yield put({ type: 'START_LOADING' });
    }

    let response;
    try {
        response = yield call(fetchWithAxios, {
            ...options,
            url: encodeURI(serverBaseUrl + url),
        });

        if (loading) {
            yield put({ type: 'STOP_LOADING' });
        }

        return response;
    } catch (error) {
        response = { error };
        if (error.statusCode === 401 || error.message === 'Request failed with status code 401') {
            if (AuthStorage.loggedIn) {
                yield put({ type: 'LOGOUT_REQUEST' });
            }
            yield put({ type: REQUEST_ERROR, payload: 'TOKEN_INVALID' });
        }

        if (error.message !== 'Unexpected end of JSON input') {
            if (error.code !== 'ACCOUNT_DISABLED') {
                // Access token has expired
                if (error.code === 'INVALID_TOKEN') {
                    if (AuthStorage.loggedIn) {
                        yield put({ type: 'LOGOUT_REQUEST' });
                    }

                    yield put({ type: REQUEST_ERROR, payload: 'Access token has expired' });
                }
                if (error.code === 'AUTHORIZATION_REQUIRED') {
                    yield put({ type: REQUEST_ERROR, payload: "You don't have permission for this action!" });
                }
            } else if (error.code === 'ACCOUNT_DISABLED') {
                // Access token has expired
                if (AuthStorage.loggedIn) {
                    yield put({ type: 'LOGOUT_REQUEST' });
                }

                yield put({ type: REQUEST_ERROR, payload: 'Account has been disabled' });
            } else if (error.message.includes('user')) {
                if (AuthStorage.loggedIn) {
                    yield put({ type: 'LOGOUT_REQUEST' });
                }
            } else {
                yield put({ type: REQUEST_ERROR, payload: error.message || error });
            }

            return response;
        }
        if (loading) {
            yield put({ type: 'STOP_LOADING' });
        }

        return {};
    }
}
