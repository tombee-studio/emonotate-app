export default class ParticipantAPI {
    get() {
        return fetch(`/api/inviting_tokens/`)
            .then(res => res.json());
    }

    create(data) {
        return fetch(`/api/inviting_tokens/`, {
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
};
