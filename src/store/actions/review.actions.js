import { SINGLE_API } from './type';
export const MODEL_NAME = 'PRODUCT';
export const MODEL_PLURAL = 'products';

export const GET_REVIEWS_OF_A_PRODUCT_SUCCESS = 'GET_REVIEWS_OF_A_PRODUCT_SUCCESS';
export const POST_A_PRODUCT_REVIEW_SUCCESS = 'POST_A_PRODUCT_REVIEW_SUCCESS';

export const getReviewsOfAProduct = (payload, next, nextError) => {
    const { product_id } = payload;

    return {
        type: SINGLE_API,
        payload: {
            uri: `/${MODEL_PLURAL}/${product_id}/reviews`,
            successType: GET_REVIEWS_OF_A_PRODUCT_SUCCESS,
            afterSuccess: next,
            afterError: nextError,
        },
    };
};

export const postAProductReview = (payload, next, nextError) => {
    const { product_id } = payload;

    return {
        type: SINGLE_API,
        payload: {
            uri: `/${MODEL_PLURAL}/${product_id}/reviews`,
            params: payload,
            opt: { method: 'POST' },
            successType: POST_A_PRODUCT_REVIEW_SUCCESS,
            afterSuccess: next,
            afterError: nextError,
        },
    };
};