import React, {useEffect, useState, useMemo} from 'react';
import {
  getCourseAttendance,
  
} from 'src/database/data/attendance.data';
import CenterAttendanceModel from 'src/database/models/CenterAttendanceModel';

import {database} from 'src/database';
import {useFocusEffect} from '@react-navigation/native';
import {jsonReplacer} from 'src/utils/jsonReplacer';
import {useAppSelector} from 'src/store';

type UseCourseAttendanceArgs = {
  center_id: number | null;
  online_id: number | null;
  group_id: number | null;
  type: string | null;
  page?: number;
  perPage?: number;
  search?: string;
  enrolled?: boolean;
};

export const useCourseAttendance = ({
  center_id,
  group_id,
  online_id,
  type,
  page,
  perPage,
  search = '',
  enrolled = false,
}: UseCourseAttendanceArgs) => {
  const [data, setData] = useState<CenterAttendanceModel[]>([]);
  const [pages, setPages] = useState<number | undefined>();
  const [total, setTotal] = useState<number | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  const {current} = useAppSelector(s => s.course);

  useFocusEffect(
    React.useCallback(() => {
      if (!center_id || !current?.id) {
        setData([]);
        return;
      }
      setIsLoading(true);
      const subscription = getCourseAttendance(
        Number(current.id),
        center_id,
        online_id,
        group_id,
        type,
        search,
        enrolled,
        page,
        perPage,
      ).subscribe(value => {
        setData(value);
        setIsLoading(false);
      });

      return () => subscription.unsubscribe();
    }, [
      current?.id,
      center_id,
      online_id,
      group_id,
      type,
      page,
      search,
      enrolled,
    ]),
  );

  useFocusEffect(
    React.useCallback(() => {
      if (!current || !current?.id) {
        setPages(0);
        return;
      }
      setIsLoading(true);
      const subscription = getCourseAttendance(
        Number(current.id),
        center_id,
        online_id,
        group_id,
        type,
        search,
        enrolled,
      ).subscribe(value => {
        setPages(Math.ceil(value.length / perPage!));
        setTotal(value.length);
        setIsLoading(false);
      });

      return () => subscription.unsubscribe();
    }, [current?.id, enrolled, center_id, online_id, group_id, type, search]),
  );

  return {
    attendance: data,
    total,
    isLoading,
    pages,
  };
};
