import type { Clock } from '../features/check-ins/service';
export const deviceClock: Clock = {
  now: () => new Date(),
  timezone: () => Intl.DateTimeFormat().resolvedOptions().timeZone,
};
