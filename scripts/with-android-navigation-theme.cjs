const { AndroidConfig, withAndroidStyles, withDangerousMod } = require('expo/config-plugins');
const { mkdir, writeFile } = require('node:fs/promises');
const { join } = require('node:path');

module.exports = function withAndroidNavigationTheme(config) {
  config = withAndroidStyles(config, (mod) => {
    for (const theme of ['AppTheme', 'Theme.App.SplashScreen']) {
      for (const [name, value] of [
        ['android:windowLightNavigationBar', '@bool/tiny_wins_light_system_bars'],
        ['android:windowLightStatusBar', '@bool/tiny_wins_light_system_bars'],
        ['android:navigationBarColor', '@color/tiny_wins_navigation_bar'],
      ]) {
        mod.modResults = AndroidConfig.Styles.assignStylesValue(mod.modResults, {
          add: true,
          parent: { name: theme },
          name,
          value,
        });
      }
    }
    return mod;
  });
  return withDangerousMod(config, [
    'android',
    async (mod) => {
      const resources = join(mod.modRequest.platformProjectRoot, 'app/src/main/res');
      for (const [qualifier, color] of [
        ['values', '#000000'],
        ['values-v26', '@android:color/transparent'],
      ]) {
        const folder = join(resources, qualifier);
        await mkdir(folder, { recursive: true });
        await writeFile(
          join(folder, 'tiny_wins_navigation_bar.xml'),
          `<resources><color name="tiny_wins_navigation_bar">${color}</color></resources>\n`,
        );
      }
      for (const [qualifier, light] of [
        ['values', true],
        ['values-night', false],
      ]) {
        const folder = join(resources, qualifier);
        await mkdir(folder, { recursive: true });
        await writeFile(
          join(folder, 'tiny_wins_system_bars.xml'),
          `<resources><bool name="tiny_wins_light_system_bars">${light}</bool></resources>\n`,
        );
      }
      return mod;
    },
  ]);
};
