export default class YouTubeDataAPI {
    url = 'https://www.googleapis.com/youtube/v3';
    get(queries = {}) {
        const query = Object.keys(queries).map(key => `${key}=${queries[key]}`).join('&');
        return fetch(`${this.url}/search?${query}`)
            .then(res => {
                if(res.status == 200 || res.status == 201) return res.json();
                else throw res;
            });
    }

    videos(queries={}) {
        const query = Object.keys(queries).map(key => `${key}=${queries[key]}`).join('&');
        return fetch(`${this.url}/videos?${query}`)
            .then(res => {
                if(res.status == 200 || res.status == 201) return res.json();
                else throw res;
            });
    }
};
  