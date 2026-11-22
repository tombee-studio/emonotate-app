import {
  addPoint, applyStroke, axes, extendStroke, formatX, initialValues, movePoint, place, removePoint, sectionBorders,
  startValues, VERSION,
} from './curve';
import { characterAt, characterAtHeight, indexText } from './textPosition';

const video = { data_type: 'video/mp4' };
const text = { data_type: 'text/plain' };
const area = { duration: 60, min: -1, max: 1, characters: false };
const xy = values => values.map(point => [point.x, point.y]);

test('the axes follow the axis type only for new curves', () => {
  const range = (version, axis_type, content = video, values = []) => {
    const { min, max, unit } = axes({ version, value_type: { axis_type }, content, values });
    return [min, max, unit];
  };
  expect(range(VERSION, 1)).toEqual([-1, 1, '秒']);
  expect(range(VERSION, 2)).toEqual([0, 1, '秒']);
  expect(range(VERSION, 2, text)).toEqual([0, 1, '文字']);
  expect(range('arc-1', 2)).toEqual([-1, 1, '秒']);
  expect(range('arc-1', 1, text)).toEqual([-1, 1, '%']);
  expect(range('1.0.0', 1)).toEqual([0, 1, '秒']);
  expect(range('1.0.0', 1, video, [{ x: 0, y: -0.003 }])).toEqual([-1, 1, '秒']);
});

test('a prepared curve is used only when it fits the source', () => {
  const template = [{ x: 0, y: -0.5 }, { x: 30, y: 1 }, { x: 59.6, y: 0 }];
  expect(xy(startValues(template, 2, area))).toEqual([[0, -0.5], [30, 1], [60, 0]]);
  expect(xy(startValues(template, 2, { ...area, min: 0 }))).toEqual([[0, 0], [30, 1], [60, 0]]);
  expect(xy(startValues(template, 2, { ...area, duration: 90 }))).toEqual([[0, 0], [90, 0]]);
  expect(xy(startValues([{ x: 0, y: 1 }, { x: 100, y: 1 }], 2, { ...area, duration: 99, characters: true })))
    .toEqual([[0, 0], [99, 0]]);
  expect(startValues([], 1, area)).toEqual([{ x: 0, y: 0 }, { x: 60, y: 0 }]);
});

test('places positions inside the area', () => {
  expect(place(70.123, 2, area)).toEqual({ x: 60, y: 1 });
  expect(place(12.3456, -0.12345, area)).toEqual({ x: 12.35, y: -0.123 });
  expect(place(12.5, 0, { ...area, characters: true }).x).toBe(13);
});

test('points are added, moved and removed between the ends', () => {
  let values = initialValues(2, 60);
  const first = addPoint(values, 30, 0.5, area);
  const second = addPoint(first.values, 10, -0.5, area);
  expect([first.index, second.index]).toEqual([1, 1]);
  expect(xy(second.values)).toEqual([[0, 0], [10, -0.5], [30, 0.5], [60, 0]]);
  const passed = movePoint(second.values, 1, 40, 1, area);
  expect(passed.index).toBe(2);
  expect(xy(passed.values)).toEqual([[0, 0], [30, 0.5], [40, 1], [60, 0]]);
  expect(xy(movePoint(passed.values, 0, 20, 1, area).values)[0]).toEqual([0, 1]);
  const edge = movePoint(passed.values, 1, 999, 0, area);
  expect(xy(edge.values)).toEqual([[0, 0], [40, 1], [60, 0], [60, 0]]);
  expect(edge.index).toBe(2);
  expect(xy(removePoint(passed.values, 1))).toEqual([[0, 0], [40, 1], [60, 0]]);
  expect(removePoint(passed.values, 3)).toBe(passed.values);
  values = addPoint(addPoint(initialValues(2, 60), 0, 1, area).values, 60, 1, area).values;
  expect(xy(values)).toEqual([[0, 0], [0, 1], [60, 1], [60, 0]]);
});

test('a stroke replaces the part it was drawn over', () => {
  const draw = points => points.reduce((stroke, [x, y]) => extendStroke(stroke, { x, y }), { points: [] });
  const stroke = draw([[10, 0.1], [20, 0.2], [30, 0.3]]);
  expect(xy(applyStroke([{ x: 0, y: 0 }, { x: 15, y: 1 }, { x: 60, y: 0 }], stroke, 60)))
    .toEqual([[0, 0], [10, 0.1], [20, 0.2], [30, 0.3], [60, 0]]);
  // From right to left, and going back over a part.
  expect(xy(draw([[30, 0.3], [20, 0.2], [10, 0.1]]).points)).toEqual([[10, 0.1], [20, 0.2], [30, 0.3]]);
  expect(xy(draw([[10, 0.1], [20, 0.2], [30, 0.3], [15, 1]]).points)).toEqual([[10, 0.1], [15, 1], [30, 0.3]]);
  // Over everything.
  expect(xy(applyStroke(initialValues(1, 60), draw([[0, 1], [60, 1]]), 60))).toEqual([[0, 1], [60, 1]]);
  expect(xy(applyStroke([{ x: 20, y: 0 }], draw([[5, 1]]), 60))).toEqual([[0, 1], [5, 1], [20, 0], [60, 0]]);
});

test('reads the borders of the sections and formats the axis', () => {
  expect(sectionBorders({ values: [{ end: '00:00:10.500' }, { end: '01:01:00.000' }, { end: '02:00:00.000' }] }))
    .toEqual([10.5, 3660]);
  expect(sectionBorders(null)).toEqual([]);
  expect([formatX(12.34, '秒'), formatX(125, '秒'), formatX(50, '%'), formatX(7, '文字')])
    .toEqual(['12.3秒', '2:05', '50%', '7文字']);
});

test('counts characters, not UTF-16 units', () => {
  const index = indexText('a😀b');
  expect(index.length).toBe(3);
  expect([0, 1, 2, 3, 4].map(offset => characterAt(index, offset))).toEqual([0, 1, 1, 2, 3]);
  expect(characterAtHeight(5, 25, i => 10 * (i + 1))).toBe(2);
  expect(characterAtHeight(5, 999, i => 10 * (i + 1))).toBe(5);
});
