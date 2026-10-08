export interface CountdownResult {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalMsRemaining: number;
  isExpired: boolean;
  isClosingSoon: boolean; // Less than 7 days
  formattedString: string;
}

export function calculateCountdown(closingDateIso: string, referenceTime: number = Date.now()): CountdownResult {
  const targetTime = new Date(closingDateIso).getTime();
  const diffMs = targetTime - referenceTime;

  if (diffMs <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      totalMsRemaining: 0,
      isExpired: true,
      isClosingSoon: false,
      formattedString: 'Applications Closed'
    };
  }

  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

  const isClosingSoon = days < 7;

  let formattedString = '';
  if (days > 0) {
    formattedString = `${days}d ${hours}h left`;
  } else if (hours > 0) {
    formattedString = `${hours}h ${minutes}m left`;
  } else {
    formattedString = `${minutes}m ${seconds}s left`;
  }

  return {
    days,
    hours,
    minutes,
    seconds,
    totalMsRemaining: diffMs,
    isExpired: false,
    isClosingSoon,
    formattedString
  };
}

export function formatReadableDate(isoString: string): string {
  try {
    const d = new Date(isoString);
    return d.toLocaleDateString('en-ZA', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return isoString;
  }
}
