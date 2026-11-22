import React, { useEffect, useRef, useState } from 'react';
import { Alert, Box, Typography } from '@mui/material';
import { characterAt, characterAtHeight, indexText } from '../../helper/textPosition';

// Shows a text with a mark at the current character. onReady gets the length and
// functions to read and set the position in characters.
export default function TextSource({ content, onReady }) {
  const [body, setBody] = useState(null);
  const [error, setError] = useState('');
  const [position, setPosition] = useState(0);
  const [mark, setMark] = useState(null);
  const area = useRef(null);
  const text = useRef(null);
  const index = useRef(null);
  const current = useRef(0);
  // Scrolling done by the page itself must not change the position.
  const ignoreScroll = useRef(0);
  const ready = useRef(onReady);
  ready.current = onReady;

  useEffect(() => {
    let active = true;
    fetch(content.url).then(async response => {
      if (!response.ok) throw new Error('本文を読み込めませんでした。');
      const loaded = await response.text();
      if (!active) return;
      index.current = indexText(loaded);
      setBody(loaded);
    }).catch(err => { if (active) setError(err.message); });
    return () => { active = false; };
  }, [content.url]);

  // Where a character is drawn, relative to the top of the text.
  function rectOf(character) {
    const { units, length } = index.current;
    const node = text.current.firstChild;
    const range = document.createRange && document.createRange();
    if (!node || !range || !range.getClientRects) return null;
    for (let i = Math.min(character, length - 1); i >= 0; i -= 1) {
      range.setStart(node, units[i]);
      range.setEnd(node, units[i + 1]);
      const rects = range.getClientRects();
      if (rects.length) {
        const origin = text.current.getBoundingClientRect();
        // After the last character, the mark is at its right side.
        const left = character >= length ? rects[rects.length - 1].right : rects[0].left;
        return { top: rects[0].top - origin.top, left: left - origin.left, height: rects[0].height };
      }
    }
    return null;
  }

  function show(character) {
    current.current = character;
    setPosition(character);
    setMark(rectOf(character));
  }

  function seek(character) {
    const node = area.current;
    const target = Math.round(Math.min(index.current.length, Math.max(0, character)));
    const rect = rectOf(target);
    if (rect && node.scrollHeight > node.clientHeight) {
      ignoreScroll.current = Date.now() + 200;
      node.scrollTop = (rect.top + rect.height / 2) * (node.scrollHeight - node.clientHeight) / node.scrollHeight;
    }
    show(target);
  }

  useEffect(() => {
    if (body === null) return undefined;
    show(0);
    ready.current({ duration: Math.max(1, index.current.length), getCurrent: () => current.current, setCurrent: seek });
    const resized = () => setMark(rectOf(current.current));
    window.addEventListener('resize', resized);
    return () => window.removeEventListener('resize', resized);
  }, [body]);

  // The reading line goes from the top to the bottom of the box as the text is
  // scrolled, so that the first and the last character can be reached.
  function scrolled() {
    if (Date.now() < ignoreScroll.current) return;
    const node = area.current;
    const room = node.scrollHeight - node.clientHeight;
    if (room <= 0) return;
    const y = node.scrollTop + node.clientHeight * node.scrollTop / room;
    if (node.scrollTop >= room - 1) show(index.current.length);
    else {
      show(characterAtHeight(index.current.length, y, character => {
        const rect = rectOf(character);
        return rect ? rect.top + rect.height : Infinity;
      }));
    }
  }

  function clicked(event) {
    let node;
    let offset;
    if (document.caretPositionFromPoint) {
      const caret = document.caretPositionFromPoint(event.clientX, event.clientY);
      if (caret) { node = caret.offsetNode; offset = caret.offset; }
    } else if (document.caretRangeFromPoint) {
      const range = document.caretRangeFromPoint(event.clientX, event.clientY);
      if (range) { node = range.startContainer; offset = range.startOffset; }
    }
    if (node && node === text.current.firstChild) show(characterAt(index.current, offset));
  }

  if (error) return <Alert severity="error">{error}</Alert>;
  if (body === null) return <p>本文を読み込み中…</p>;
  return <Box>
    <Typography variant="h6">{content.title}</Typography>
    <Box ref={area} tabIndex={0} onScroll={scrolled} onClick={clicked}
      sx={{ maxHeight: '40vh', overflowY: 'auto', my: 2, cursor: 'text' }}>
      <Box sx={{ position: 'relative' }}>
        <Box ref={text} sx={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere', lineHeight: 1.8 }}>{body}</Box>
        {mark && <Box data-testid="mark" sx={{ position: 'absolute', width: 3, borderRadius: 1, bgcolor: 'info.main',
          pointerEvents: 'none' }} style={{ top: mark.top, left: mark.left, height: mark.height }} />}
      </Box>
    </Box>
    <label style={{ display: 'block' }}>読書位置 {position} / {index.current.length}文字
      <input type="range" min="0" max={index.current.length} step="1" value={position}
        style={{ display: 'block', width: '100%' }} onChange={event => seek(Number(event.target.value))} />
    </label>
    <Typography variant="body2" color="text.secondary">
      本文を押すか、スクロールするか、つまみを動かすと位置が変わります。
    </Typography>
  </Box>;
}
