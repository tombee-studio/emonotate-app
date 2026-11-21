import React from 'react';
import { PageContainer, Section } from '../components/common/PageLayout';
import History from '../components/dashboard/History';

export default function HistoryPage(props) {
  return (
    <PageContainer title="履歴">
      <Section>
        <History />
      </Section>
    </PageContainer>
  );
}