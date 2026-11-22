import { Alert, ButtonGroup, Button } from "@mui/material";
import React, { useState } from "react";
import RequestListAPI from "../../helper/RequestListAPI";
import { useAppNavigate } from "../../navigation";
import { acceptance } from "./AcceptanceComponent";
import ObserverComponent from "./ObserverComponent";

const CreateRequestComponent = props => {
    const navigate = useAppNavigate();
    const [request, setRequest] = useState({});
    const [error, setError] = useState('');
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
        Object.assign(req, acceptance(request));

        api.create(req, { "format": "json" })
        .then(data => {
            navigate(`/app/requests/${data.id}`);
        })
        .catch(() => setError('作成できませんでした。入力内容を確認してください。'));
    };
    const createContent = () => {
        return <>
            <ObserverComponent 
                request={request}
                onChange={ req => setRequest(req)}
            />
            {error && <Alert severity="error">{error}</Alert>}
            <ButtonGroup>
                <Button onClick={create}>作成</Button>
            </ButtonGroup>
        </>
    };
    return createContent();
};

export default CreateRequestComponent;
