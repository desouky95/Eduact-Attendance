import {extendTheme} from 'native-base';

export const theme = extendTheme({
  colors: {
    primary: {
      50: '#dcf7ff',
      100: '#afe3ff',
      200: '#80cffe',
      300: '#50bcfc',
      400: '#26a9fa',
      500: '#128fe0',
      600: '#0370af',
      700: '#00507e',
      800: '#00304e',
      900: '#00111f',
      main: '#50bcfc',
    },
  },
  components: {
    Snackbar: {
      variants: {
        success: {
          background: '#16a34a',
          color: '#FFF',
        },
        error: {
          background: '#dc2626',
          color: '#FFF',
        },
        warning: {
          background: '#ea580c',
          color: '#FFF',
        },
        normal: {
          backgroundColor: '#322F35',
          color: '#F5EFF7',
        },
      },
    },
  },
});

export type CustomThemeType = typeof theme;

// 3. Extend the internal NativeBase Theme
declare module 'native-base' {
  interface ICustomTheme extends CustomThemeType {}
}

declare module 'styled-components' {
  interface DefaultTheme extends CustomThemeType {}
}
