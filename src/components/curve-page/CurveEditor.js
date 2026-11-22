import React, { useEffect, useRef, useState } from 'react';
import { Box, Button, Stack, Typography, useTheme } from '@mui/material';
import {
  addPoint, applyStroke, extendStroke, formatX, isEnd, movePoint, place, removePoint, ticks,
} from '../../helper/curve';

const LEFT = 44;
const RIGHT = 20;
const TOP = 16;
const BOTTOM = 30;
// A finger needs a larger target than the drawn point.
const RADIUS = 9;
const TOUCH_RADIUS = 22;

function useWidth() {
  const node = useRef(null);
  const [width, setWidth] = useState(640);
  useEffect(() => {
    const measure = () => {
      const measured = node.current && node.current.clientWidth;
      if (measured) setWidth(Math.max(280, measured));
    };
    measure();
    if (typeof window.ResizeObserver === 'function') {
      const observer = new window.ResizeObserver(measure);
      observer.observe(node.current);
      return () => observer.disconnect();
    }
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);
  return [node, width];
}

function Playhead({ getCurrent, px, top, bottom, color }) {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setCurrent(getCurrent() || 0), 200);
    return () => clearInterval(timer);
  }, [getCurrent]);
  return <line x1={px(current)} x2={px(current)} y1={top} y2={bottom} stroke={color} strokeWidth="3"
    opacity="0.8" pointerEvents="none" data-testid="playhead" />;
}

