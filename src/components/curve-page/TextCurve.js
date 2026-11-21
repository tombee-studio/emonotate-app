import React, { useEffect, useRef, useState } from 'react';
import { Alert, Box, Typography } from '@mui/material';
import InputField from './InputField';

export default function TextCurve({ curve, onChangeCurve }) {
  const [body, setBody] = useState(null);
  const [position, setPosition] = useState(0);
  const [error, setError] = useState('');
  const current = useRef(0);
  const textArea = useRef(null);
  const getCurve = useRef(curve);
  getCurve.current = curve;

  useEffect(() => {
    let active = true;
    fetch(curve.content.url).then(async response => {
      if (!response.ok) throw new Error('本文を読み込めませんでした。');
      const text = await response.text();
      if (!active) return;
      const draft = getCurve.current;
      if (!draft.values || !draft.values.length) {
        onChangeCurve({ ...draft, values: [0, 100].map(x => ({ x, y: 0, axis: 'v', type: 'fixed' })) });
      }
      setBody(text);
    }).catch(err => { if (active) setError(err.message); });
    return () => { active = false; };
  }, [curve.content.url]);

  function seek(percent) {
    const area = textArea.current;
    area.scrollTop = (area.scrollHeight - area.clientHeight) * percent / 100;
    current.current = percent;
    setPosition(percent);
  }
  if (error) return <Alert severity="error">{error}</Alert>;
  if (body === null) return <p>本文を読み込み中…</p>;
  return <Box>
    <Typography variant="h6">{curve.content.title}</Typography>
    <Box ref={textArea} tabIndex={0} sx={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere',
      maxHeight: '40vh', overflowY: 'auto', lineHeight: 1.8, my: 2 }} onScroll={e => {
        const area = e.currentTarget;
        if (area.scrollHeight > area.clientHeight) {
          current.current = 100 * area.scrollTop / (area.scrollHeight - area.clientHeight);
          setPosition(current.current);
        }
      }}>{body}</Box>
    <label>読書位置 {Math.round(position)}%
      <input type="range" min="0" max="100" value={position} onChange={e => seek(Number(e.target.value))} />
    </label>
    <Typography>横軸は本文の進み具合（0〜100%）、縦軸は感情の強さです。</Typography>
    <InputField duration={100} data={curve.values} getCurrent={() => current.current}
      setCurrent={seek} changeValuesInCurve={values => onChangeCurve({ ...getCurve.current, values })} />
  </Box>;
}
