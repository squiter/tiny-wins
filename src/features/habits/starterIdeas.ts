import type { ColorKey, IconKey } from '../../domain/habit';
import type { InterfaceLanguage } from '../localization/locale';
import { translate, type MessageKey } from '../localization/messages';

interface StarterIdea {
  readonly id: string;
  readonly title: MessageKey;
  readonly icon: IconKey;
  readonly color: ColorKey;
}

export const starterIdeas = [
  { id: 'read', title: 'Read one page', icon: 'book', color: 'coral' },
  { id: 'water', title: 'Drink water', icon: 'water', color: 'blue' },
  { id: 'walk', title: 'Take a short walk', icon: 'walk', color: 'teal' },
] as const satisfies readonly StarterIdea[];

// Presentation fields only: no schedule, identity, timestamps or storage access.
export function starterIdeaFields(idea: StarterIdea, language: InterfaceLanguage) {
  return { title: translate(language, idea.title), icon: idea.icon, color: idea.color };
}
