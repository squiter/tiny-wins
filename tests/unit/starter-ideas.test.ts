import { describe, expect, it } from 'vitest';
import { habitAppearance, habitTitle } from '../../src/domain/habit';
import { starterIdeas, starterIdeaFields } from '../../src/features/habits/starterIdeas';

describe('editable starter ideas', () => {
  it('offers three distinct binary ideas with valid existing appearances and localized names', () => {
    expect(starterIdeas.map((idea) => idea.id)).toEqual(['read', 'water', 'walk']);
    const names = {
      en: ['Read one page', 'Drink water', 'Take a short walk'],
      'pt-BR': ['Ler uma página', 'Beber água', 'Fazer uma caminhada curta'],
    } as const;
    for (const language of ['en', 'pt-BR'] as const) {
      expect(starterIdeas.map((idea) => starterIdeaFields(idea, language).title)).toEqual(
        names[language],
      );
      for (const idea of starterIdeas) {
        const fields = starterIdeaFields(idea, language);
        expect(habitTitle(fields.title)).toBe(fields.title);
        expect(() => habitAppearance(fields.color, fields.icon)).not.toThrow();
        // Applying an idea cannot supply identity, dates, schedule or wins.
        expect(Object.keys(fields).sort()).toEqual(['color', 'icon', 'title']);
      }
    }
  });
});
