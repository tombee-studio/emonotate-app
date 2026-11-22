// Pure functions on curves. A curve is drawn and edited in the units it is saved
// in, so the size of the screen never changes the points.

export const VERSION = 'arc-2';

export const isText = content => content.data_type === 'text/plain';

// The axes of a curve. arc-2 follows the axis type and counts the characters of a
// text; arc-1 was always -1 to 1 and in percent, the old screens 0 to 1.
export function axes(curve) {
  const upward = curve.value_type && curve.value_type.axis_type === 2;
  const text = isText(curve.content);
  if (curve.version === VERSION) {
    return { min: upward ? 0 : -1, max: 1, unit: text ? '文字' : '秒', characters: text };
  }
  if (curve.version === 'arc-1') return { min: -1, max: 1, unit: text ? '%' : '秒', characters: false };
  const below = (curve.values || []).some(point => point.y < 0);
  return { min: below ? -1 : 0, max: 1, unit: text ? '%' : '秒', characters: false };
}

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const round = (value, digits) => Math.round(value * 10 ** digits) / 10 ** digits;

export function place(x, y, { duration, min, max, characters }) {
  const px = characters ? Math.round(x) : round(x, 2);
  return { x: clamp(px, 0, duration), y: clamp(round(y, 3), min, max) };
}

export function initialValues(kind, duration) {
  return [0, duration].map((x, i) => kind === 1 ? { x, y: 0 } :
    { x, y: 0, axis: 'v', type: 'fixed', state: i ? 'end' : 'start' });
}

// Points the author of a request prepared, or the initial ones if they do not fit.
export function startValues(template, kind, area) {
  if (!template || template.length < 2) return initialValues(kind, area.duration);
  const last = template[template.length - 1].x;
  if (template[0].x !== 0 || Math.abs(last - area.duration) > (area.characters ? 0 : 1)) {
    return initialValues(kind, area.duration);
  }
  return template.map((point, i) => ({
    ...point, x: i === template.length - 1 ? area.duration : clamp(point.x, 0, area.duration),
    y: clamp(point.y, area.min, area.max),
  }));
}

const byX = (a, b) => a.x - b.x;
export const isEnd = (values, index) => index === 0 || index === values.length - 1;

export function addPoint(values, x, y, area) {
  const point = { ...place(x, y, area), axis: 'hv', type: 'custom', state: 'middle' };
  // Between the ends, also when it has the same x as one of them.
  let index = values.findIndex(other => other.x > point.x);
  if (index === -1) index = values.length - 1;
  index = clamp(index, 1, values.length - 1);
  return { values: [...values.slice(0, index), point, ...values.slice(index)], index };
}

// The ends move up and down only. The others may pass each other but not the ends.
export function movePoint(values, index, x, y, area) {
  const point = values[index];
  const placed = place(x, y, area);
  if (isEnd(values, index)) {
    return { values: values.map((other, i) => i === index ? { ...point, y: placed.y } : other), index };
  }
  const moved = { ...point, ...placed };
  const middle = values.slice(1, -1).map((other, i) => i + 1 === index ? moved : other)
    .map((other, i) => ({ other, i })).sort((a, b) => byX(a.other, b.other) || a.i - b.i).map(({ other }) => other);
  return { values: [values[0], ...middle, values[values.length - 1]], index: middle.indexOf(moved) + 1 };
}

export function removePoint(values, index) {
  return isEnd(values, index) ? values : values.filter((_, i) => i !== index);
}

// One more position of a stroke. Going back replaces what was drawn there before.
export function extendStroke(stroke, point) {
  if (!stroke.points.length) return { points: [point], last: point };
  const low = Math.min(stroke.last.x, point.x);
  const high = Math.max(stroke.last.x, point.x);
  const kept = stroke.points.filter(other => other.x < low || other.x > high);
  const pair = stroke.last.x === point.x ? [point] : [stroke.last, point];
  return { points: [...kept, ...pair].sort(byX), last: point };
}

// The curve with the part under the stroke replaced. It always spans the source.
export function applyStroke(values, stroke, duration) {
  if (!stroke.points.length) return values;
  const points = stroke.points;
  const low = points[0].x;
  const high = points[points.length - 1].x;
  const merged = [...values.filter(point => point.x < low), ...points, ...values.filter(point => point.x > high)];
  const first = merged[0];
  const last = merged[merged.length - 1];
  if (first.x > 0) merged.unshift({ x: 0, y: first.y });
  if (last.x < duration) merged.push({ x: duration, y: last.y });
  return merged;
}

const seconds = time => time.split(':').reduce((total, part) => total * 60 + Number(part), 0);

// Where one part of the source ends and the next begins.
export function sectionBorders(section) {
  return section && section.values ? section.values.slice(0, -1).map(item => seconds(item.end)) : [];
}

export function ticks(min, max, count) {
  return Array.from({ length: count + 1 }, (_, i) => min + (max - min) * i / count);
}

export function formatX(x, unit) {
  if (unit !== '秒') return `${Math.round(x)}${unit}`;
  if (x < 60) return `${round(x, 1)}秒`;
  const total = Math.round(x);
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`;
}
