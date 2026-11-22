var ButtonAction = function(graphView, youtubeView) {
    this.graphView = graphView;
    this.youtubeView = youtubeView;

    // The server answers with the reason, e.g. when a request is closed.
    this.read = async function(res) {
        const data = await res.json().catch(() => ({}));
        if(!res.ok) {
            throw new Error(data.detail || "保存できませんでした。");
        }
        return data;
    };

    this.createCurve = async function() {
        const createYoutubeContent = function(video_id) {
            const data = {
                "title": this.youtubeView.player.videoTitle,
                "video_id": video_id,
                "url": `https://www.youtube.com/watch?v=${video_id}`,
                "user": curve.user,
            };
            return fetch('/api/youtube/?format=json', {
                method: 'post',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken'),
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify(data)
            }).then(this.read);
        }.bind(this);
        const createCurveData = function(content) {
            curve.content = content.id;
            return fetch(`/api/curves/?format=json`, {
                method: 'post',
                mode: 'cors',
                headers: {
                  'Content-Type': 'application/json',
                  'X-CSRFToken': getCookie('csrftoken'),
                  'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify(curve)
            })
        }.bind(this);
        try {
            const found = await fetch(`/api/youtube/?search=${youtubeID}&format=json`).then(this.read);
            const content = found.models.length > 0 ? found.models[0] : await createYoutubeContent(youtubeID);
            const curveData = await createCurveData(content).then(this.read);
            if(request.has_google_form) {
                const { google_form } = request;
                const googleFormURL = `${google_form.url}?${google_form.curve_id_entry_field}=${curveData.id}&${google_form.username_entry_field}=${curveData.user.username}`;
                window.open(googleFormURL);
            }
            this.openCurve(curveData);
        } catch(err) {
            alert(err.message);
        }
    }.bind(this);

    this.updateCurve = async function() {
        let _curve = {...curve};
        _curve.content = _curve.content.id;
        _curve.user = _curve.user.id;
        try {
            const data = await fetch(`/api/curves/${_curve.id}/?format=json`, {
                method: 'put',
                mode: 'cors',
                headers: {
                  'Content-Type': 'application/json',
                  'X-CSRFToken': getCookie('csrftoken'),
                  'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify(_curve)
            }).then(this.read);
            this.openCurve(data);
        } catch(err) {
            alert(err.message);
        }
    }.bind(this);

    this.openCurve = function(data) {
        window.location.href = data.kind == 1 ? `/free-hand/${data.id}` : `/fold-line/${data.id}`;
    };

    this.jumpToDashboard = function() {
        window.location.href = "/";
    }.bind(this);
}
