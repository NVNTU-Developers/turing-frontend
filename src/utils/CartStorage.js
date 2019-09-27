import Storage from './Storage';

class CartStorage extends Storage {
    get hasCartId() {
        return !!this.value && !!this.value.cart_id;
    }

    get cart_id() {
        return this.value && this.value.cart_id;
    }
}

export default new CartStorage('CART');
