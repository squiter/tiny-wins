// The browser SQLite worker must be recreated after a failed exclusive file lock.
export function recoverApp(_retry: () => Promise<void>) {
  window.location.reload();
}
