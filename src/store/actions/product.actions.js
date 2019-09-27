import { SINGLE_API } from './type';

export const MODEL_NAME = 'PRODUCTS';
export const MODEL_PLURAL = 'products';
export const GET_ALL_PRODUCTS_START = 'GET_ALL_PRODUCTS_START';
export const GET_ALL_PRODUCTS_SUCCESS = 'GET_ALL_PRODUCTS_SUCCESS';
export const GET_SINGLE_PRODUCT = 'GET_SINGLE_PRODUCT';
export const GET_SINGLE_PRODUCT_SUCCESS = 'GET_SINGLE_PRODUCT_SUCCESS';
export const GET_SINGLE_PRODUCT_ERROR = 'GET_SINGLE_PRODUCT_ERROR';
export const GET_PRODUCT_LOCATIONS_SUCCESS = 'GET_PRODUCT_LOCATIONS_SUCCESS';
export const GET_PRODUCT_LOCATIONS_START = 'GET_PRODUCT_LOCATIONS_START';
export const GET_COLOR_SIZE_SUCCESS = 'GET_COLOR_SIZE_SUCCESS';
export const CHECK_CUSTOMER_BY_PRODUCT = 'CHECK_CUSTOMER_BY_PRODUCT';
export const GET_ALL_PRODUCTS_ERROR = 'GET_ALL_PRODUCTS_ERROR';
export const GET_PRODUCT_LOCATIONS_ERROR = 'GET_PRODUCT_LOCATIONS_ERROR';
export const GET_PRODUCT_DETAILS_ERROR = 'GET_PRODUCT_DETAILS_ERROR';

export const storeFilter = (payload = {}) => {
	return {
		type: GET_ALL_PRODUCTS_START,
		payload,
	};
};

export const getList = (payload = {}, next, nextError) => {
	return {
		type: SINGLE_API,
		payload: {
			uri: `/${MODEL_PLURAL}`,
			params: payload,
			successType: GET_ALL_PRODUCTS_SUCCESS,
			afterSuccess: next,
			afterError: nextError,
		},
	};
};

export const getSizeColorRange = (payload = {}, next, nextError) => {
	return {
		type: SINGLE_API,
		payload: {
			uri: `/${MODEL_PLURAL}/getSizeColorRange`,
			successType: GET_COLOR_SIZE_SUCCESS,
			params: payload,
			afterSuccess: next,
			afterError: nextError,
		},
	};
};

export const getOne = (id, next, nextError) => {
	return {
		type: SINGLE_API,
		payload: {
			uri: `/${MODEL_PLURAL}/${id}`,
			successType: GET_SINGLE_PRODUCT_SUCCESS,
			afterSuccess: next,
			afterError: nextError,
		},
	};
};

export const getProductLocations = (id, next, nextError) => {
	return {
		type: SINGLE_API,
		payload: {
			uri: `/${MODEL_PLURAL}/${id}/locations`,
			beforeCallType: GET_PRODUCT_LOCATIONS_START,
			successType: GET_PRODUCT_LOCATIONS_SUCCESS,
			afterSuccess: next,
			afterError: nextError,
		},
	};
};

export const checkCustomerByProduct = (product_id, next, nextError) => {
	return {
		type: SINGLE_API,
		payload: {
			uri: `/customers/checkProducts/${product_id}`,
			afterSuccess: next,
			afterError: nextError,
			successType: CHECK_CUSTOMER_BY_PRODUCT,
		},
	};
};
