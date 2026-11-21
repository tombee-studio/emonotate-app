import React from 'react';
import { PageContainer, Section } from '../components/common/PageLayout';
import ValueTypeListAPI from '../helper/ValueTypeListAPI';
import ValueTypeHistoryList from '../components/value-type-list/ValueTypeHistoryList';
import AddValueType from '../components/value-type-list/AddValueType';

export default function Dashboard(props) {
  const postAPI = new ValueTypeListAPI();

  return (
    <PageContainer title="表現語">
      <Section>
      <AddValueType postAPI={data => {
        postAPI.post(data)
          .then(res => {
            return res.json();
          })
          .then(d => {
            window.location.href = '/';
          });
      }} />
      </Section>
      <Section>
        <ValueTypeHistoryList />
      </Section>
    </PageContainer>
  );
}
