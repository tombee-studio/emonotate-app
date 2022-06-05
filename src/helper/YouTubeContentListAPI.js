
export default class YouTubeContentListAPI {
    list(queries={
        'format': 'json'
    }) {
        const query = Object.keys(queries).map(key => `${key}=${queries[key]}`).join('&');
        return fetch(`/api/youtube/?${query}`)
            .then(res => {
                if(res.status != 200 && res.status != 201) throw res.message;
                return res.json();
            });
    }
    
    getItem(id, queries={
        'format': 'json'
    }) {
        const query = Object.keys(queries).map(key => `${key}=${queries[key]}`).join('&');
        return fetch(`/api/youtube/${id}?${query}`)
            .then(res => {
                if(res.status != 200 && res.status != 201) throw res.message;
                return res.json();
            });
    }
  
    create(data) {
        return fetch('/api/youtube/?format=json', {
            method: 'post',
            mode: 'cors',
            headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': window.django.csrf,
            'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(data)
        }).then(res => {
            if(res.status == 201) return res.json();
            else return res;
        });
    }
  
    delete(item) {
        return fetch(`/api/contents/${item}`, {
            method: 'delete',
            mode: 'cors',
            headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': window.django.csrf,
            }
        })
    }
};
  