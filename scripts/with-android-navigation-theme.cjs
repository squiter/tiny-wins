const { AndroidConfig, withAndroidStyles, withDangerousMod } = require('expo/config-plugins');
const { mkdir, writeFile } = require('node:fs/promises');
const { join } = require('node:path');

module.exports = function withAndroidNavigationTheme(config) {
  config = withAndroidStyles(config, (mod) => {
    for (const [name, value] of [
      ['android:windowLightNavigationBar', '?attr/isLightTheme'],
      ['android:navigationBarColor', '@color/tiny_wins_navigation_bar'],
    ]) {
      mod.modResults = AndroidConfig.Styles.assignStylesValue(mod.modResults, {
        add: true,
        parent: AndroidConfig.Styles.getAppThemeGroup(),
        name,
        value,
      });
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
      return mod;
    },
  ]);
};
