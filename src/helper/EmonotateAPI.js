export default class EmonotateAPI {
    get() {
        return fetch('/');
    }

    getRequestItemAPI(entry, request_id, queries={}) {
        var query = Object.keys(queries).map(key => `${key}=${queries[key]}`).join('&');
        return fetch(`/api/${entry}/${request_id}?${query}`).then(res => {
            if(res.status == 200) {
                return res.json();
            } else {
                throw "Invaild Error";
            }
        })
    }
};
  