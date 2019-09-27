import Storage from './Storage';

class AuthStorage extends Storage {
    get loggedIn() {
        return !!this.value && !!this.value.token;
    }

    get token() {
        return this.value && this.value.token;
    }

    get customer_id() {
        return this.value && this.value.customer_id;
    }

    get customer_name() {
        return this.value && this.value.customer_name;
    }
}

export default new AuthStorage('AUTH');