// Draws a curve and, unless it is read only, edits it with mouse, pen or finger.
// area: { duration, min, max, unit, characters }
export default function CurveEditor({ values, kind, area, label, borders = [], readOnly, onChange, getCurrent, setCurrent }) {
  const { palette } = useTheme();
  const [node, width] = useWidth();
  const svg = useRef(null);
  const [selected, setSelected] = useState(null);
  const [stroke, setStroke] = useState(null);
  const drag = useRef(null);
  // Several moves can arrive before the next render.
  const latest = useRef(values);
  latest.current = values;

  const height = Math.round(Math.min(360, Math.max(240, width * 0.36)));
  const right = width - RIGHT;
  const floor = height - BOTTOM;
  const px = x => LEFT + (right - LEFT) * x / area.duration;
  const py = y => TOP + (floor - TOP) * (area.max - y) / (area.max - area.min);
  const position = event => {
    const rect = svg.current.getBoundingClientRect();
    const scale = rect.width ? width / rect.width : 1;
    return {
      x: ((event.clientX - rect.left) * scale - LEFT) * area.duration / (right - LEFT),
      y: area.max - ((event.clientY - rect.top) * scale - TOP) * (area.max - area.min) / (floor - TOP),
    };
  };
  const change = next => {
    latest.current = next;
    onChange(next);
  };

  const capture = event => {
    event.preventDefault();
    if (svg.current.setPointerCapture && event.pointerId !== undefined) {
      try { svg.current.setPointerCapture(event.pointerId); } catch (err) { /* the pointer is already gone */ }
    }
  };
  const startPoint = (event, index) => {
    if (readOnly || kind === 1 || drag.current || event.button) return;
    event.stopPropagation();
    capture(event);
    drag.current = { pointer: event.pointerId, index };
    setSelected(index);
    if (setCurrent) setCurrent(latest.current[index].x);
  };
  const start = event => {
    if (readOnly || drag.current || event.button) return;
    capture(event);
    const { x, y } = position(event);
    if (kind === 1) {
      const first = extendStroke({ points: [] }, place(x, y, area));
      drag.current = { pointer: event.pointerId, stroke: first };
      setStroke(first);
      return;
    }
    const added = addPoint(latest.current, x, y, area);
    drag.current = { pointer: event.pointerId, index: added.index };
    setSelected(added.index);
    change(added.values);
  };
  const move = event => {
    if (!drag.current || drag.current.pointer !== event.pointerId) return;
    const { x, y } = position(event);
    if (drag.current.stroke) {
      drag.current.stroke = extendStroke(drag.current.stroke, place(x, y, area));
      setStroke(drag.current.stroke);
      return;
    }
    const moved = movePoint(latest.current, drag.current.index, x, y, area);
    drag.current.index = moved.index;
    setSelected(moved.index);
    change(moved.values);
  };
  const finish = event => {
    if (!drag.current || drag.current.pointer !== event.pointerId) return;
    if (drag.current.stroke) {
      change(applyStroke(latest.current, drag.current.stroke, area.duration));
      setStroke(null);
    }
    drag.current = null;
  };
  const remove = index => {
    setSelected(null);
    change(removePoint(latest.current, index));
  };

  const line = points => points.map(point => `${px(point.x)},${py(point.y)}`).join(' ');
  const tick = { fill: palette.text.secondary, fontSize: 12, userSelect: 'none' };
  const steps = Math.min(width < 480 ? 2 : 4, area.characters ? area.duration : 4);
  const canRemove = selected !== null && selected < values.length && !isEnd(values, selected);
  return <Box>
    {label && <Typography variant="subtitle1" component="p">{label}</Typography>}
    <Box ref={node} sx={{ width: '100%' }}>
      <svg ref={svg} width="100%" height={height} viewBox={`0 0 ${width} ${height}`} role="img"
        aria-label={label ? `感情曲線: ${label}` : '感情曲線'}
        style={{ display: 'block', touchAction: readOnly ? 'auto' : 'none', background: palette.background.paper,
          cursor: readOnly ? 'default' : 'crosshair' }}
        onPointerDown={start} onPointerMove={move} onPointerUp={finish} onPointerCancel={finish}>
        {ticks(area.min, area.max, area.min < 0 ? 4 : 2).map(y => <g key={y}>
          <line x1={LEFT} x2={right} y1={py(y)} y2={py(y)}
            stroke={y === 0 ? palette.text.disabled : palette.divider} />
          <text x={LEFT - 8} y={py(y) + 4} textAnchor="end" style={tick}>{y}</text>
        </g>)}
        {ticks(0, area.duration, steps).map(x => area.characters ? Math.round(x) : x).map((x, i) => <text
          key={i} x={px(x)} y={height - 10} style={tick}
          textAnchor={i === steps ? 'end' : 'middle'}>{formatX(x, area.unit)}</text>)}
        {borders.map(x => <line key={x} x1={px(x)} x2={px(x)} y1={TOP} y2={floor} data-testid="border"
          stroke={palette.text.disabled} strokeWidth="2" strokeDasharray="2 4" />)}
        <polyline points={line(values)} fill="none" stroke={palette.primary.main} strokeWidth="2"
          strokeLinejoin="round" pointerEvents="none" data-testid="curve" />
        {stroke && <polyline points={line(stroke.points)} fill="none" stroke={palette.secondary.main}
          strokeWidth="3" strokeLinejoin="round" pointerEvents="none" />}
        {getCurrent && <Playhead getCurrent={getCurrent} px={x => px(Math.min(x, area.duration))} top={TOP}
          bottom={floor} color={palette.info.main} />}
        {kind !== 1 && values.map((point, i) => <g key={i} data-testid="point"
          onPointerDown={event => startPoint(event, i)} onDoubleClick={() => !readOnly && remove(i)}>
          {!readOnly && <circle cx={px(point.x)} cy={py(point.y)} r={TOUCH_RADIUS} fill="transparent"
            style={{ cursor: isEnd(values, i) ? 'ns-resize' : 'move' }} />}
          <circle cx={px(point.x)} cy={py(point.y)} r={readOnly ? 4 : RADIUS} strokeWidth="2"
            fill={selected === i ? palette.primary.main : palette.background.paper}
            stroke={palette.primary.main} pointerEvents="none" />
        </g>)}
      </svg>
    </Box>
    {!readOnly && <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 1 }}>
      <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1 }}>
        {kind === 1 ? 'グラフの上をなぞって曲線を描きます。描き直した部分が置き換わります。' :
          'グラフを押すと点を追加し、点を動かして調整します。'}
      </Typography>
      {kind !== 1 && <Button size="small" variant="outlined" disabled={!canRemove}
        onClick={() => remove(selected)}>選んだ点を削除</Button>}
    </Stack>}
  </Box>;
}
