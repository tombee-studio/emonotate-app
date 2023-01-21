import React, { useState } from "react";
import { 
    Accordion, 
    AccordionSummary, 
    Typography, 
    AccordionDetails, 
    Stack, 
    FormGroup,
    TextField,
    FormLabel,
    Button,
    Collapse,
    Alert,
    IconButton,
    ButtonGroup
} from "@mui/material";
import { Close, ExpandMore } from "@mui/icons-material";
import GoogleFormAPI from "../../helper/GoogleFormAPI";

const GoogleFormComponent = props => {
    const { request } = props;
    const { google_form } = request;
    const [title, setTitle] = useState(
        google_form ? google_form.title: "");
    const [url, setURL] = useState(
        google_form ? google_form.url : "");
    const [usernameEntryField, setUsernameEntryField] = useState(
        google_form ? google_form.username_entry_field : "");
    const [curveIdEntryField, setCurveIdEntryField] = useState(
        google_form ? google_form.curve_id_entry_field : "");
    const [isOpen, setOpenFlag] = useState(false);
    const [severity, setSeverity] = useState("warning");
    const [message, setMessage] = useState("");

    const items = [];
    const buttons = [];
    const create = () => {
        const googleForm = {
            title, 
            url,
            username_entry_field: usernameEntryField,
            curve_id_entry_field: curveIdEntryField
        };
        const api = new GoogleFormAPI();
        const promise = api.create(googleForm, { format: "json" });
        promise.then(data => {
            const promiseSetGoogleForm = api.setGoogleForm(request.id, data.id);
            promiseSetGoogleForm.then(data => {
                window.location.href = `/app/requests/${request.id}`;
            });
        });
        promise.catch(res => res.text()
            .then(message => {
                setOpenFlag(true);
                setSeverity("error");
                setMessage(message);
            }));
    };
    const update = () => {
        const googleForm = {
            id: google_form.id,
            title, 
            url,
            username_entry_field: usernameEntryField,
            curve_id_entry_field: curveIdEntryField
        };
        const api = new GoogleFormAPI();
        const promise = api.update(
            google_form.id, 
            googleForm, 
            { format: "json" });
        promise.then(_ => {
            window.location.href = `/app/requests/${request.id}`;
        });
        promise.catch(res => res.text()
            .then(message => {
                setOpenFlag(true);
                setSeverity("error");
                setMessage(message);
            }));
    };
    if(request.has_google_form) {
        buttons.push(<Button onClick={update}>更新</Button>);
    } else {
        buttons.push(<Button onClick={create}>作成</Button>);
    }
    items.push(<Collapse in={isOpen}>
        <Alert
            severity={severity}
            action={
                <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                    setOpenFlag(false);
                }}
                >
                <Close fontSize="inherit" />
                </IconButton>
            }
            sx={{ mb: 2 }}>
          {message}
        </Alert>
      </Collapse>);
    items.push(<FormGroup>
        <FormLabel>タイトル</FormLabel>
        <TextField
            value={title}
            onChange={ev => setTitle(ev.target.value)} />
        </FormGroup>);
    items.push(<FormGroup>
        <FormLabel>Google FormのURL</FormLabel>
        <TextField
            multiline
            value={url}
            onChange={ev => setURL(ev.target.value)} />
        </FormGroup>);
    items.push(<FormGroup>
        <FormLabel>ユーザID入力欄</FormLabel>
        <TextField
            multiline
            value={usernameEntryField}
            onChange={ev => setUsernameEntryField(ev.target.value)} />
        </FormGroup>);
    items.push(<FormGroup>
        <FormLabel>曲線ID入力欄</FormLabel>
        <TextField
            multiline
            value={curveIdEntryField}
            onChange={ev => setCurveIdEntryField(ev.target.value)} />
        </FormGroup>);
    items.push(<ButtonGroup>
        { buttons }
    </ButtonGroup>);
    return <Accordion>
        <AccordionSummary
            expandIcon={<ExpandMore />}
            aria-controls="panel1a-content"
            id="panel1a-header"
        >
            <Typography>Google Form情報</Typography>
        </AccordionSummary>
        <AccordionDetails>
            <Stack m={2} spacing={2}>
                { items }
            </Stack>
        </AccordionDetails>
    </Accordion>;
};

export default GoogleFormComponent;
