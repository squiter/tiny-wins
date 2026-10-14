import { backupLimit } from '../../domain/backup';
export async function saveBackupFile(source: string, filename: string) {
  const url = URL.createObjectURL(new Blob([source], { type: 'application/json' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export function chooseBackupFile(): Promise<string | null> {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,application/json';
    input.style.display = 'none';
    const finish = (source: string | null) => {
      input.remove();
      resolve(source);
    };
    input.oncancel = () => finish(null);
    input.onchange = async () => {
      try {
        const file = input.files?.[0];
        if (!file) {
          finish(null);
          return;
        }
        if (file.size > backupLimit) throw new Error('Choose a backup smaller than 5 MB.');
        finish(await file.text());
      } catch (error) {
        input.remove();
        reject(error);
      }
    };
    document.body.appendChild(input);
    input.click();
  });
}
