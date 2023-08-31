import {EdTextInput} from 'components/EdTextInput';
import {Typography} from 'components/Typography/Typography';
import {Box, Button, Flex, HStack, VStack} from 'native-base';
import React, {
  PropsWithChildren,
  ReactElement,
  ReactNode,
  cloneElement,
} from 'react';
import {TextInputChangeEventData, TouchableOpacity} from 'react-native';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  NativeSyntheticEvent,
} from 'react-native';
import {getFontSize} from 'src/theme/getFontSize';
import styled from 'styled-components/native';
import {v4 as uuid} from 'uuid';
import {debounce} from 'lodash';
type CssSelectors = {
  isLastChild?: boolean;
  isFirstChild?: boolean;
};
type TableRowProps = {
  children:
    | Array<ReactElement<typeof TableCell>>
    | ReactElement<typeof TableCell>;
  index?: number;
} & CssSelectors &
  Pick<
    React.ComponentProps<typeof TouchableOpacity>,
    'onPress' | 'activeOpacity'
  >;
export const TableRow = ({
  children,
  onPress,
  activeOpacity,
  ...props
}: TableRowProps) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={activeOpacity}>
      <HStack
        width="100%"
        bgColor={'white'}
        borderBottomWidth={!props.isLastChild ? '1px' : '0px'}
        borderBottomColor={!props.isLastChild ? 'gray.300' : 'transparent'}
        // maxHeight="32px"
        minHeight="50px">
        {React.Children.map(children, (child, index) =>
          cloneElement(child as any, {
            ...child.props,
            isLastChild: index === React.Children.count(children) - 1,
            isFirstChild: index === 0,
            index,
          }),
        )}
      </HStack>
    </TouchableOpacity>
  );
};

type TableCellProps = {index?: number} & CssSelectors;

export const TableCell = ({
  children,
  isLastChild,
}: PropsWithChildren<TableCellProps>) => {
  return (
    <Flex
      flex={1}
      flexDirection="row"
      alignItems="center"
      px="12px"
      minHeight="40px"
      flexBasis="auto"
      borderRightWidth={isLastChild ? '0px' : '1px'}
      borderRightColor={isLastChild ? 'transparent' : 'gray.200'}>
      {children}
    </Flex>
  );
};

type TableItemData<T> = {
  item: T;
  index: number;
  TableRow: typeof TableRow;
  TableCell: typeof TableCell;
};
type TableProps<T> = {
  data: Array<T>;
  columns?: Array<string>;
  children: (args: TableItemData<T>) => ReactElement<TableRowProps>;
  headerTitle?: string;
  withExport?: boolean;
  onExport?: () => void;
  withHeader?: boolean;
  withSearch?: boolean;
  onSearchChange?: (text: string) => void;
  searchValue?: string;
};
export const Table = <T,>({
  columns,
  children,
  data,
  headerTitle = 'Data',
  withExport = false,
  onExport,
  withHeader = false,
  withSearch = true,
  onSearchChange,
  searchValue = '',
}: TableProps<T>) => {
  return (
    <View style={TableStyles.tableContainer}>
      <HStack
        flexDirection="row"
        borderBottomWidth="1px"
        py="12px"
        mx="12px"
        alignItems="center"
        space={10}>
        {withExport && (
          <>
            <Button
              size="sm"
              rounded="full"
              onPress={onExport}
              colorScheme="primary"
              variant="outline">
              Export
            </Button>
          </>
        )}
        {!withExport && (
          <Typography fontSize={getFontSize(12)} color="#000">
            {headerTitle}
          </Typography>
        )}
        {withSearch && (
          <EdTextInput
            value={searchValue}
            onChangeText={onSearchChange}
            borderRadius={200}
            flex={1}
            padding={'0px'}
            py="0"
          />
        )}
      </HStack>
      <VStack>
        <ScrollView stickyHeaderIndices={[0]}>
          {withHeader && columns && (
            <TableRow>
              {columns?.map((column, index) => {
                return (
                  <TableCell key={`${column}-${index}`}>{column}</TableCell>
                );
              })}
            </TableRow>
          )}
          {data.map((item, index) => (
            <React.Fragment key={`table-${index}`}>
              {React.Children.map<
                ReactElement<TableRowProps>,
                ReactElement<TableRowProps>
              >(
                children({item, TableRow, TableCell, index}),
                (child: React.ReactElement<TableRowProps>) =>
                  cloneElement(child, {
                    ...child.props,
                    index,
                    isLastChild: index === data.length - 1,
                  }),
              )}
            </React.Fragment>
          ))}
        </ScrollView>
      </VStack>
    </View>
  );
};

const TableStyles = StyleSheet.create({
  scrollView: {
    // flex: 1,
    // display: 'flex',
    backgroundColor: 'yellow',
  },
  scrollViewContent: {
    // flex: 1,
    // minWidth: '100%',
    borderRadius: 5,
  },
  tableContainer: {
    // paddingHorizontal: 12,
    // overflow: 'hidden',
    borderRadius: 5,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.19,
    shadowRadius: 5.62,
    elevation: 6,
    backgroundColor: '#FFF',
    // backgroundColor: 'yellow',

    // flex: 1,
    // flexGrow: 1,
    width: '100%',
    display: 'flex',
    marginBottom: 5,
    // minWidth: '100%',
  },
});

const TableHeader = styled(Flex)<{lastChild: boolean; index: number}>`
  border-right-width: 1px;
  border-color: ${p => {
    return !p.lastChild ? p.theme.colors.gray[200] : 'transparent';
  }};
  padding: 4px 8px;
  margin: 4px 0;
  /* flex: 1; */
  /* flex-grow: 1; */
  /* min-width: 20%; */
`;

// const TableHeader = styled(TableRow)`
//   /* position: ; */
// `;

export const TableMemo = React.memo(Table);
