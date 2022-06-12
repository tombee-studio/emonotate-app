
export default class UserAPI {
  call(userId, success, failed) {
    fetch(`/api/users/${userId}?format=json`)
      .then(res => res.json())
      .then(success)
      .catch(failed);
  }

  getItem(userId, queries={'format': 'json'}) {
    const query = Object.keys(queries).map(key => `${key}=${queries[key]}`).join('&');
    return fetch(`/api/users/${userId}/?${query}`)
      .then(res => {
        if(res.status == 200) return res.json();
        else throw `Error`;
      });
  }

  convert(data) {
    return fetch(`/api/convert/`, {
      method: 'post',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': window.django.csrf,
      },
      body: JSON.stringify(data),
    });
  }

  update(userId, data) {
    return fetch(`/api/users/${userId}/?format=json`, {
      method: 'put',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': window.django.csrf,
      },
      body: JSON.stringify(data),
    });
  }
};
