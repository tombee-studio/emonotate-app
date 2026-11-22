import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import CurveEditor from './CurveEditor';
import CurveInput from './CurveInput';
import { initialValues, VERSION } from '../../helper/curve';

let root, values;
const area = { duration: 100, min: -1, max: 1, unit: '秒', characters: false };
// The graph is 640 x 240 in the test, drawn from (44, 16) to (620, 210).
const at = (x, y) => ({ clientX: 44 + 576 * x / 100, clientY: 16 + 194 * (1 - y) / 2 });
const fire = (node, type, position) => act(() => {
  node.dispatchEvent(new MouseEvent(type, { bubbles: true, cancelable: true, button: 0, ...position }));
});
const svg = () => root.querySelector('svg[role="img"]');
const xy = () => values.map(point => [Math.round(point.x), Math.round(point.y * 10) / 10]);

function Form({ kind = 2, ...props }) {
  const [current, setCurrent] = React.useState(props.start || initialValues(kind, 100));
  values = current;
  return <CurveEditor label="幸福度" kind={kind} area={area} values={current} onChange={setCurrent} {...props} />;
}
const open = props => act(() => { ReactDOM.render(<Form {...props} />, root); });

beforeEach(() => { root = document.createElement('div'); document.body.appendChild(root); });
afterEach(() => { ReactDOM.unmountComponentAtNode(root); root.remove(); delete global.fetch; });

test('adds, moves and removes a point', () => {
  open();
  expect(root.textContent).toContain('幸福度');
  fire(svg(), 'pointerdown', at(50, 0.5));
  fire(svg(), 'pointermove', at(60, 0.8));
  fire(svg(), 'pointerup', at(60, 0.8));
  expect(xy()).toEqual([[0, 0], [60, 0.8], [100, 0]]);
  fire(svg(), 'pointermove', at(10, -1));
  expect(xy()[1]).toEqual([60, 0.8]);
  const point = root.querySelectorAll('[data-testid="point"]')[1];
  fire(point, 'pointerdown', at(60, 0.8));
  fire(svg(), 'pointermove', at(20, -0.5));
  fire(svg(), 'pointerup', at(20, -0.5));
  expect(xy()).toEqual([[0, 0], [20, -0.5], [100, 0]]);
  const remove = Array.from(root.querySelectorAll('button')).find(b => b.textContent === '選んだ点を削除');
  fire(remove, 'click');
  expect(xy()).toEqual([[0, 0], [100, 0]]);
  expect(remove.disabled).toBe(true);
});

test('draws a free-hand curve and redraws a part of it', () => {
  open({ kind: 1 });
  fire(svg(), 'pointerdown', at(0, 0));
  fire(svg(), 'pointermove', at(50, 1));
  fire(svg(), 'pointermove', at(100, 0));
  fire(svg(), 'pointerup', at(100, 0));
  expect(xy()).toEqual([[0, 0], [50, 1], [100, 0]]);
  fire(svg(), 'pointerdown', at(40, -1));
  fire(svg(), 'pointermove', at(60, -1));
  fire(svg(), 'pointerup', at(60, -1));
  expect(xy()).toEqual([[0, 0], [40, -1], [60, -1], [100, 0]]);
  expect(Object.keys(values[1])).toEqual(['x', 'y']);
  expect(root.querySelectorAll('[data-testid="point"]')).toHaveLength(0);
});

test('a read only curve does not change', () => {
  open({ readOnly: true });
  fire(svg(), 'pointerdown', at(50, 0.5));
  fire(svg(), 'pointerup', at(50, 0.5));
  expect(xy()).toEqual([[0, 0], [100, 0]]);
  expect(root.querySelector('button')).toBeNull();
});

test('a text curve is saved in characters, also for a short text', async () => {
  global.fetch = jest.fn().mockResolvedValue({ ok: true, text: async () => '短い😀本文' });
  let latest;
  function Page() {
    const [curve, setCurve] = React.useState({ version: VERSION, kind: 2, values: [],
      content: { title: '短編', url: '/api/sources/1/file/', data_type: 'text/plain' },
      value_type: { title: '驚き', axis_type: 2 } });
    latest = curve;
    return <CurveInput curve={curve} onChange={setCurve} />;
  }
  await act(async () => { ReactDOM.render(<Page />, root); });
  expect(root.textContent).toContain('読書位置 0 / 5文字');
  expect(latest.values.map(point => [point.x, point.y])).toEqual([[0, 0], [5, 0]]);
  const middle = { clientX: 44 + 576 * 2.2 / 5, clientY: 16 + 194 / 2 };
  fire(svg(), 'pointerdown', middle);
  fire(svg(), 'pointerup', middle);
  expect(latest.values.map(point => [point.x, point.y])).toEqual([[0, 0], [2, 0.5], [5, 0]]);
});

test('a text curve in percent is still shown', async () => {
  global.fetch = jest.fn().mockResolvedValue({ ok: true, text: async () => '物語の本文' });
  const curve = { id: 1, version: 'arc-1', kind: 2, values: [{ x: 0, y: -1 }, { x: 100, y: 1 }],
    content: { title: '短編', url: '/u', data_type: 'text/plain' }, value_type: { title: '幸福度', axis_type: 2 } };
  const onChange = jest.fn();
  await act(async () => { ReactDOM.render(<CurveInput curve={curve} readOnly onChange={onChange} />, root); });
  expect(onChange).not.toHaveBeenCalled();
  expect(svg().textContent).toContain('100%');
  expect(root.querySelector('[data-testid="curve"]').getAttribute('points')).toBe('44,210 620,16');
});
