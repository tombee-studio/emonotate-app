export default class GoogleFormAPI {
    create(data, queries={
      'format': 'json'
    }) {
      const query = Object.keys(queries).map(key => `${key}=${queries[key]}`).join('&');
      return fetch(`/api/google_forms/?${query}`, {
          method: 'post',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': window.django.csrf,
            'Access-Control-Allow-Origin': '*'
          },
          body: JSON.stringify(data)
        })
        .then(res => {
          if(res.status != 200 && res.status != 201) throw res;
          return res.json();
        });
    }
  
    update(id, data, queries={
      'format': 'json'
    }) {
      const query = Object.keys(queries).map(key => `${key}=${queries[key]}`).join('&');
      return fetch(`/api/google_forms/${id}/?${query}`, {
          method: 'put',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': window.django.csrf,
          },
          body: JSON.stringify(data)
        })
        .then(res => {
          if(res.status >= 300) throw res;
          return res.json();
        });
    }
  
    delete(item) {
      return fetch(`/api/sections/${item}`, {
        method: 'delete',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': window.django.csrf,
        }
      })
    }

    setGoogleForm(requestId, googleFormId) {
      return fetch(`/api/set_google_form/${requestId}`, {
        method: 'put',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': window.django.csrf,
        },
        body: JSON.stringify({ "google_form": googleFormId })
      });
    }
  };
  