/* eslint-disable func-names */
import * as Actions from '../../actions';

const initialState = {
	products: [],
	isLoading: false,
	error: false,
};

const shoppingCartReducer = function (state = initialState, action) {
	switch (action.type) {
		case Actions.GET_CART_PRODUCTS_SUCCESS: {
			return {
				...state,
				products: action.payload,
				isLoading: false,
				error: false,
			};
		}

		case Actions.UPDATE_CART_ITEM_QUANTITY: {
			const products = state.products.map((el) => {
				if (el.item_id === action.payload.item_id) {
					return { ...el, quantity: action.payload.quantity };
				}
				return el;
			});

			return {
				...state,
				products,
				isLoading: false,
				error: false,
			};
		}

		case Actions.EMPTY_CART_SUCCESS: {
			return {
				...state,
				products: [],
				isLoading: false,
				error: false,
			};
		}

		default: {
			return state;
		}
	}
};

export default shoppingCartReducer;
