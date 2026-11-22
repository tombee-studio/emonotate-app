import React from 'react';
import { Stack, TextField } from '@mui/material';
import { Section } from '../common/PageLayout';

// The fields to send; an empty one removes the limit. Times are in Japan time.
export function acceptance(request) {
  return {
    starts_at: request.starts_at || null,
    ends_at: request.ends_at || null,
    max_submissions: request.max_submissions ? Number(request.max_submissions) : null,
  };
}

export default function AcceptanceComponent({ request, onChange }) {
  const field = (name, label, type, props = {}) => <TextField key={name} id={name} label={label} type={type}
    value={type === 'datetime-local' ? (request[name] || '').slice(0, 16) : request[name] || ''}
    InputLabelProps={{ shrink: true }} onChange={event => onChange({ ...request, [name]: event.target.value })}
    {...props} />;
  const reversed = request.starts_at && request.ends_at &&
    request.starts_at.slice(0, 16) >= request.ends_at.slice(0, 16);
  return <Section title="受付">
    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
      {field('starts_at', '受付開始（日本時間）', 'datetime-local')}
      {field('ends_at', '受付終了（日本時間）', 'datetime-local', {
        error: Boolean(reversed), helperText: reversed ? '受付開始より後にしてください' : undefined })}
      {field('max_submissions', '1人あたりの提出回数', 'number', {
        inputProps: { min: 1, step: 1 }, helperText: '空欄の項目は制限しません' })}
    </Stack>
  </Section>;
}
