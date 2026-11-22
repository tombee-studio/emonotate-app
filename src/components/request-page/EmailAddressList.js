import React, { useEffect, useState } from 'react';
import {
  Alert, Box, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Pagination,
  Stack, Table, TableBody, TableCell, TableHead, TableRow, TextField,
} from '@mui/material';
import { EmptyState, ListSkeleton, Section } from '../common/PageLayout';
import ParticipantAPI from '../../helper/ParticipantAPI';

const PAGE_SIZE = 50;
const CHUNK = 500;
const api = new ParticipantAPI();

function AddDialog({ requestId, onClose, onAdded }) {
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const emails = Array.from(new Set(text.split(/[\s,;]+/).filter(Boolean)));

  async function add() {
    setBusy(true);
    setError('');
    let added = 0;
    try {
      for (let i = 0; i < emails.length; i += CHUNK) {
        added += (await api.add(requestId, emails.slice(i, i + CHUNK))).added;
      }
      onAdded(added);
    } catch (err) {
      const invalid = err.invalid || [];
      const more = invalid.length > 5 ? ` ほか${invalid.length - 5}件` : '';
      const done = added ? `（${added}人は追加済みです）` : '';
      setError([err.message + done, invalid.slice(0, 5).join('、') + more].filter(Boolean).join(' '));
      setBusy(false);
    }
  }
  return <Dialog open fullWidth maxWidth="sm" onClose={busy ? undefined : onClose}>
    <DialogTitle>参加者を追加</DialogTitle>
    <DialogContent>
      <DialogContentText>メールアドレスを改行・空白・カンマで区切って入力してください。</DialogContentText>
      <TextField autoFocus fullWidth multiline minRows={6} maxRows={14} margin="normal" label="メールアドレス"
        value={text} disabled={busy} onChange={event => setText(event.target.value)} />
      {error && <Alert severity="error" sx={{ overflowWrap: 'anywhere' }}>{error}</Alert>}
    </DialogContent>
    <DialogActions>
      <Button disabled={busy} onClick={onClose}>キャンセル</Button>
      <Button variant="contained" disabled={busy || !emails.length} onClick={add}>
        {busy ? '追加中…' : `${emails.length}件を追加`}
      </Button>
    </DialogActions>
  </Dialog>;
}

// The participants of a saved request, for its owner.
export default function EmailAddressList({ request }) {
  const [query, setQuery] = useState({ page: 1, search: '' });
  const [search, setSearch] = useState('');
  const [result, setResult] = useState(null);
  const [selected, setSelected] = useState([]);
  const [adding, setAdding] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (search === query.search) return undefined;
    const timer = setTimeout(() => setQuery({ page: 1, search }), 300);
    return () => clearTimeout(timer);
  }, [search, query.search]);

  useEffect(() => {
    let active = true;
    setSelected([]);
    setError('');
    api.list(request.id, { ...query, pageSize: PAGE_SIZE })
      .then(data => { if (active) setResult(data); })
      .catch(err => { if (active) setError(err.message); });
    return () => { active = false; };
  }, [request.id, query]);

  async function remove() {
    setBusy(true);
    setMessage('');
    try {
      await api.remove(request.id, selected);
      setMessage(`${selected.length}人を参加者から外しました。`);
      // The last page may be gone, so start over.
      setQuery({ ...query, page: 1 });
    } catch (err) {
      setError(err.message);
    }
    setBusy(false);
  }

  const rows = result ? result.models : [];
  const ids = rows.map(row => row.id);
  const all = ids.length > 0 && selected.length === ids.length;
  return <Section title={result ? `参加者（${result.pagination.total_entries}人）` : '参加者'}>
    <Stack spacing={2}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
        <TextField size="small" label="メールアドレス・ユーザ名で検索" value={search} sx={{ flexGrow: 1 }}
          onChange={event => setSearch(event.target.value)} />
        <Button variant="contained" onClick={() => { setMessage(''); setAdding(true); }}>追加</Button>
        <Button color="error" variant="outlined" disabled={busy || !selected.length} onClick={remove}>
          {selected.length ? `${selected.length}人を外す` : '選んで外す'}
        </Button>
      </Stack>
      {error && <Alert severity="error">{error}</Alert>}
      {message && <Alert severity="success">{message}</Alert>}
      {!error && !result && <ListSkeleton />}
      {result && rows.length === 0 && <EmptyState
        message={query.search ? '一致する参加者はいません' : '参加者はまだいません'} />}
      {rows.length > 0 && <Box sx={{ overflowX: 'auto' }}><Table size="small">
        <TableHead><TableRow>
          <TableCell padding="checkbox"><Checkbox checked={all} indeterminate={selected.length > 0 && !all}
            inputProps={{ 'aria-label': 'このページをすべて選択' }}
            onChange={() => setSelected(all ? [] : ids)} /></TableCell>
          <TableCell>メールアドレス</TableCell><TableCell>ユーザ名</TableCell><TableCell>依頼メール</TableCell>
        </TableRow></TableHead>
        <TableBody>{rows.map(row => <TableRow key={row.id} hover>
          <TableCell padding="checkbox"><Checkbox checked={selected.includes(row.id)}
            inputProps={{ 'aria-label': `${row.email || row.username}を選択` }}
            onChange={() => setSelected(selected.includes(row.id) ?
              selected.filter(id => id !== row.id) : [...selected, row.id])} /></TableCell>
          <TableCell>{row.email}</TableCell><TableCell>{row.username}</TableCell>
          <TableCell>{row.sended_mail ? '送信済み' : row.sended_mail_message || '未送信'}</TableCell>
        </TableRow>)}</TableBody>
      </Table></Box>}
      {result && result.pagination.total_pages > 1 && <Pagination count={result.pagination.total_pages}
        page={query.page} variant="outlined" shape="rounded"
        onChange={(_, page) => setQuery({ ...query, page })} />}
    </Stack>
    {adding && <AddDialog requestId={request.id} onClose={() => { setAdding(false); setQuery({ ...query }); }}
      onAdded={count => { setAdding(false); setMessage(`${count}人を追加しました。`); setQuery({ ...query, page: 1 }); }} />}
  </Section>;
}
