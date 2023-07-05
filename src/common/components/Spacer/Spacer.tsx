import styled from 'styled-components/native';
import {SpaceProps,layout, space , LayoutProps} from 'styled-system';

export const Spacer = styled.View<SpaceProps &LayoutProps>`
  ${space};
  ${layout}
`;
