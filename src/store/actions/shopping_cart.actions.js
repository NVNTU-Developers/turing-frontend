import { SINGLE_API } from './type';
import CartStorage from '../../utils/CartStorage';

export const MODEL_NAME = 'SHOPPING_CART';
export const MODEL_PLURAL = 'shoppingcart';
export const GENERATE_UNIQUE_CART_ID_SUCCESS = 'GENERATE_UNIQUE_CART_ID_SUCCESS';
export const GET_CART_PRODUCTS_SUCCESS = 'GET_CART_PRODUCTS_SUCCESS';
export const ADD_PRODUCTS_SUCCESS = 'ADD_PRODUCTS_SUCCESS';
export const UPDATE_CART_ITEM_QUANTITY = 'UPDATE_CART_ITEM_QUANTITY';
export const REMOVE_ITEM_FROM_SHOPPING_CART = 'REMOVE_ITEM_FROM_SHOPPING_CART';
export const EMPTY_CART_SUCCESS = 'EMPTY_CART_SUCCESS';

export const generateUniqueId = (next, nextError) => {
	return {
		type: SINGLE_API,
		payload: {
			uri: `/${MODEL_PLURAL}/generateUniqueId`,
			successType: GENERATE_UNIQUE_CART_ID_SUCCESS,
			afterSuccess: next,
			afterError: nextError,
		},
	};
};

export const getCartProducts = (cart_id, next, nextError) => {
	return {
		type: SINGLE_API,
		payload: {
			uri: `/${MODEL_PLURAL}/${cart_id}`,
			successType: GET_CART_PRODUCTS_SUCCESS,
			afterSuccess: next,
			afterError: nextError,
		},
	};
};

export const addProductToShoppingCart = (payload, next, nextError) => {
	return {
		type: SINGLE_API,
		payload: {
			uri: `/${MODEL_PLURAL}/add`,
			params: payload,
			opt: { method: 'POST' },
			successType: ADD_PRODUCTS_SUCCESS,
			afterSuccess: next,
			afterError: nextError,
		},
	};
};

export const updateCartItemQuantity = (payload, next, nextError) => {
	const { item_id, ...item } = payload;

	return {
		type: SINGLE_API,
		payload: {
			uri: `/${MODEL_PLURAL}/update/${item_id}`,
			params: item,
			opt: { method: 'PUT' },
			successType: UPDATE_CART_ITEM_QUANTITY,
			afterSuccess: next,
			afterError: nextError,
		},
	};
};

export const removeItemFromShoppingCart = (payload, next, nextError) => {
	const { item_id } = payload;

	return {
		type: SINGLE_API,
		payload: {
			uri: `/${MODEL_PLURAL}/removeProduct/${item_id}`,
			opt: { method: 'DELETE' },
			successType: UPDATE_CART_ITEM_QUANTITY,
			afterSuccess: next,
			afterError: nextError,
		},
	};
};

export const createOrder = (payload, next, nextError) => {
	return {
		type: SINGLE_API,
		payload: {
			uri: '/orders',
			params: payload,
			opt: { method: 'POST' },
			afterSuccess: next,
			afterError: nextError,
		},
	};
};

export const paymentWithStripe = (payload, next, nextError) => {
	return {
		type: SINGLE_API,
		payload: {
			uri: '/stripe/charge',
			params: payload,
			opt: { method: 'POST' },
			afterSuccess: next,
			afterError: nextError,
		},
	};
};

export const emptyCart = (next, nextError) => {
	return {
		type: SINGLE_API,
		payload: {
			uri: `/shoppingcart/empty/${CartStorage.cart_id}`,
			opt: { method: 'DELETE' },
			successType: EMPTY_CART_SUCCESS,
			afterSuccess: next,
			afterError: nextError,
		},
	};
};
