import { File, Paths } from 'expo-file-system';
import { getDocumentAsync } from 'expo-document-picker';
import { isAvailableAsync, shareAsync } from 'expo-sharing';
import { backupLimit } from '../../domain/backup';
export async function saveBackupFile(source: string, filename: string) {
  if (!(await isAvailableAsync())) throw new Error('File sharing is not available on this device.');
  const file = new File(Paths.cache, filename);
  file.create({ overwrite: true });
  file.write(source);
  await shareAsync(file.uri, {
    mimeType: 'application/json',
    UTI: 'public.json',
    dialogTitle: 'Save Tiny Wins backup',
  });
}
export async function chooseBackupFile(): Promise<string | null> {
  const result = await getDocumentAsync({
    type: 'application/json',
    copyToCacheDirectory: true,
    multiple: false,
  });
  if (result.canceled) return null;
  const asset = result.assets[0];
  if (!asset) return null;
  const file = new File(asset.uri);
  if (file.size > backupLimit) throw new Error('Choose a backup smaller than 5 MB.');
  return file.text();
}
