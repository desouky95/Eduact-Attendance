import {Q} from '@nozbe/watermelondb';
import {useDatabase} from '@nozbe/watermelondb/hooks';
import {useFocusEffect} from '@react-navigation/native';
import {set} from 'lodash';
import React, {useCallback, useEffect, useReducer, useState} from 'react';
import UserModel from 'src/database/models/UserModel';

type UseStudentsArgs = {
  page?: number;
  perPage?: number;
  search?: string;
};

export const useStudents = ({
  page = 1,
  perPage = 10,
  search = '',
}: // search = '',
UseStudentsArgs) => {
  const [isLoading, setIsLoading] = useState(false);
  const [pages, setPages] = useState(1);
  const [totalUsers,setTotal] = useState(1);
  const [users, setUsers] = useState<UserModel[]>([]);

  const database = useDatabase();
  const query = useCallback(
    (page: number, perPage: number, search: string) =>
      database
        .get<UserModel>(UserModel.table)
        .query(
          Q.or(
            Q.where('first_name', Q.like(`%${Q.sanitizeLikeString(search)}%`)),
            Q.where('last_name', Q.like(`%${Q.sanitizeLikeString(search)}%`)),
            Q.where(
              'phone_number',
              Q.like(`%${Q.sanitizeLikeString(search)}%`),
            ),
            Q.where('username', Q.like(`%${Q.sanitizeLikeString(search)}%`)),
          ),
          Q.skip((page - 1) * perPage),
          Q.take(perPage),
          Q.sortBy('username', 'asc'),
        ),
    [],
  );

  const total = useCallback(
    () =>
      database
        .get<UserModel>(UserModel.table)
        .query(
          Q.or(
            Q.where('first_name', Q.like(`%${Q.sanitizeLikeString(search)}%`)),
            Q.where('last_name', Q.like(`%${Q.sanitizeLikeString(search)}%`)),
            Q.where(
              'phone_number',
              Q.like(`%${Q.sanitizeLikeString(search)}%`),
            ),
            Q.where('username', Q.like(`%${Q.sanitizeLikeString(search)}%`)),
          ),
        ),
    [search],
  );

  useFocusEffect(React.useCallback(() => {
    const subscription = total()
      .observeCount()
      .subscribe(count => {
        setPages(Math.ceil(count / perPage));
      });

    return () => subscription.unsubscribe();
  }, [search]));

  useFocusEffect(React.useCallback(() => {
    const subscription = total()
      .observeCount()
      .subscribe(count => {
        setTotal(count);
      });

    return () => subscription.unsubscribe();
  }, []));
  // useEffect(() => {
  //   const subscription = total()
  //     .observeCount()
  //     .subscribe(count => {
  //       setPages(Math.ceil(count / perPage));
  //     });

  //   return () => subscription.unsubscribe();
  // }, [search]);

  useFocusEffect(React.useCallback(() => {
    setIsLoading(true);
    console.log('page:', page);
    const newQuery = query(page, perPage, search);
    const observable = newQuery.observe();
    const subscription = observable.subscribe(value => {
      setUsers(prev => value);
      setIsLoading(false);
    });
    return () => subscription.unsubscribe();
  }, [page,perPage,search]));

  // useEffect(() => {
  //   setIsLoading(true);
  //   console.log('page:', page);
  //   const newQuery = query(page, perPage, search);
  //   const observable = newQuery.observe();
  //   const subscription = observable.subscribe(value => {
  //     setUsers(prev => value);
  //     setIsLoading(false);
  //   });
  //   return () => subscription.unsubscribe();
  // }, [page, perPage, search]);

  return {users, isLoading, pages,totalUsers};
};
