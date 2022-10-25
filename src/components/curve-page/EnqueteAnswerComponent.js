import { FormGroup, FormLabel, Input } from "@mui/material";
import React from "react";

const EnqueteAnswerComponent = props => {
    const { enquete, onChangeAnswer } = props;
    return <FormGroup>
        <FormLabel>{enquete.title}</FormLabel>
        <Input 
            value={enquete.answer} 
            onChange={ev => {
                onChangeAnswer(enquete.id, ev.target.value);
            }} />
    </FormGroup>
};

export default EnqueteAnswerComponent;
