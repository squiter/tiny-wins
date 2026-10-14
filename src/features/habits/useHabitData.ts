import { useCallback, useEffect, useState } from 'react';
import { AppState } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { useRepository } from '../../database/provider';
import { localDay } from '../../domain/calendar';
import { deviceClock } from '../../lib/clock';
export function useHabitData() {
  const repository = useRepository();
  const [, setRevision] = useState(0);
  const refresh = useCallback(() => setRevision((value) => value + 1), []);
  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh]),
  );
  useEffect(() => {
    const listener = AppState.addEventListener('change', (state) => {
      if (state === 'active') refresh();
    });
    const timer = setInterval(refresh, 30_000);
    return () => {
      listener.remove();
      clearInterval(timer);
    };
  }, [refresh]);
  return {
    repository,
    refresh,
    habits: repository.listHabits(),
    completions: repository.listCompletions(),
    notes: repository.listNotes(),
    today: localDay(deviceClock.now(), deviceClock.timezone()),
  };
}
