import type { LanguagePreference } from '../localization/locale';
import type { Appearance, WeekStartsOn } from '../../domain/preferences';
export interface PreferencesRepository {
  getLanguage(): LanguagePreference;
  setLanguage(value: LanguagePreference): void;
  getCelebrationAnimations(): boolean;
  setCelebrationAnimations(value: boolean): void;
  getAppearance(): Appearance;
  setAppearance(value: Appearance): void;
  getWeekStartsOn(): WeekStartsOn;
  setWeekStartsOn(value: WeekStartsOn): void;
}
