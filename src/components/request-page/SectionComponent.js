import { Close, ExpandMore } from "@mui/icons-material";
import { 
    Accordion, 
    AccordionDetails, 
    AccordionSummary, 
    Button, 
    ButtonGroup, 
    FormGroup, 
    TextField, 
    Typography,
    Stack, 
    FormLabel, 
    Collapse,
    Alert,
    IconButton
} from "@mui/material";
import React, { useState } from "react";
import SectionAPI from "../../helper/SectionAPI";

const SectionComponent = props => {
    const { user } = window.django;
    const { 
        is_included_section, 
        request,
        section,
        content
    } = props;
    const [isOpen, setOpenFlag] = useState(false);
    const [severity, setSeverity] = useState("warning");
    const [message, setMessage] = useState("");
    const [webvtt, setWebvtt] = useState(is_included_section ? section.webvtt : "");
    const [title, setTitle] = useState(is_included_section ? section.title : "");
    const create = () => {
        const api = new SectionAPI();
        const _section = {};
        _section.content = content;
        _section.user = user.id;
        _section.content = content.id;
        _section.webvtt = webvtt;
        _section.title = title;
        const promise = api.create(_section, { "format": "json" });
        promise.then(data => {
            const promiseSetSection = api.set_section(request.id, data.id);
            promiseSetSection.then(data => {
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
        const api = new SectionAPI();
        const _section = { ...section };
        _section.content = content;
        _section.user = user.id;
        _section.content = content.id;
        _section.webvtt = webvtt;
        _section.title = title;
        const promise = api.update(_section.id, _section, { "format": "json" });
        promise.then(data => {
            window.location.href = `/app/requests/${request.id}`;
        });
        promise.catch(res => res.json()
            .then(data => {
                setOpenFlag(true);
                setSeverity("error");
                setMessage(data["webvtt"]);
            }));
    };

    const items = [];
    const buttons = [];
    if(is_included_section) {
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
        <FormLabel>区間情報(WebVTT形式で記述)</FormLabel>
        <TextField
            multiline
            value={webvtt}
            onChange={ev => setWebvtt(ev.target.value)} />
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
            <Typography>セクション/区間情報</Typography>
        </AccordionSummary>
        <AccordionDetails>
            <Stack m={2} spacing={2}>
                { items }
            </Stack>
        </AccordionDetails>
    </Accordion>;
};

export default SectionComponent;
