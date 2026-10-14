import type { Appearance, WeekStartsOn } from '../../domain/preferences';
export interface PreferencesRepository {
  getAppearance(): Appearance;
  setAppearance(value: Appearance): void;
  getWeekStartsOn(): WeekStartsOn;
  setWeekStartsOn(value: WeekStartsOn): void;
}
