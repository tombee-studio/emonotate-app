function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i];
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function createCurve() {
    fetch(`/api/curves/?format=json`, {
        method: 'post',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCookie('csrftoken'),
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(curve)
    })
    .then(res => {
        return res.json();
    })
    .then(data => {
        if(request.has_google_form) {
            const { google_form } = request;
            const googleFormURL = `${google_form.url}?${google_form.curve_id_entry_field}=${data.id}&${google_form.username_entry_field}=${data.user.username}`;
            window.open(googleFormURL);
            window.location.href = "/app/request_list/";
        } else {
            window.location.href = "/app/request_list/";
        }
    });
}
