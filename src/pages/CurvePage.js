import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Alert, Box, Button, CircularProgress, Stack } from '@mui/material';
import CurveVideoComponent from '../components/curve-page/CurveVideoComponent';
import CurveYouTubeComponent from '../components/curve-page/CurveYouTubeComponent';
import TextCurve from '../components/curve-page/TextCurve';
import EnqueteAnswerListComponent from '../components/curve-page/EnqueteAnswerListComponent';
import RequestDetailComponent from '../components/curve-page/RequestDetailComponent';

async function json(url, options) {
  const response = await fetch(url, options);
  if (!response.ok) throw new Error(response.status === 401 ? 'ログインしてください。' : 'データを読み書きできませんでした。');
  return response.json();
}

export default function CurvePage({ id }) {
  const { search } = useLocation();
  const [curve, setCurve] = useState(null);
  const [request, setRequest] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    let active = true;
    async function load() {
      const params = new URLSearchParams(search);
      if (id) return json('/api/curves/' + id + '/?format=json');
      let content;
      let req;
      if (params.has('request')) {
        req = await json('/api/requests/' + encodeURIComponent(params.get('request')) + '/?format=json');
        content = req.content;
        if (active) setRequest(req);
      } else {
        let sourceId = params.get('content');
        if (!sourceId && params.has('videoId')) {
          const videoId = params.get('videoId');
          const source = await json('/api/sources/', {
            method: 'POST', headers: { 'Content-Type': 'application/json', 'X-CSRFToken': window.django.csrf },
            body: JSON.stringify({ title: videoId, video_id: videoId }),
          });
          sourceId = source.id;
        }
        if (!sourceId) throw new Error('ホームから素材を選んでください。');
        content = await json('/api/contents/' + encodeURIComponent(sourceId) + '/?format=json');
      }
      return {
        content, user: window.django.user.id, version: 'arc-1', kind: 2,
        value_type: req ? req.value_type : window.django.user.default_value_type,
        values: req ? req.values : [], locked: Boolean(req), room_name: req ? req.room_name : 'content-' + content.id,
        enquete: req ? req.enquetes.map(item => ({ ...item, answer: '' })) : [],
      };
    }
    load().then(data => { if (active) setCurve(data); })
      .catch(err => { if (active) setError(err.message); });
    return () => { active = false; };
  }, [id, search]);

  async function save() {
    setSaving(true);
    setError('');
    try {
      const saved = await json(id ? '/api/curves/' + id + '/' : '/api/curves/', {
        method: id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json', 'X-CSRFToken': window.django.csrf },
        body: JSON.stringify({ ...curve, user: window.django.user.id, content: curve.content.id,
          value_type: curve.value_type.id }),
      });
      if (request && request.has_google_form) {
        const form = request.google_form;
        const url = new URL(form.url);
        url.searchParams.set(form.username_entry_field, window.django.user.username);
        url.searchParams.set(form.curve_id_entry_field, saved.id);
        window.open(url.toString(), '_blank', 'noopener');
      }
      window.location.assign('/app/history/');
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  }

  if (!curve) return <Box m={2}>{error ? <Alert severity="error">{error}</Alert> : <CircularProgress />}</Box>;
  const Editor = curve.content.video_id ? CurveYouTubeComponent :
    curve.content.data_type === 'text/plain' ? TextCurve : CurveVideoComponent;
  return <Stack m={2} spacing={2}>
    {request && <RequestDetailComponent request={request} />}
    <Editor curve={curve} videoId={curve.content.video_id} onChangeCurve={setCurve} />
    <EnqueteAnswerListComponent enquetes={curve.enquete} setAnswers={enquete => setCurve({ ...curve, enquete })} />
    {error && <Alert severity="error">{error}</Alert>}
    <Button variant="contained" onClick={save}
      disabled={saving || !curve.values || curve.values.length < 2 || Boolean(id && curve.locked)}>
      {saving ? '保存中…' : '曲線を保存'}
    </Button>
  </Stack>;
}
