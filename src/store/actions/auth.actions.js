import { SINGLE_API } from './type';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const REGISTER_SUCCESS = 'REGISTER_SUCCESS';
export const GET_CUSTOMER_PROFILE_SUCCESS = 'LOGIN_SUCCESS';

export function loginRequest(payload, next, nextErr) {
    return {
        type: 'LOGIN_REQUEST',
        payload,
        next,
        nextErr,
    };
}

export function logoutRequest(next) {
    return {
        type: 'LOGOUT_REQUEST',
        next,
    };
}

export function loginFacebook(payload, next) {
    return {
        type: 'LOGIN_FACEBOOK',
        payload,
        next,
    };
}

export const getCustomerProfile = (userData, next) => {
    return {
        type: SINGLE_API,
        payload: {
            uri: '/customers',
            successType: GET_CUSTOMER_PROFILE_SUCCESS,
            afterSuccess: next,
        },
    };
};

export const register = (payload, next, nextError) => {
    return {
        type: SINGLE_API,
        payload: {
            uri: '/customers',
            params: payload,
            opt: { method: 'POST' },
            successType: REGISTER_SUCCESS,
            afterSuccess: next,
            afterError: nextError,
        },
    };
}
// export const updateProfile = (payload, next, nextError) => {
//     return {
//         type: SINGLE_API,
//         payload: {
//             uri: '/users/' + Auth.userId,
//             params: payload,
//             opt: { method: 'PATCH' },
//             successType: 'UPDATE_PROFILE_SUCCESS',
//             afterSuccess: next,
//             afterError: nextError,
//         },
//     };
// };
