import {Button, IButtonProps, ICustomTheme} from 'native-base';
import {
  ColorSchemeType,
  ResponsiveValue,
} from 'native-base/lib/typescript/components/types';
import {getContrast, invert, readableColor} from 'polished';
import React, {useEffect} from 'react';

import {
  ColorSchemaVariant,
  CustomThemeType,
  backgroundVariant,
  theme,
} from 'src/theme/theme';
import styled from 'styled-components/native';

export type SnackbarVariant = Exclude<
  keyof ICustomTheme['colors'],
  'contrastThreshold'
>;
type SnackbarProps = {
  // variant?: SnackbarVariant;
  variant?: ColorSchemaVariant;
  title?: string;
  dismissComponent?: React.ReactElement<typeof Button>;
  dismissText?: string;
  dismissComponentProps?: React.ComponentProps<typeof Button>;
  onDismiss?: () => void;
};

export const Snackbar = ({
  variant = 'dark',
  title,
  dismissComponentProps = {
    colorScheme: 'dark',
    backgroundColor: 'amber.200',
  },
  dismissText = 'DISMISS',
  dismissComponent,
  onDismiss,
}: SnackbarProps) => {
  return (
    <>
      <StyledSnackbarView variant={variant}>
        <SnackbarText variant={variant}>{title}</SnackbarText>
        {dismissComponent && dismissComponent}
        {!dismissComponent && (
          <SnackbarButton
            onPress={onDismiss}
            {...dismissComponentProps}
            colorVariant={variant}>
            {dismissText}
          </SnackbarButton>
        )}
      </StyledSnackbarView>
    </>
  );
};

const StyledSnackbarView = styled.View<{variant: ColorSchemaVariant}>`
  padding: 14px 16px;
  border-radius: 4px;
  elevation: 3;
  min-width: 265px;
  /* min-width: 344px; */
  min-height: 48px;
  align-items: flex-start;
  gap: 4px;
  display: flex;
  flex-direction: row;
  align-items: center;
  ${backgroundVariant({variant: 'variant'})}
`;
const SnackbarButton = styled(Button)<{colorVariant: ColorSchemaVariant}>`
  ${backgroundVariant({variant: 'colorVariant', density: 700})}
`;
const SnackbarText = styled.Text<{variant: ColorSchemaVariant}>`
  ${backgroundVariant({variant: 'variant'})};
  color: ${p =>
    readableColor(p.theme.colors[p.variant]['600'], '#000', '#FFF', true)};
  flex: 1;
`;
