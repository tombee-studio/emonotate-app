import React from 'react';
import { PageContainer, Section } from '../components/common/PageLayout';
import RequestListComponent from '../components/request-page/RequestListComponent';
import RequireListComponent from '../components/request-page/RequireListComponent';
import RelativeUserRequestList from '../components/request-page/RelativeUserRequestList';

const RequestListPage = (props) => {
  const { user } = window.django;

  const createReuquestList = user => {
    const list = [];
    list.push(<RequestListComponent />);
    if(user.groups.includes("Researchers")) {
      list.push(<RequireListComponent />);
      list.push(<RelativeUserRequestList />);
    }
    return list;
  };

  return (
    <PageContainer title="リクエスト">
        <Section>
          { createReuquestList(user) }
        </Section>
    </PageContainer>
  );
}

export default RequestListPage;
