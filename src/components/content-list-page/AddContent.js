import React, { useState } from 'react';
import { Alert, Button, MenuItem, Stack, TextField, Typography } from '@mui/material';

export function youtubeId(value) {
  try {
    const url = new URL(value);
    if (!['http:', 'https:'].includes(url.protocol)) return null;
    let id;
    if (url.hostname === 'youtu.be') id = url.pathname.slice(1);
    if (['www.youtube.com', 'youtube.com', 'm.youtube.com'].includes(url.hostname)) {
      id = url.pathname === '/watch' ? url.searchParams.get('v') :
        (url.pathname.match(/^\/(?:shorts|embed|live)\/([^/]+)\/?$/) || [])[1];
    }
    return id && /^[\w-]{11}$/.test(id) ? id : null;
  } catch {
    return null;
  }
}

async function post(path, data) {
  const response = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-CSRFToken': window.django.csrf },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || '登録できませんでした。ログイン状態を確認してください。');
  }
  return response.json();
}

export default function AddContent() {
  const [kind, setKind] = useState('youtube');
  const [title, setTitle] = useState('');
  const [url, setURL] = useState('');
  const [file, setFile] = useState(null);
  const [body, setBody] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      const data = { title: title.trim() };
      if (kind === 'youtube') {
        data.video_id = youtubeId(url);
        if (!data.video_id) throw new Error('YouTubeの動画URLを入力してください。');
      } else {
        const source = kind === 'text' && !file ? new Blob([body], { type: 'text/plain' }) : file;
        const mime = kind === 'text' ? 'text/plain' : source.type;
        const limit = kind === 'text' ? 2 * 1024 ** 2 : 1024 ** 3;
        if (!source.size || source.size > limit) throw new Error(kind === 'text' ?
          '本文は2 MiB以内で入力してください。' : '動画は1 GiB以内で選んでください。');
        const { key, form } = await post('/api/sources/upload/', { mime });
        const fields = new FormData();
        Object.entries(form.fields).forEach(([name, value]) => fields.append(name, value));
        fields.append('file', source);
        const result = await fetch(form.url, { method: 'POST', body: fields });
        if (!result.ok) throw new Error('ファイルを送信できませんでした。再度お試しください。');
        data.key = key;
      }
      const content = await post('/api/sources/', data);
      window.location.assign('/app/curves/?content=' + content.id);
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  return <Stack spacing={2} component="form" onSubmit={submit} sx={{ maxWidth: 720 }}>
    <Typography variant="h5" component="h2">感情曲線を描く</Typography>
    <TextField select label="素材" value={kind} disabled={busy} onChange={e => {
      setKind(e.target.value); setFile(null); setError('');
    }}>
      <MenuItem value="youtube">YouTube</MenuItem>
      <MenuItem value="video">動画ファイル</MenuItem>
      <MenuItem value="text">テキスト</MenuItem>
    </TextField>
    <TextField required label="タイトル" inputProps={{ maxLength: 256 }} value={title}
      disabled={busy} onChange={e => setTitle(e.target.value)} />
    {kind === 'youtube' ? <TextField required type="url" label="YouTube URL" value={url}
      disabled={busy} onChange={e => setURL(e.target.value)} /> :
      <label>{kind === 'video' ? '動画（MP4・WebM）' : 'テキストファイル（UTF-8、任意）'}{' '}
        <input key={kind} type="file" accept={kind === 'video' ? 'video/mp4,video/webm' : '.txt,text/plain'}
          required={kind === 'video'} disabled={busy} onChange={e => setFile(e.target.files[0] || null)} />
      </label>}
    {kind === 'text' && !file && <TextField required multiline minRows={5} label="本文"
      value={body} disabled={busy} onChange={e => setBody(e.target.value)} />}
    {error && <Alert severity="error">{error}</Alert>}
    <Button type="submit" variant="contained" disabled={busy}>{busy ? '登録中…' : '入力を始める'}</Button>
  </Stack>;
}
