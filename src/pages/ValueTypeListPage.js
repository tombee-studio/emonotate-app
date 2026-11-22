import React from 'react';
import { PageContainer, Section } from '../components/common/PageLayout';
import { useAppNavigate } from '../navigation';
import ValueTypeListAPI from '../helper/ValueTypeListAPI';
import ValueTypeHistoryList from '../components/value-type-list/ValueTypeHistoryList';
import AddValueType from '../components/value-type-list/AddValueType';

export default function Dashboard(props) {
  const navigate = useAppNavigate();
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
            navigate('/app/dashboard/');
          });
      }} />
      </Section>
      <Section>
        <ValueTypeHistoryList />
      </Section>
    </PageContainer>
  );
}
