async function call(requestId, method, body, query = '') {
  const response = await fetch(`/api/participants/${requestId}${query}`, method === 'GET' ? undefined : {
    method,
    headers: { 'Content-Type': 'application/json', 'X-CSRFToken': window.django.csrf },
    body: JSON.stringify(body),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data.detail || '参加者を読み書きできませんでした。');
    error.invalid = data.invalid || [];
    throw error;
  }
  return data;
}

export default class ParticipantAPI {
  list(requestId, { page, pageSize, search }) {
    const query = new URLSearchParams({ page, page_size: pageSize, search });
    return call(requestId, 'GET', null, `?${query}`);
  }

  add(requestId, emails) {
    return call(requestId, 'POST', { emails });
  }

  remove(requestId, ids) {
    return call(requestId, 'DELETE', { ids });
  }
}
