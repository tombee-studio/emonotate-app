import { CircularProgress, Button, ButtonGroup } from "@mui/material";
import React, { useEffect, useState } from "react";
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
        req.google_form = request.google_form.id;
        req.values = request.values;
        req.is_required_free_hand = request.is_required_free_hand;

        api.update(id, req, { "format": "json" })
        .then(data => {
            setRequest(data);
        });
    };
    const createContent = () => {
        if(isLoadedRequest) {
            return <>
                <ObserverComponent 
                    request={request}
                    onChange={ req => setRequest(req)}
                />
                <ButtonGroup>
                    <Button onClick={update}>更新</Button>
                </ButtonGroup>
            </>
        } else {
            return <CircularProgress />
        }
    };
    return createContent();
};

export default EditRequestComponent;
