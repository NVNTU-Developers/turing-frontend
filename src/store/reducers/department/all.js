import * as Actions from '../../actions';

const initialState = {
    departments: [],
    isLoading: false,
    error: false
};

const AllDepartmentsReducer = function (state = initialState, action) {
    switch (action.type) {
        case Actions.GET_ALL_DEPARTMENT_AND_CATEGORY_SUCCESS:
            {
                return {
                    ...state,
                    departments: action.payload,
                    isLoading: false,
                    error: false
                };
            }
        default:
            {
                return state;
            }
    }
};

export default AllDepartmentsReducer;