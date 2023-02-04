var ButtonAction = function(graphView, youtubeView) {
    this.graphView = graphView;
    this.youtubeView = youtubeView;
    this.createCurve = function() {
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
            }).then(res => {
                if(res.status === 201) return res.json();
                else return res;
            });
        }.bind(this);
        const createCurveData = function(content) {
            curve.content = content.id;
            console.log(curve);
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

        let promise = fetch(`/api/youtube/?search=${youtubeID}&format=json`)
            .then(res => res.json())
            .then(data => {
                if(data.models.length > 0) {
                    return data.models[0];
                } else {
                    return createYoutubeContent(youtubeID)
                    .then(content => {
                        return content;
                    });
                }
            }).then(content => {
                return createCurveData(content);
            });
        promise.then(data => {
            if(request.has_google_form) {
                const { google_form } = request;
                const googleFormURL = `${google_form.url}?${google_form.curve_id_entry_field}=${data.id}&${google_form.username_entry_field}=${data.user.username}`;
                window.open(googleFormURL);
                window.location.href = "/app/request_list/";
            } else {
                window.location.href = "/app/request_list/";
            }
        });
        promise.catch(err => {
            console.log(err);
        });
    }    
};
