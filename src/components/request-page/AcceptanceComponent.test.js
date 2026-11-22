import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import AcceptanceComponent, { acceptance } from './AcceptanceComponent';

test('sends empty fields as no limit', () => {
  expect(acceptance({})).toEqual({ starts_at: null, ends_at: null, max_submissions: null });
  expect(acceptance({ starts_at: '2026-12-01T09:00', ends_at: '', max_submissions: '2' }))
    .toEqual({ starts_at: '2026-12-01T09:00', ends_at: null, max_submissions: 2 });
});

test('shows the saved values and a reversed period', () => {
  const root = document.createElement('div');
  const request = { starts_at: '2026-12-01T09:00:00', ends_at: '2026-12-01T08:00:00', max_submissions: 3 };
  const onChange = jest.fn();
  act(() => { ReactDOM.render(<AcceptanceComponent request={request} onChange={onChange} />, root); });
  expect(root.querySelector('#starts_at').value).toBe('2026-12-01T09:00');
  expect(root.querySelector('#max_submissions').value).toBe('3');
  expect(root.textContent).toContain('受付開始より後にしてください');
  ReactDOM.unmountComponentAtNode(root);
});
