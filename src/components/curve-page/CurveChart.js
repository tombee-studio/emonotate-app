import React from 'react';
import { useTheme } from '@mui/material';

const WIDTH = 760;
const HEIGHT = 240;
const LEFT = 40;
const RIGHT = 20;
const TOP = 16;
const BOTTOM = 32;

// Read-only drawing of a saved curve.
export default function CurveChart({ values, unit }) {
  const { palette } = useTheme();
  const last = values[values.length - 1].x || 1;
  // Upward-only curves and the old screens use 0 to 1, the others -1 to 1.
  const bottom = values.some(point => point.y < 0) ? -1 : 0;
  const px = x => LEFT + (WIDTH - LEFT - RIGHT) * x / last;
  const py = y => TOP + (HEIGHT - TOP - BOTTOM) * (1 - y) / (1 - bottom);
  const tick = { fill: palette.text.secondary, fontSize: 12 };
  return <svg width="100%" viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img" aria-label="感情曲線">
    {(bottom ? [1, 0, -1] : [1, 0.5, 0]).map(y => <g key={y}>
      <line x1={LEFT} x2={WIDTH - RIGHT} y1={py(y)} y2={py(y)} stroke={palette.divider} />
      <text x={LEFT - 8} y={py(y) + 4} textAnchor="end" style={tick}>{y}</text>
    </g>)}
    {[0, 0.25, 0.5, 0.75, 1].map(rate => <text key={rate} x={px(last * rate)} y={HEIGHT - 10}
      textAnchor="middle" style={tick}>{Math.round(last * rate * 10) / 10}{unit}</text>)}
    <polyline points={values.map(point => `${px(point.x)},${py(point.y)}`).join(' ')}
      fill="none" stroke={palette.primary.main} strokeWidth="2" strokeLinejoin="round" />
  </svg>;
}
