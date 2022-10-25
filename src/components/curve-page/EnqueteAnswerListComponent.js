import { FormGroup, Box } from "@mui/material";
import React from "react";

import EnqueteAnswerComponent from "./EnqueteAnswerComponent";

const EnqueteAnswerListComponent = props => {
    const { enquetes, setAnswers } = props;
    return <Box m={2}>
        <FormGroup>
            { enquetes.map(enquete => 
                <EnqueteAnswerComponent 
                    enquete={enquete}
                    onChangeAnswer={(id, value) => {
                        const answers = [ ...enquetes ];
                        answers.find(answer => answer.id == id).answer = value;
                        setAnswers([...answers]);
                    }} />) }
        </FormGroup>
    </Box>;
};

export default EnqueteAnswerListComponent;
