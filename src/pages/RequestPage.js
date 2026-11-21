import React from 'react';
import { PageContainer } from '../components/common/PageLayout';
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
    return <PageContainer title="リクエスト管理">
        {createRequestComponent(id)}
    </PageContainer>;
};

export default RequestPage;
