export default class RelativeUserAPI {
    list() {
        return fetch(`/api/relative_users/`)
            .then(res => res.json());
    }
};
