import type { WeekStartsOn } from '../../domain/preferences';
export interface PreferencesRepository {
  getWeekStartsOn(): WeekStartsOn;
  setWeekStartsOn(value: WeekStartsOn): void;
}
