import React, {useEffect} from 'react';

import {CustomThemeType, theme} from 'src/theme/theme';
import styled from 'styled-components/native';
import {variant} from 'styled-system';

export type SnackbarVariant =
  keyof CustomThemeType['components']['Snackbar']['variants'];
type SnackbarProps = {
  variant?: SnackbarVariant;
  title?: string;
};

export const Snackbar = ({variant = 'success', title}: SnackbarProps) => {
  return (
    <>
      <StyledSnackbarView variant={variant}>
        <SnackbarText variant={variant}>{title}</SnackbarText>
      </StyledSnackbarView>
    </>
  );
};

const StyledSnackbarView = styled.View<{variant: SnackbarVariant}>`
  ${variant({
    prop: 'variant',
    scale: 'components.Snackbar.variants',
    variants: {},
  })}
  padding: 14px 16px;
  border-radius: 4px;
  elevation: 3;
  min-width: 265px;
  /* min-width: 344px; */
  min-height: 48px;
  align-items: flex-start;
  gap: 4px;
  /* opacity: 0; */
`;
const SnackbarText = styled.Text<{variant: SnackbarVariant}>`
  ${variant({
    prop: 'variant',
    scale: 'components.Snackbar.variants',
    variants: {},
  })}
`;
