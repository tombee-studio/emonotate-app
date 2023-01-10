import { ButtonGroup, Button } from "@mui/material";
import React, { useState } from "react";
import RequestListAPI from "../../helper/RequestListAPI";
import ObserverComponent from "./ObserverComponent";

const CreateRequestComponent = props => {
    const [request, setRequest] = useState({});
    const create = ev => {
        const api = new RequestListAPI();
        const req = {}
        req.title = request.title;
        req.description = request.description;
        req.content = request.content.id;
        req.value_type = request.value_type.id;
        req.owner = window.django.user.id;
        req.values = request.values;
        req.is_required_free_hand = request.is_required_free_hand;

        api.create(req, { "format": "json" })
        .then(data => {
            window.location.href = `/app/requests/${data.id}`;
        });
    };
    const createContent = () => {
        return <>
            <ObserverComponent 
                request={request}
                onChange={ req => setRequest(req)}
            />
            <ButtonGroup>
                <Button onClick={create}>作成</Button>
            </ButtonGroup>
        </>
    };
    return createContent();
};

export default CreateRequestComponent;
