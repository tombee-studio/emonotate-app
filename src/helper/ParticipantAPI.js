export default class ParticipantAPI {
    list(requestId) {
        return fetch(`/api/participants/${requestId}`)
            .then(res => res.json());
    }

    create(requestId, data) {
        return fetch(`/api/participants/${requestId}`, {
            method: 'post',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': window.django.csrf,
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(data)
        })
        .then(res => res.json());
    }

    delete(requestId, data) {
        return fetch(`/api/participants/${requestId}`, {
            method: 'delete',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': window.django.csrf,
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(data)
        })
        .then(res => res.json());
    }
};
