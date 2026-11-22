import React, { useEffect, useState } from 'react';
import {
  Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, List, ListItem, ListItemText, Pagination,
  Skeleton, Stack, Typography,
} from '@mui/material';
import { EmptyState, ListSkeleton, Section } from '../common/PageLayout';
import CurveEditor from '../curve-page/CurveEditor';
import { axes } from '../../helper/curve';

const PAGE_SIZE = 20;

async function json(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error('回答を読み込めませんでした。');
  return response.json();
}

function Answer({ row, onClose }) {
  const [curve, setCurve] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => {
    let active = true;
    json('/api/curves/' + row.id + '/?format=json').then(data => { if (active) setCurve(data); })
      .catch(err => { if (active) setError(err.message); });
    return () => { active = false; };
  }, [row.id]);
  return <Dialog open fullWidth maxWidth="md" onClose={onClose}>
    <DialogTitle sx={{ overflowWrap: 'anywhere' }}>{row.user.email || row.user.username}の回答</DialogTitle>
    <DialogContent>
      {error && <Alert severity="error">{error}</Alert>}
      {!error && !curve && <Skeleton variant="rounded" height={240} />}
      {curve && <Stack spacing={2}>
        <Typography color="text.secondary">{curve.content.title} / {curve.value_type.title}</Typography>
        {Array.isArray(curve.values) && curve.values.length > 1 ?
          <CurveEditor readOnly values={curve.values} kind={1}
            area={{ ...axes(curve), duration: curve.values[curve.values.length - 1].x || 1 }} /> :
          <Alert severity="warning">曲線の点がありません。</Alert>}
        {curve.enquete.map(item => <div key={item.id}>
          <Typography variant="subtitle2">{item.title}</Typography>
          <Typography sx={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>{item.answer}</Typography>
        </div>)}
      </Stack>}
    </DialogContent>
    <DialogActions><Button onClick={onClose}>閉じる</Button></DialogActions>
  </Dialog>;
}

// The answers to a request, for its owner.
export default function AnswerListComponent({ requestId }) {
  const [page, setPage] = useState(1);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState(null);
  useEffect(() => {
    let active = true;
    setResult(null);
    setError('');
    json(`/api/requests/${requestId}/curves/?format=json&page_size=${PAGE_SIZE}&page=${page}`)
      .then(data => { if (active) setResult(data); })
      .catch(err => { if (active) setError(err.message); });
    return () => { active = false; };
  }, [requestId, page]);

  return <Section title={result ? `回答（${result.pagination.total_entries}件）` : '回答'}>
    {error && <Alert severity="error">{error}</Alert>}
    {!error && !result && <ListSkeleton />}
    {result && result.models.length === 0 && <EmptyState message="回答はまだありません" />}
    {result && result.models.length > 0 && <List>
      {result.models.map(row => <ListItem key={row.id} button onClick={() => setSelected(row)}>
        <ListItemText sx={{ overflowWrap: 'anywhere' }} primary={row.user.email || row.user.username}
          secondary={`${new Date(row.created).toLocaleString('ja-JP')} / ${row.kind === 1 ? 'フリーハンド' : '指定点'}`} />
      </ListItem>)}
    </List>}
    {result && result.pagination.total_pages > 1 && <Pagination count={result.pagination.total_pages} page={page}
      variant="outlined" shape="rounded" onChange={(_, value) => setPage(value)} />}
    {selected && <Answer row={selected} onClose={() => setSelected(null)} />}
  </Section>;
}
