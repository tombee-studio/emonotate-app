import React from 'react';
import { PageContainer, Section } from '../components/common/PageLayout';
import AddContent from '../components/content-list-page/AddContent';
import ContentsHistoryList from '../components/content-list-page/ContentsHistoryList';

export default function ContentListPage() {
  return <PageContainer title="コンテンツ"><Section><AddContent /></Section><Section><ContentsHistoryList /></Section></PageContainer>;
}
