export default class AuthenticateAPI {
  login(data, queries={
    'format': 'json'
  }) {
    const query = Object.keys(queries).map(key => `${key}=${queries[key]}`).join('&');
    return fetch(`/api/login/?${query}`, {
      method: 'post',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': window.django.csrf,
      },
      body: JSON.stringify(data)
    }).then(res => {
        if (res.status === 200 || res.status === 302) {
          return res.json();
        }
        else {
          throw res.json()
        }
    });
  }

  signup(data, queries={
    'format': 'json'
  }) {
    const query = Object.keys(queries).map(key => `${key}=${queries[key]}`).join('&');
    return fetch(`/api/signup/?${query}`, {
      method: 'post',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': window.django.csrf,
      },
      body: JSON.stringify(data)
    })
    .then(res => {
        if (res.status === 201 || res.status === 302) {
          return res.json();
        }
        else {
          throw res;
        }
    });
  }

  logout() {
    return fetch('/api/logout/?format=json', {
      method: 'post',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': window.django.csrf,
      }
    }).then(res => {
        return res.json()
    })
  }

  sendVerificationMail() {
    return fetch('/api/verify/', {
      method: 'post',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': window.django.csrf,
      }
    }).then(res => {
      if(Math.trunc(res.status / 100) == 2) {
        return res.text();
      } else {
        throw res;
      }
    });
  }

  sendPasswordResetMail(data) {
    return fetch('/api/reset_password/', {
      method: 'post',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': window.django.csrf,
      },
      body: JSON.stringify(data)
    }).then(res => {
      if(res.status == 200) {
        return res.text();
      } else {
        throw res;
      }
    });
  }
};
  