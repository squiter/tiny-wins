import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren,
} from 'react';
import { AccessibilityInfo } from 'react-native';
import { useReducedMotion } from 'react-native-reanimated';
import { usePreferences, useRepository } from '../../database/provider';
import {
  celebrationMotionAllowed,
  type CheckInOutcome,
  type CelebrationKind,
} from '../../domain/feedback';
import { checkInCelebration } from './service';
import type { Clock } from '../check-ins/service';
import { deviceClock } from '../../lib/clock';
export interface CelebrationEvent extends CheckInOutcome {
  serial: number;
  kind: CelebrationKind;
}
const Context = createContext<{
  event: CelebrationEvent | null;
  animationsAllowed: boolean;
  announce(outcome: CheckInOutcome): void;
  setAnimations(value: boolean): void;
} | null>(null);
export function FeedbackProvider({
  children,
  clock = deviceClock,
}: PropsWithChildren<{ clock?: Clock }>) {
  const repository = useRepository();
  const { celebrationAnimations, setCelebrationAnimations } = usePreferences();
  const initialReducedMotion = useReducedMotion();
  const [reducedMotion, setReducedMotion] = useState(initialReducedMotion);
  const [event, setEvent] = useState<CelebrationEvent | null>(null);
  const serial = useRef(0);
  useEffect(() => {
    let active = true;
    void AccessibilityInfo.isReduceMotionEnabled().then((value) => {
      if (active) setReducedMotion(value);
    });
    const listener = AccessibilityInfo.addEventListener('reduceMotionChanged', (value) => {
      setReducedMotion(value);
      setEvent(null);
    });
    return () => {
      active = false;
      listener.remove();
    };
  }, []);
  const animationsAllowed = celebrationMotionAllowed(celebrationAnimations, reducedMotion);
  const setAnimations = useCallback(
    (value: boolean) => {
      setCelebrationAnimations(value);
      setEvent(null);
    },
    [setCelebrationAnimations],
  );
  const announce = useCallback(
    (outcome: CheckInOutcome) => {
      if (!animationsAllowed) return;
      const kind = checkInCelebration(repository, clock, outcome);
      if (kind) setEvent({ ...outcome, kind, serial: ++serial.current });
      else setEvent(null);
    },
    [animationsAllowed, repository, clock],
  );
  const value = useMemo(
    () => ({ event: animationsAllowed ? event : null, animationsAllowed, announce, setAnimations }),
    [event, animationsAllowed, announce, setAnimations],
  );
  return <Context.Provider value={value}>{children}</Context.Provider>;
}
export function useCelebrations() {
  const value = useContext(Context);
  if (!value) throw new Error('Feedback provider is missing.');
  return value;
}
