import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import App from './App';
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
