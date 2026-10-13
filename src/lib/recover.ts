export function recoverApp(retry: () => Promise<void>) {
  void retry();
}
