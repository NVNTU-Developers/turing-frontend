import * as Actions from '../../actions';

const initialState = {
    data: {
        customer: {},
    },
    isLoading: false,
    error: false
};

const ProfileReducer = function (state = initialState, action) {
    switch (action.type) {
        case Actions.LOGIN_SUCCESS: {
            return {
                ...state,
                data: action.payload,
                isLoading: false,
                error: false
            };
        }
        case 'LOGOUT_SUCCESS': {
            return initialState;
        }
        default: {
            return state;
        }
    }
};

export default ProfileReducer;