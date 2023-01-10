import React from 'react';
import { Box } from '@mui/material';
import CreateRequestComponent from '../components/request-page/CreateRequestComponent';
import EditRequestComponent from '../components/request-page/EditRequestComponent';

const RequestPage = props => {
    const { id }  = props;
    const createRequestComponent = id => {
        if(id) {
            /**
             * リクエスト更新
             */
            return <EditRequestComponent id={id} />
        } else if(id == undefined) {
            /**
             * リクエスト作成
             */
            return <CreateRequestComponent />
        } else {
            alert("不明なエラー@RequestPage");
        }
    };
    return <Box m={2}>
        {createRequestComponent(id)}
    </Box>;
};

export default RequestPage;
