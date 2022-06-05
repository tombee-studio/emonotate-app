import React, { useState } from "react";

import { 
    FormLabel,
    Box,
    TextField,
    Autocomplete } from "@mui/material";
import ValueTypeListAPI from "../../helper/ValueTypeListAPI";

const ValueTypeComponent = props => {
    const { defaultValue, onChange } = props;
    const [valueTypes, setValueTypes] = useState([]);
    return (<Box>
        <FormLabel>種類</FormLabel>
        <Autocomplete 
            options={valueTypes}
            defaultValue={defaultValue}
            getOptionLabel={value_type => value_type.title}
            renderInput={params => <TextField {...params}/>}
            onInputChange={(event, value) => {
                const api = new ValueTypeListAPI();
                api.list({
                    'format': 'json',
                    'search': value
                }).then(data => {
                    setValueTypes(data.models);
                });
            }}
            onChange={onChange}
        />
    </Box>);
};

export default ValueTypeComponent;
