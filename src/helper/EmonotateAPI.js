export default class EmonotateAPI {
    get() {
        return fetch('/api?format=json')
        .then(res => {
            if(res.status == 200) {
                return res.json();
            } else {
                throw "can't call api";
            }
        });
    }
};