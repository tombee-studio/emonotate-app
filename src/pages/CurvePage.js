import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Alert, Button, Skeleton, Stack, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { useAppNavigate } from '../navigation';
import { PageContainer } from '../components/common/PageLayout';
import CurveInput from '../components/curve-page/CurveInput';
import EnqueteAnswerListComponent from '../components/curve-page/EnqueteAnswerListComponent';
import RequestDetailComponent from '../components/curve-page/RequestDetailComponent';
import { VERSION, sectionBorders } from '../helper/curve';

async function json(url, options) {
  const response = await fetch(url, options);
  if (!response.ok) {
    if (response.status === 401) throw new Error('ログインしてください。');
    const data = await response.json().catch(() => ({}));
    throw new Error(data.detail || 'データを読み書きできませんでした。');
  }
  return response.json();
}

export default function CurvePage({ id }) {
  const { search } = useLocation();
  const navigate = useAppNavigate();
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
        content, user: window.django.user.id, version: VERSION,
        kind: (req ? req.is_required_free_hand : params.get('kind') === '1') ? 1 : 2,
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
      navigate('/app/history/');
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  }

  if (!curve) return <PageContainer maxWidth="lg">{error ? <Alert severity="error">{error}</Alert> : <Skeleton variant="rounded" height={360} />}</PageContainer>;
  const closed = request && request.closed_reason;
  const readOnly = Boolean(id && curve.locked);
  // A request decides how its curves are drawn, and a saved curve keeps its kind.
  const canSwitch = !id && !request;
  return <PageContainer maxWidth="lg"><Stack spacing={3}>
    {request && <RequestDetailComponent request={request} />}
    {canSwitch && <ToggleButtonGroup exclusive size="small" value={curve.kind} aria-label="入力方式"
      onChange={(_, kind) => { if (kind) setCurve({ ...curve, kind, values: [] }); }}>
      <ToggleButton value={2}>指定点</ToggleButton>
      <ToggleButton value={1}>フリーハンド</ToggleButton>
    </ToggleButtonGroup>}
    <CurveInput key={curve.kind} curve={curve} readOnly={readOnly} onChange={setCurve}
      borders={sectionBorders(request && request.section)} />
    <EnqueteAnswerListComponent enquetes={curve.enquete} setAnswers={enquete => setCurve({ ...curve, enquete })} />
    {error && <Alert severity="error">{error}</Alert>}
    {closed && <Alert severity="warning">{closed}</Alert>}
    <Button variant="contained" onClick={save}
      disabled={saving || Boolean(closed) || !curve.values || curve.values.length < 2 || readOnly}>
      {saving ? '保存中…' : '曲線を保存'}
    </Button>
  </Stack></PageContainer>;
}
