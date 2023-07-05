import styled from 'styled-components/native';
import {typography, TypographyProps ,color ,ColorProps} from 'styled-system';

export const Typography = styled.Text<TypographyProps & ColorProps>`
  ${typography};
  ${color}
`;
