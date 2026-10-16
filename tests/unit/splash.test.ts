import { afterEach, describe, expect, it, vi } from 'vitest';

const native = vi.hoisted(() => ({
  preventAutoHideAsync: vi.fn().mockResolvedValue(true),
  hide: vi.fn(),
  setOptions: vi.fn(),
  isReduceMotionEnabled: vi.fn().mockResolvedValue(false),
}));
vi.mock('expo-splash-screen', () => native);
vi.mock('react-native', () => ({ AccessibilityInfo: native }));

afterEach(() => {
  vi.resetModules();
  vi.clearAllMocks();
});

describe('native launch lifecycle', () => {
  it('holds launch before rendering and reveals content with a brief fade', async () => {
    native.isReduceMotionEnabled.mockResolvedValue(false);
    const { hideNativeSplash } = await import('../../src/lib/splash');
    expect(native.preventAutoHideAsync).toHaveBeenCalledOnce();
    expect(native.hide).not.toHaveBeenCalled();
    hideNativeSplash();
    await vi.waitFor(() => expect(native.hide).toHaveBeenCalledOnce());
    expect(native.setOptions).toHaveBeenCalledWith({ fade: true, duration: 180 });
  });

  it('removes the fade when the OS requests reduced motion', async () => {
    native.isReduceMotionEnabled.mockResolvedValue(true);
    const { hideNativeSplash } = await import('../../src/lib/splash');
    hideNativeSplash();
    await vi.waitFor(() => expect(native.hide).toHaveBeenCalledOnce());
    expect(native.setOptions).toHaveBeenCalledWith({ fade: false, duration: 0 });
  });

  it('still reveals recovery when motion detection or holding splash fails', async () => {
    native.isReduceMotionEnabled.mockRejectedValueOnce(new Error('Unavailable'));
    native.preventAutoHideAsync.mockRejectedValueOnce(new Error('Already hidden'));
    const { hideNativeSplash } = await import('../../src/lib/splash');
    hideNativeSplash();
    await vi.waitFor(() => expect(native.hide).toHaveBeenCalledOnce());
    expect(native.setOptions).toHaveBeenCalledWith({ fade: false, duration: 0 });
  });
});
