import React from 'react';
import { PageContainer, Section } from '../components/common/PageLayout';
import RequestListComponent from '../components/request-page/RequestListComponent';
import RequireListComponent from '../components/request-page/RequireListComponent';
import RelativeUserRequestList from '../components/request-page/RelativeUserRequestList';

const RequestListPage = (props) => {
  const { user } = window.django;

  const createReuquestList = user => {
    const list = [];
    list.push(<RequestListComponent key="participant" />);
    if(user.groups.includes("Researchers")) {
      list.push(<RequireListComponent key="require" />);
      list.push(<RelativeUserRequestList key="relative" />);
    }
    return list;
  };

  return (
    <PageContainer title="リクエスト">
        { createReuquestList(user).map(item => <Section key={item.key}>{item}</Section>) }
    </PageContainer>
  );
}

export default RequestListPage;
