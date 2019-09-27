import * as Actions from '../../actions';
import AuthStorage from '../../../utils/AuthStorage';

const initialState = {
    list: [],
    isLoading: false,
    error: false
};

const reviewReducer = function (state = initialState, action) {
    switch (action.type) {
        case Actions.GET_REVIEWS_OF_A_PRODUCT_SUCCESS: {
            return {
                ...state,
                list: action.payload,
                isLoading: false,
                error: false
            };
        }

        case Actions.POST_A_PRODUCT_REVIEW_SUCCESS: {
            console.log('AuthStorage', AuthStorage);
            return {
                ...state,
                list: [...state.list, { ...action.payload, name: AuthStorage.customer_name }],
                isLoading: false,
                error: false
            };
        }

        default: {
            return state;
        }
    }
};

export default reviewReducer;