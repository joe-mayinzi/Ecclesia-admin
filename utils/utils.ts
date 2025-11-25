const rtf = new Intl.RelativeTimeFormat('fr', { numeric: 'auto' });

export function formatRelativeDate(dateStr: string) {
  const now = new Date();
  const past = new Date(dateStr);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  const times = [
    { unit: 'year', seconds: 31536000 },
    { unit: 'month', seconds: 2592000 },
    { unit: 'week', seconds: 604800 },
    { unit: 'day', seconds: 86400 },
    { unit: 'hour', seconds: 3600 },
    { unit: 'minute', seconds: 60 },
    { unit: 'second', seconds: 1 },
  ];

  for (const { unit, seconds } of times) {
    const value = Math.floor(diffInSeconds / seconds);
    if (value >= 1) {
      return rtf.format(-value, unit as Intl.RelativeTimeFormatUnit);
    }
  }

  return "À l'instant";
}
