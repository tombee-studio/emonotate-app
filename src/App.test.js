import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import App from './App';
import TextCurve from './components/curve-page/TextCurve';
import { youtubeId } from './components/content-list-page/AddContent';

let root;
beforeEach(() => { root = document.createElement('div'); document.body.appendChild(root); });
afterEach(() => { ReactDOM.unmountComponentAtNode(root); root.remove(); delete global.fetch; });

test('sends signed-out users to Cognito', async () => {
  global.fetch = jest.fn().mockResolvedValue({ status: 401 });
  await act(async () => { ReactDOM.render(<App />, root); });
  expect(root.querySelector('a').getAttribute('href')).toBe('/api/cognito/login/');
});

test('accepts YouTube watch, short and share links', () => {
  const id = 'abcdefghijk';
  expect(youtubeId('https://www.youtube.com/watch?v=' + id)).toBe(id);
  expect(youtubeId('https://youtu.be/' + id + '?t=10')).toBe(id);
  expect(youtubeId('https://m.youtube.com/shorts/' + id)).toBe(id);
  expect(youtubeId('https://example.org/watch?v=' + id)).toBeNull();
});

test('adds an emotion point while reading text', async () => {
  global.fetch = jest.fn().mockResolvedValue({ ok: true, text: async () => '物語の本文' });
  let latest;
  function Editor() {
    const [curve, setCurve] = React.useState({ content: { title: '短編', url: '/api/sources/1/file/' }, values: [] });
    latest = curve;
    return <TextCurve curve={curve} onChangeCurve={setCurve} />;
  }
  await act(async () => { ReactDOM.render(<Editor />, root); });
  expect(root.textContent).toContain('物語の本文');
  expect(latest.values.map(point => point.x)).toEqual([0, 100]);
  act(() => {
    root.querySelector('svg rect').dispatchEvent(new MouseEvent('click', { bubbles: true, clientX: 390, clientY: 49 }));
  });
  expect(latest.values.map(point => [point.x, point.y])).toEqual([[0, 0], [50, 0.5], [100, 0]]);
});
