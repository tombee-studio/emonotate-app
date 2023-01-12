import { Assignment } from "@mui/icons-material";
import { 
    FormGroup, 
    IconButton, 
    InputAdornment, 
    OutlinedInput, 
    Tooltip, 
    FormControl, 
    Typography,
    Divider,
    TextField,
    Stack,
    CircularProgress
} from "@mui/material";
import React, { useEffect, useState } from "react";

import InvitingTokenAPI from "../../helper/InvitingTokenAPI";

import CreateIcon from '@mui/icons-material/Create';

const GenerateInvitingTokenComponent = props => {
    const [invitingToken, setInvitingToken] = useState({});
    const [url, setURL] = useState("");
    const [expirationDate, setExpirationDate] = useState(new Date());
    const [errorMessage, setErrorMessage] = useState("");
    const [loadedFlag, setLoadedFlag] = useState(false);
    const generateIconButton = () => {
        if(url) {
            return <Tooltip
                arrow
                placement='top'
                title='クリップボードにURLをコピーします'>
                <IconButton
                    type="button"
                    disabled={url === ''}
                    onClick={ev => {
                        ev.preventDefault();
                        const datetime = `${invitingToken.expiration_date}.000`;
                        navigator.clipboard.writeText(url);
                        setExpirationDate(datetime);
                    }}>
                    <Assignment />
                </IconButton>
            </Tooltip>;
        } else {
            return <IconButton 
                type="button"
                onClick={ev => {
                    const api = new InvitingTokenAPI();
                    api.create({
                        "expiration_date": expirationDate
                    })
                    .then(json => {
                        if(json.is_error) {
                            setErrorMessage(json.message);
                        } else {
                            setInvitingToken(json.inviting_token);
                            setURL(`${process.env.REACT_APP_APP_URL}api/login/?inviting=${json.inviting_token.token}`);
                        }
                    });
                }}>
                <CreateIcon />
            </IconButton>
        }
    };
    useEffect(() => {
        const api = new InvitingTokenAPI();
        api.get()
            .then(json => {
                if(!json.is_error) {
                    setInvitingToken(json.inviting_token);
                    setURL(`${process.env.REACT_APP_APP_URL}api/login/?inviting=${json.inviting_token.token}`);
                }
                setLoadedFlag(true);
            });
    }, []);
    const items = [];
    items.push(<Typography
        component="span"
        variant="h6"
        color="textPrimary">
        招待URLの作成
        <Typography
            color="textSecondary"
            variant="body1">
            研究者ツールを提供するための招待URLを作成します。<br />
            あなたは招待URLを通じてEmonotateを使用しているユーザ（招待ユーザ）が作成したコンテンツ、感情曲線の種類を利用することができます。<br />
            また、あなたが作成したコンテンツ、感情曲線の種類を招待ユーザは使用することができます。
        </Typography>
    </Typography>);
    items.push(<Divider />);
    if(loadedFlag) {
        const datetime = `${invitingToken.expiration_date}.000`;
        items.push(<TextField
            error
            id="datetime-local"
            label="Expriation Date/Time"
            type="datetime-local"
            defaultValue={datetime}
            sx={{ width: 250 }}
            InputLabelProps={{
                shrink: true,
                readonly: true 
            }}
            helperText={errorMessage}
            onChange={ev => setExpirationDate(ev.target.value)}
            />);
        items.push(<FormControl variant='outlined'>
            <OutlinedInput 
                readOnly={true}
                value={url}
                endAdornment={
                    <InputAdornment position="end">
                        { generateIconButton() }
                    </InputAdornment>
                }
            />
        </FormControl>);
    } else {
        items.push(<CircularProgress />)
    }
    return <FormGroup>
        <Stack spacing={2}>
            { items }
        </Stack>
    </FormGroup>;
};

export default GenerateInvitingTokenComponent;
