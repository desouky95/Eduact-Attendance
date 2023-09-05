import styled from 'styled-components/native';
import {
  typography,
  TypographyProps,
  color,
  ColorProps,
  layout,
  LayoutProps,
} from 'styled-system';

export const Typography = styled.Text<
  TypographyProps & ColorProps & LayoutProps
>`
  color: #000;
  ${typography};
  ${color};
  ${layout};
`;
