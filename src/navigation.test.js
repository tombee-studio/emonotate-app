import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import App from './App';
import { ColorModeProvider } from './colorMode';

// ES module only; Jest cannot read it.
jest.mock('react-markdown', () => () => null);
jest.mock('./pages/InvitingPage', () => { throw new Error('Loading chunk failed'); });

const user = {
  id: 1, username: 'reader', email: 'reader@example.com', is_staff: false,
  groups: ['Researchers'], notifications: { profile: [] },
};
const request = {
  id: 7, room_name: 'room', title: '実験', description: '', owner: { id: 1, username: 'reader' },
  state_processing_to_download: 0,
};
const list = models => ({ models, pagination: { total_pages: 1 } });

let root, me, curves;

const respond = (status, data) => ({ status, ok: status < 400, json: async () => data, text: async () => '' });
const fetchMock = jest.fn(async url => {
  const path = url.split('?')[0];
  if (path === '/api/me/') return me();
  if (path === '/history/curves/') return respond(200, list(curves));
  if (path === '/api/requests/') return respond(200, list([request]));
  if (path === '/api/curves/1/') return new Promise(() => {});
  return respond(200, { ...list([]), participants: [] });
});

const settle = () => act(async () => { await new Promise(resolve => setTimeout(resolve, 50)); });
const open = async path => {
  window.history.replaceState(null, '', path);
  await act(async () => { ReactDOM.render(<ColorModeProvider><App /></ColorModeProvider>, root); });
  await settle();
};
const click = async selector => {
  const event = new MouseEvent('click', { bubbles: true, cancelable: true, button: 0 });
  act(() => { root.querySelector(selector).dispatchEvent(event); });
  // A prevented click is one the browser does not turn into a document load.
  expect(event.defaultPrevented).toBe(true);
  await settle();
};
const travel = async steps => {
  await act(async () => { window.history.go(steps); });
  await settle();
};
const nav = label => Array.from(document.querySelectorAll('nav a')).find(a => a.textContent === label);
const selected = () => Array.from(document.querySelectorAll('nav a[aria-current="page"]')).map(a => a.textContent);
const title = () => (root.querySelector('main h2') || {}).textContent;
const meCalls = () => fetchMock.mock.calls.filter(([url]) => url === '/api/me/').length;

beforeEach(() => {
  root = document.createElement('div');
  document.body.appendChild(root);
  global.fetch = fetchMock;
  fetchMock.mockClear();
  window.scrollTo = jest.fn();
  // The desktop layout, with the menu inside the React root.
  window.matchMedia = () => ({ matches: true, addListener() {}, removeListener() {} });
  me = () => respond(200, user);
  curves = [];
});
afterEach(() => { ReactDOM.unmountComponentAtNode(root); root.remove(); delete global.fetch; });

const menu = path => `nav a[href="${path}"]`;

test('keeps the header and menu while moving between pages', async () => {
  await open('/');
  expect(window.location.pathname).toBe('/app/dashboard/');
  expect(title()).toBe('ホーム');
  const header = root.querySelector('header');
  const home = nav('ホーム');

  for (const [path, label, heading] of [
    ['/app/history/', '履歴', '履歴'], ['/app/profile/', 'プロファイル', 'プロファイル'],
  ]) {
    await click(menu(path));
    expect([window.location.pathname, title(), selected()]).toEqual([path, heading, [label]]);
    expect(root.querySelector('header')).toBe(header);
    expect(nav('ホーム')).toBe(home);
  }

  await travel(-1);
  expect([window.location.pathname, title(), selected()]).toEqual(['/app/history/', '履歴', ['履歴']]);
  await travel(1);
  expect([window.location.pathname, title(), selected()]).toEqual(['/app/profile/', 'プロファイル', ['プロファイル']]);
  expect(root.querySelector('header')).toBe(header);
});

test('shows the requested page when its URL is opened directly', async () => {
  await open('/app/profile');
  expect([title(), selected()]).toEqual(['プロファイル', ['プロファイル']]);
  expect(root.textContent).toContain('reader@example.com');
});

