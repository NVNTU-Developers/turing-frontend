import { SINGLE_API } from './type';
export const MODEL_NAME = 'DEPARTMENT';
export const MODEL_PLURAL = 'departments';
export const GET_ALL_DEPARTMENT_SUCCESS = 'GET_ALL_DEPARTMENT_SUCCESS';
export const GET_ALL_DEPARTMENT_AND_CATEGORY_SUCCESS = 'GET_ALL_DEPARTMENT_AND_CATEGORY_SUCCESS';

export const getList = (payload = {}, next, nextError) => {
    return {
        type: SINGLE_API,
        payload: {
            uri: `/${MODEL_PLURAL}`,
            params: payload,
            successType: GET_ALL_DEPARTMENT_SUCCESS,
            afterSuccess: next,
            afterError: nextError,
        },
    };
};

export const getDepartmentAndCategory = (payload = {}, next, nextError) => {
    return {
        type: SINGLE_API,
        payload: {
            uri: `/department/andCategories`,
            params: payload,
            successType: GET_ALL_DEPARTMENT_AND_CATEGORY_SUCCESS,
            afterSuccess: next,
            afterError: nextError,
        },
    };
};