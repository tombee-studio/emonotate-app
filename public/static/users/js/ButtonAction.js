var ButtonAction = function(graphView, youtubeView) {
    this.graphView = graphView;
    this.youtubeView = youtubeView;

    this.uploadImage = function(data) {
        const getGcpToken = function() {
            return fetch(`/api/gcp_access_token/`, {
                method: 'post',
                mode: 'cors',
                headers: {
                  'Content-Type': 'application/text',
                  'X-CSRFToken': getCookie('csrftoken'),
                  'Access-Control-Allow-Origin': '*'
                },
                body: ""
            });
        };
        const getBlobFrom = function (base64) {
            var bin = atob(base64.replace(/^.*,/, ''));
            var buffer = new Uint8Array(bin.length);
            for (var i = 0; i < bin.length; i++) {
                buffer[i] = bin.charCodeAt(i);
            }
            // Blobを作成
            try{
                var blob = new Blob([buffer.buffer], {
                    type: 'image/png'
                });
            }catch (e){
                return false;
            }
            return blob;
        }
        const createImage = function() {
            return new Promise(resolve => {
                const input = document.querySelector(".anychart-ui-support");

                const svgData = new XMLSerializer().serializeToString(input);
                const svgDataBase64 = btoa(unescape(encodeURIComponent(svgData)));
                const svgDataUrl = `data:image/svg+xml;charset=utf-8;base64,${svgDataBase64}`;

                const image = new Image();

                image.addEventListener('load', () => {
                    const width = 640;
                    const height = 320;
                    const canvas = document.createElement('canvas');

                    canvas.setAttribute('width', width);
                    canvas.setAttribute('height', height);

                    const context = canvas.getContext('2d');
                    context.drawImage(image, 0, 0, width, height);

                    const dataUrl = canvas.toDataURL('image/png');
                    resolve(getBlobFrom(dataUrl));
                });

                image.src = svgDataUrl;
            });
        }.bind(this);

        const callGcpStorageAPI = function(token) {
            return createImage().then(blob => {
                const fileName = `image_${getCookie("staging")}_${data.id}.png`;
                return fetch(`https://storage.googleapis.com/upload/storage/v1/b/${token.bucket_name}/o?uploadType=media&name=${fileName}`, {
                    method: 'post',
                    mode: 'cors',
                    headers: {
                        "Content-Type": "image/png",
                        'Authorization': `Bearer ${token.access_token}`,
                        'Access-Control-Allow-Origin': '*'
                    },
                    body: blob
                });
            });
        }.bind(this);

        let promise = getGcpToken().then(res => {
            if(res.status == 200) {
                return res.json();
            } else {
                throw res;
            }
        });
        return promise.then(token => callGcpStorageAPI(token));
    }.bind(this);

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
            }).then(res => {
                if(res.status === 201) return res.json();
                else return res;
            });
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
        let data = await fetch(`/api/youtube/?search=${youtubeID}&format=json`)
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
        let curveData = await data.json();
        await this.uploadImage(curveData);
        if(request.has_google_form) {
            const { google_form } = request;
            const googleFormURL = `${google_form.url}?${google_form.curve_id_entry_field}=${data.id}&${google_form.username_entry_field}=${data.user.username}`;
            window.open(googleFormURL);
        }
        if(curveData.kind == 1) {
            window.location.href = `/free-hand/${curveData.id}`;
        } else if(curveData.kind == 2) {
            window.location.href = `/fold-line/${curveData.id}`;
        }
    }.bind(this);

    this.updateCurve = async function() {
        let _curve = {...curve};
        _curve.content = _curve.content.id;
        _curve.user = _curve.user.id;
        const updateCurveData = function() {
            return fetch(`/api/curves/${_curve.id}/?format=json`, {
                method: 'put',
                mode: 'cors',
                headers: {
                  'Content-Type': 'application/json',
                  'X-CSRFToken': getCookie('csrftoken'),
                  'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify(_curve)
            });
        }.bind(this);

        await this.uploadImage(_curve);
        let promise = updateCurveData();
        promise.then(res => {
            if(res.status == 200) {
                return res.json();
            } else {
                throw res;
            }
        }).then(data => {
            if(data.kind == 1) {
                window.location.href = `/free-hand/${data.id}`;
            } else if(data.kind == 2) {
                window.location.href = `/fold-line/${data.id}`;
            }
        });
        promise.catch(res => res.text())
        .then(err => {
            console.log(err);
        });
    };

    this.jumpToDashboard = function() {
        window.location.href = "/";
    }.bind(this);
}
