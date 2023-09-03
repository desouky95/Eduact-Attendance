import React, {useEffect, useState, useMemo} from 'react';
import {
  getCourseAttendance,
  getCourseAttendanceOverall,
} from 'src/database/data/attendance.data';
import CenterAttendanceModel from 'src/database/models/CenterAttendanceModel';

import {database} from 'src/database';
import {useFocusEffect} from '@react-navigation/native';
import {jsonReplacer} from 'src/utils/jsonReplacer';

type UseCourseAttendanceArgs = {
  center_id: number | null;
  online_id: number | null;
  group_id: number | null;
  type: string | null;
  page?: number;
  perPage?: number;
  search?: string;
};

export const useCourseAttendance = ({
  center_id,
  group_id,
  online_id,
  type,
  page,
  perPage,
  search = '',
}: UseCourseAttendanceArgs) => {
  const [data, setData] = useState<CenterAttendanceModel[]>([]);
  const [pages, setPages] = useState<number | undefined>();

  const [isLoading, setIsLoading] = useState(false);


  useFocusEffect(
    React.useCallback(() => {
      if (!center_id) {
        setData([]);
        return;
      }
      setIsLoading(true);
      const subscription = getCourseAttendance(
        center_id,
        online_id,
        group_id,
        type,
        search,
        page,
        perPage,
      ).subscribe(value => {
        setData(value);
        setIsLoading(false);
      });

      return () => subscription.unsubscribe();
    }, [center_id, online_id, group_id, type, page, search]),
  );

  useFocusEffect(
    React.useCallback(() => {
      setIsLoading(true);
      const subscription = getCourseAttendance(
        center_id,
        online_id,
        group_id,
        type,
        search,
      ).subscribe(value => {
        setPages(Math.ceil(value.length / perPage!));
        setIsLoading(false);
      });

      return () => subscription.unsubscribe();
    }, [center_id, online_id, group_id, type, search]),
  );

  return {
    attendance: data,
    total: data.length,
    isLoading,
    pages,
  };
};
