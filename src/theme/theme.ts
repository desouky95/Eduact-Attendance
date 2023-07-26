import {ICustomTheme, extendTheme} from 'native-base';
import {parseToRgb, toColorString} from 'polished';
import {css} from 'styled-components';

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
    cadet: {
      50: '#f2effc',
      100: '#d6d2e1',
      200: '#b9b4ca',
      300: '#9c96b4',
      400: '#7f799e',
      500: '#645f84',
      600: '#4d4a68',
      700: '#36354b',
      800: '#20202f',
      900: '#0c0a16',
      main: '#36354b',
    },
  },

  backgrounds: {
    primary: {
      backgroundColor: '#50bcfc',
    },
  },

  components: {
    Button: {
      variants: {
        outline: ({colorScheme}) => {
          return {
            borderColor: `${colorScheme}.300`,
            _text : {
              color : `${colorScheme}.300`
            }
          };
        },
      },
    },
    Snackbar: {
      variants: {
        success: {
          backgroundColor: '#16a34a',
          color: '#FFF',
        },
        error: {
          backgroundColor: '#dc2626',
          color: '#FFF',
        },
        warning: {
          backgroundColor: '#ea580c',
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

export type ColorSchemaVariant = NonNullable<
  Exclude<keyof ICustomTheme['colors'], 'contrastThreshold'>
>;
export const backgroundVariant = ({
  variant,
  density = 600,
}: {
  variant: string;
  density?: keyof ICustomTheme['colors']['amber'];
}) => {
  return (props: any) => {
    const theme = props.theme as ICustomTheme;
    const color =
      (theme.colors as any)[props[variant]]?.[density] ??
      (theme.colors as any)[props[variant]];
    return css`
      background-color: ${color};
    `;
  };
};

// 3. Extend the internal NativeBase Theme
declare module 'native-base' {
  export interface ICustomTheme extends CustomThemeType {}
}

declare module 'styled-components' {
  interface DefaultTheme extends CustomThemeType {}
}
