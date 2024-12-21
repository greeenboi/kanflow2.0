import { appDataDir } from '@tauri-apps/api/path';
export default async function getAppDataDir() {
  // returns ${dataDir}/app-name
  const appDataDirPath = await appDataDir();
  return appDataDirPath;
}
