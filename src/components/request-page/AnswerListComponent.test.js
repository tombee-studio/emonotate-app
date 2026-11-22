import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import AnswerListComponent from './AnswerListComponent';

const row = id => ({ id, created: '2026-11-22T12:00:00', kind: id % 2 + 1,
  user: id === 1 ? { id, username: 'first', email: 'first@example.com' } : { id, username: 'user' + id } });
const curve = {
  id: 1, content: { title: '動画' }, value_type: { title: '幸福度' },
  values: [{ x: 0, y: 0 }, { x: 30, y: 1 }, { x: 60, y: -1 }],
  enquete: [{ id: 5, title: '感想', answer: 'よかった' }],
};
const respond = (status, data) => ({ ok: status < 400, status, json: async () => data });
let root, reply;

const settle = () => act(async () => { await new Promise(resolve => setTimeout(resolve, 20)); });
const open = async () => {
  await act(async () => { ReactDOM.render(<AnswerListComponent requestId={7} />, root); });
  await settle();
};
const click = async node => {
  act(() => { node.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, button: 0 })); });
  await settle();
};

beforeEach(() => {
  root = document.createElement('div');
  document.body.appendChild(root);
  reply = url => url.startsWith('/api/curves/') ? respond(200, curve) :
    respond(200, { models: [row(1), row(2)], pagination: { total_entries: 42, total_pages: 3 } });
  global.fetch = jest.fn(async url => reply(url));
});
afterEach(() => {
  ReactDOM.unmountComponentAtNode(root);
  root.remove();
});

test('lists the answers page by page', async () => {
  await open();
  expect(root.textContent).toContain('回答（42件）');
  expect(root.textContent).toContain('first@example.com');
  expect(root.textContent).toContain('user2');
  await click(root.querySelector('[aria-label="Go to page 2"]'));
  expect(fetch.mock.calls.map(([url]) => url)).toEqual([
    '/api/requests/7/curves/?format=json&page_size=20&page=1',
    '/api/requests/7/curves/?format=json&page_size=20&page=2',
  ]);
});

test('shows the curve and the answers of one person', async () => {
  await open();
  await click(root.querySelector('[role="button"]'));
  expect(fetch).toHaveBeenLastCalledWith('/api/curves/1/?format=json');
  const dialog = document.querySelector('[role="dialog"]');
  expect(dialog.querySelector('polyline').getAttribute('points').split(' ')).toHaveLength(3);
  expect(dialog.textContent).toContain('感想');
  expect(dialog.textContent).toContain('よかった');
});

test('tells when there is no answer and when loading fails', async () => {
  reply = () => respond(200, { models: [], pagination: { total_entries: 0, total_pages: 1 } });
  await open();
  expect(root.textContent).toContain('回答はまだありません');
  ReactDOM.unmountComponentAtNode(root);
  reply = () => respond(500, {});
  await open();
  expect(root.textContent).toContain('回答を読み込めませんでした。');
});
