export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

export function formatDate(value, options = {}) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options,
  });
}

export function formatDateTime(value) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
}

export function truncate(text, length = 140) {
  if (!text) return '';
  return text.length > length ? `${text.slice(0, length).trimEnd()}…` : text;
}

export function isUpcoming(dateStr) {
  return new Date(dateStr).getTime() >= Date.now();
}
