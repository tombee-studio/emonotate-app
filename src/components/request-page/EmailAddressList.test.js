import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import EmailAddressList from './EmailAddressList';

const row = id => ({ id, username: 'user' + id, email: `p${id}@example.com`, sended_mail: id === 1, sended_mail_message: '' });
const respond = (status, data) => ({ ok: status < 400, status, json: async () => data });
let root, reply;

const settle = (time = 20) => act(async () => { await new Promise(resolve => setTimeout(resolve, time)); });
const open = async () => {
  await act(async () => { ReactDOM.render(<EmailAddressList request={{ id: 7 }} />, root); });
  await settle();
};
const click = async node => {
  act(() => { node.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, button: 0 })); });
  await settle();
};
const type = (node, value) => act(() => {
  const proto = node.tagName === 'TEXTAREA' ? window.HTMLTextAreaElement : window.HTMLInputElement;
  Object.getOwnPropertyDescriptor(proto.prototype, 'value').set.call(node, value);
  node.dispatchEvent(new Event('input', { bubbles: true }));
});
const button = (text, scope = root) => Array.from(scope.querySelectorAll('button')).find(b => b.textContent === text);
const sent = method => fetch.mock.calls.filter(([, options]) => options && options.method === method)
  .map(([, options]) => JSON.parse(options.body));

beforeEach(() => {
  root = document.createElement('div');
  document.body.appendChild(root);
  window.django = { csrf: 'token' };
  reply = () => respond(200, { models: [row(1), row(2)], pagination: { total_entries: 500, total_pages: 10 } });
  global.fetch = jest.fn(async (url, options) => reply(url, options));
});
afterEach(() => {
  ReactDOM.unmountComponentAtNode(root);
  root.remove();
});

test('pages through and searches the participants', async () => {
  await open();
  expect(root.textContent).toContain('参加者（500人）');
  expect(root.textContent).toContain('p1@example.com');
  await click(root.querySelector('[aria-label="Go to page 2"]'));
  type(root.querySelector('input[type="text"]'), 'a b');
  await settle(400);
  expect(fetch.mock.calls.map(([url]) => url)).toEqual([
    '/api/participants/7?page=1&page_size=50&search=',
    '/api/participants/7?page=2&page_size=50&search=',
    '/api/participants/7?page=1&page_size=50&search=a+b',
  ]);
});

test('adds many addresses in parts', async () => {
  await open();
  await click(button('追加'));
  const dialog = document.querySelector('[role="dialog"]');
  const emails = Array.from({ length: 600 }, (_, i) => `n${i}@example.com`);
  type(dialog.querySelector('textarea'), emails.join('\n') + '\n' + emails[0]);
  const list = reply;
  reply = (url, options) => options ? respond(201, { added: JSON.parse(options.body).emails.length }) : list();
  await click(button('600件を追加', dialog));
  expect(sent('POST').map(body => body.emails.length)).toEqual([500, 100]);
  expect(root.textContent).toContain('600人を追加しました。');
});

test('shows the addresses that are not valid', async () => {
  await open();
  await click(button('追加'));
  const dialog = document.querySelector('[role="dialog"]');
  type(dialog.querySelector('textarea'), 'broken');
  reply = () => respond(400, { detail: 'メールアドレスを確認してください。', invalid: ['broken'] });
  await click(button('1件を追加', dialog));
  expect(dialog.textContent).toContain('メールアドレスを確認してください。 broken');
});

test('removes the selected participants', async () => {
  await open();
  await click(root.querySelector('[aria-label="p2@example.comを選択"]'));
  await click(button('1人を外す'));
  expect(sent('DELETE')).toEqual([{ ids: [2] }]);
});
