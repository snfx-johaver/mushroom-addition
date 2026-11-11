const HOUR = 3_600_000;

function wallTime(time: number, timeZone?: string): number {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone, year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23",
  }).formatToParts(time);
  const part = (name: Intl.DateTimeFormatPartTypes) => Number(parts.find(item => item.type === name)!.value);
  return Date.UTC(part("year"), part("month") - 1, part("day"), part("hour"), part("minute"), part("second"));
}

function fromWallTime(wall: number, timeZone?: string): number {
  const offsets = new Set([-24, 0, 24].map(hours => {
    const time = wall + hours * HOUR;
    return wallTime(time, timeZone) - time;
  }));
  const candidates = [...offsets].map(offset => wall - offset);
  const exact = candidates.filter(time => wallTime(time, timeZone) === wall);
  // Match native Date: use the earlier repeated hour; move skipped hours forward.
  return exact.length ? Math.min(...exact)
    : Math.min(...candidates.filter(time => wallTime(time, timeZone) > wall));
}

export function calendarDay(time: number, offset = 0, timeZone?: string): number {
  const date = new Date(wallTime(time, timeZone));
  date.setUTCDate(date.getUTCDate() + offset);
  date.setUTCHours(0, 0, 0, 0);
  return fromWallTime(date.getTime(), timeZone);
}

export function calendarHour(day: number, hour: number, timeZone?: string): number {
  const date = new Date(wallTime(day, timeZone));
  date.setUTCHours(hour, 0, 0, 0);
  return fromWallTime(date.getTime(), timeZone);
}

export function calendarDate(time: number, timeZone?: string): string {
  return new Date(wallTime(time, timeZone)).toISOString().slice(0, 10);
}