test('keeps the layout while the session check of a navigation is pending', async () => {
  await open('/app/history/');
  me = () => new Promise(() => {});
  await click(menu('/app/profile/'));
  expect(meCalls()).toBe(2);
  expect([title(), selected()]).toEqual(['プロファイル', ['プロファイル']]);
});

test('asks to sign in when the session ended before a navigation', async () => {
  await open('/app/history/');
  me = () => respond(401);
  await click(menu('/app/profile/'));
  expect(root.querySelector('a').getAttribute('href')).toBe('/api/cognito/login/');
});

test('uses the CSRF cookie of the moment of use', async () => {
  await open('/app/profile/');
  document.cookie = 'csrftoken=first';
  expect(window.django.csrf).toBe('first');
  document.cookie = 'csrftoken=second';
  expect(window.django.csrf).toBe('second');
});

test('keeps the dashboard form while typing in the search box', async () => {
  await open('/app/dashboard/');
  const form = root.querySelector('main form');
  const search = root.querySelector('header input');
  act(() => {
    Object.getOwnPropertyDescriptor(Object.getPrototypeOf(search), 'value').set.call(search, 'abc');
    search.dispatchEvent(new Event('input', { bubbles: true }));
  });
  await settle();
  expect(search.value).toBe('abc');
  expect(root.querySelector('main form')).toBe(form);
});

test('opens app curves in place and leaves server pages to the browser', async () => {
  curves = [
    { id: 1, version: 'arc-1', kind: 2, locked: true, content: { title: 'a', is_youtube: true }, value_type: {} },
    { id: 2, version: '0.1.1', kind: 1, locked: true, content: { title: 'b', is_youtube: true }, value_type: {} },
  ];
  await open('/app/history/');
  expect(root.querySelector('main a[href="/free-hand/2"]')).not.toBeNull();
  await click('main a[href="/app/curves/1/"]');
  expect(window.location.pathname).toBe('/app/curves/1/');
});

test('opens a request in place and reloads the list after duplicating one', async () => {
  await open('/app/request_list/');
  const header = root.querySelector('header');
  const listCalls = () => fetchMock.mock.calls.filter(([url, options]) => url.includes('role=owner') && !options).length;
  const before = listCalls();
  fetchMock.mockImplementationOnce(async () => respond(201, {}));
  const entries = window.history.length;
  act(() => {
    root.querySelector('main [aria-label="duplicate"]').dispatchEvent(new MouseEvent('click', { bubbles: true }));
  });
  await settle();
  expect(listCalls()).toBe(before + 1);
  expect(window.history.length).toBe(entries);
  await click('main a[href="/app/requests/"]');
  expect(window.location.pathname).toBe('/app/requests/');
  expect(title()).toBe('リクエスト管理');
  expect(root.querySelector('header')).toBe(header);
});

test('ignores a late response of a page the user has left', async () => {
  curves = [{ id: 1, version: 'arc-1', locked: false, content: { title: 'a' }, value_type: {} }];
  await open('/app/history/');
  let finish;
  fetchMock.mockImplementationOnce(() => new Promise(resolve => { finish = resolve; }));
  act(() => {
    root.querySelector('main button[aria-label="delete"]').dispatchEvent(new MouseEvent('click', { bubbles: true }));
  });
  await click(menu('/app/profile/'));
  await act(async () => { finish(respond(204)); });
  await settle();
  expect(window.location.pathname).toBe('/app/profile/');
});

test('keeps the menu usable when the script of a page cannot be loaded', async () => {
  const log = jest.spyOn(console, 'error').mockImplementation(() => {});
  await open('/app/profile/');
  await click(menu('/app/inviting/'));
  expect(root.querySelector('main').textContent).toContain('画面を表示できませんでした');
  await click(menu('/app/history/'));
  expect(title()).toBe('履歴');
  log.mockRestore();
});
