import {Table} from 'components/Table/Table';
import {Typography} from 'components/Typography/Typography';
import {debounce, update} from 'lodash';
import {Skeleton} from 'native-base';
import {VStack} from 'native-base';
import {Box} from 'native-base';
import {HStack, Button} from 'native-base';
import React, {Reducer, useEffect, useReducer, useState} from 'react';
import {ScrollView} from 'react-native';
import {Text, View} from 'react-native';
import {useStudents} from 'src/hooks/useStudents';

type ReducerArgs = {page?: number; perPage?: number; search?: string};

export const StudentsScreen = () => {
  const [data, dispatch] = useReducer<Reducer<ReducerArgs, ReducerArgs>, any>(
    (state, action) => ({...state, ...action}),
    {page: 1, perPage: 100, search: ''},
    args => ({page: 1, perPage: 100, search: ''}),
  );
  const {isLoading, users, pages} = useStudents({...data});

  // console.log('DATA', data);
  const [search, setSearch] = useState('');
  const handleOnSearchChange = (text: string) => {
    setSearch(text);
    console.log('text', text);
  };
  const updateData = debounce((value, dispatch) => {
    console.log('VALUE', value);
    dispatch({search: value, page: 1});
  }, 500);
  useEffect(() => {
    updateData(search, dispatch);
  }, [search]);
  return (
    <View style={{flex: 1}}>
      <Box p="3" width="100%" flex={1}>
        {isLoading && (
          <>
            <Box mb="4">
              <Skeleton
                width="100%"
                borderRadius={'5'}
                h={'35'}
                mb={2}
                startColor="gray.300"
                endColor="gray.100"
              />
              <Skeleton.Text startColor="gray.300" endColor="gray.100" />
            </Box>
            <Box mb="4">
              <Skeleton width="100%" borderRadius={'5'} h={'35'} mb={2} />
              <Skeleton.Text />
            </Box>
            <Box mb="4">
              <Skeleton
                width="100%"
                borderRadius={'5'}
                h={'35'}
                mb={2}
                startColor="gray.300"
                endColor="gray.100"
              />
              <Skeleton.Text startColor="gray.300" endColor="gray.100" />
            </Box>
            <Box mb="4">
              <Skeleton width="100%" borderRadius={'5'} h={'35'} mb={2} />
              <Skeleton.Text />
            </Box>
          </>
        )}

        {!isLoading && (
          <VStack width="100%" height="100%">
            <Box mb="4" borderRadius={'5'} overflow="hidden" style={{flex: 1}}>
              <Table
                onSearchChange={handleOnSearchChange}
                searchValue={search}
                withHeader
                headerTitle="Students"
                columns={['Name', 'Username', 'Phone']}
                data={users}>
                {({item: user, index, TableRow, TableCell}) => {
                  return (
                    <TableRow>
                      <TableCell>
                        <Typography numberOfLines={1} style={{width: '100%'}}>
                          {user?.first_name} {user?.last_name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography>{user.username}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography>{user.phone_number}</Typography>
                      </TableCell>
                    </TableRow>
                  );
                }}
              </Table>
            </Box>
            <HStack
              width="100%"
              justifyContent={'space-between'}
              alignItems="center">
              <Button
                disabled={data.page === 1}
                isDisabled={data.page === 1}
                onPress={() => dispatch({page: data.page! - 1})}>
                Prev
              </Button>
              <Typography>
                Page {data.page} of {pages}
              </Typography>

              <Button
                isDisabled={data.page == pages}
                onPress={() => dispatch({page: data.page! + 1})}>
                Next
              </Button>
            </HStack>
          </VStack>
        )}
      </Box>
    </View>
  );
};
