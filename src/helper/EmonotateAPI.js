export default class EmonotateAPI {
    get(queries={ 'format': 'json' }) {
        const query = Object.keys(queries).map(key => `${key}=${queries[key]}`).join('&');
        return fetch(`/api/?${query}`)
        .then(res => {
            if(res.status == 200) {
                return res;
            } else {
                throw "can't call api";
            }
        });
    }
};