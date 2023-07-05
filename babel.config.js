const config = require('./tsconfig.json');

const {baseUrl, paths} = config.compilerOptions;

module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['module:metro-react-native-babel-preset'],
    plugins: [
      [
        'module:react-native-dotenv',
        {
          envName: 'APP_ENV',
          moduleName: '@env',
          path: '.env',
        },
      ],
      ['@babel/plugin-proposal-decorators', {legacy: true}],
      [
        'module-resolver',
        {
          extensions: [
            '.ios.js',
            '.android.js',
            '.js',
            '.ts',
            '.tsx',
            '.json',
            '.env',
          ],
          root: ['.'],
          alias: {
            // This needs to be mirrored in tsconfig.json
            components: './src/common/components',
            assets: './assets',
          },
        },
      ],
      'react-native-reanimated/plugin',
    ],
  };
};
