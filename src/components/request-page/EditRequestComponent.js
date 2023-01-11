import { CircularProgress, Button, ButtonGroup, Stack } from "@mui/material";
import React, { useEffect, useState } from "react";
import EmonotateAPI from "../../helper/EmonotateAPI";
import RequestListAPI from "../../helper/RequestListAPI";
import ObserverComponent from "../request-page/ObserverComponent";

const EditRequestComponent = props => {
    const { id } = props;
    const [isLoadedRequest, setFlagLoadedRequest] = useState(false);
    const [request, setRequest] = useState({});
    useEffect(() => {
        const api = new RequestListAPI();
        api.getItem(id, {"format": "json"})
            .then(req => {
                setRequest(req);
                setFlagLoadedRequest(true);
            });
    }, []);
    const update = ev => {
        const api = new RequestListAPI();
        const req = {}
        req.title = request.title;
        req.description = request.description;
        req.content = request.content.id;
        req.value_type = request.value_type.id;
        req.owner = request.owner.id;
        if(req.google_form != undefined) {
            req.google_form = request.google_form.id;
        }
        req.values = request.values;
        req.is_required_free_hand = request.is_required_free_hand;

        api.update(id, req, { "format": "json" })
        .then(data => {
            setRequest(data);
        });
    };
    const download = ev => {
        const api = new EmonotateAPI();
        api.getRequestItemAPI("get_download_curve_data", request.id)
        .then(json => {
            const transport = (json) => {
                const req = { ...request };
                const link = document.createElement('a');
                document.body.appendChild(link);
                link.href = json["url"];
                link.setAttribute('download', json["file_name"]);
                link.click();
                document.body.removeChild(link);
            }
            if(json["state"] == "SUCCESSED") {
                transport(json);
            }
            setRequest(json.request);
        })
        .catch(err => {
            alert(err);
        });
    };
    var downloadButtonMessage =  "ダウンロード準備進行中";
    if(request.state_processing_to_download == 2) {
        downloadButtonMessage = "ダウンロード可能";
    } 
    else if(request.state_processing_to_download == -1) {
        downloadButtonMessage = "再度ダウンロードボタンを押してください";
    } 
    else if(request.state_processing_to_download == 0) {
        downloadButtonMessage = "ダウンロード準備開始";
    }

    const createContent = () => {
        if(isLoadedRequest) {
            return <>
                <ObserverComponent 
                    request={request}
                    onChange={ req => setRequest(req)}
                />
                <Stack m={2} spacing={2} direction={"row"}>
                    <ButtonGroup>
                        <Button onClick={update}>更新</Button>
                    </ButtonGroup>
                    <ButtonGroup>
                        <Button 
                            onClick={download}
                            disabled={ request.state_processing_to_download == 1 }>
                            { downloadButtonMessage }
                        </Button>
                    </ButtonGroup>
                </Stack>
            </>
        } else {
            return <CircularProgress />
        }
    };
    return createContent();
};

export default EditRequestComponent;
