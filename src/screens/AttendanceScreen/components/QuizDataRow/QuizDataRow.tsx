import React from 'react';
import withObservables from '@nozbe/with-observables';
import TestAttemptModel from 'src/database/models/TestAttemptModel';
import TestModel from 'src/database/models/TestModel';
import {HStack} from 'native-base';
import {Box} from 'native-base';
import {Typography} from 'components/Typography/Typography';

type Props = {
  attempt: TestAttemptModel;
  test?: TestModel;
};
const QuizDataRowWithObs = ({attempt, test}: Props) => {
  const status = () => {
    if (!attempt?.status) return '-';
    if (attempt.status === 'passed') return 'P';
    return 'F';
  };

  return (
    <>
      <HStack justifyContent={'space-between'} flex={1}>
        <Box flex={1}>
          <Typography textAlign={'center'}>
            {attempt?.status
              ? `${attempt?.score} / ${test?.overall_score}`
              : '-'}
          </Typography>
        </Box>
        <Box flex={1}>
          <Typography fontWeight="bold" fontSize="18px" textAlign={'center'}>
            {status()}
          </Typography>
        </Box>
      </HStack>
    </>
  );
};

const enhanced = withObservables<{attempt?: TestAttemptModel}, any>(
  ['attempt'],
  ({attempt}) => {
    // console.log('ATTEMPT', attempt);
    return {
      attempt,
      test: attempt?.test.observe(),
    };
  },
);

export const QuizDataRow = enhanced(QuizDataRowWithObs);

export const EmptyQuizDataRow = () => {
  return (
    <>
      <HStack justifyContent={'space-between'} flex={1}>
        <Box flex={1}>
          <Typography textAlign={'center'}>-</Typography>
        </Box>
        <Box flex={1}>
          <Typography textAlign={'center'}>
            -{/* {status()} */}
          </Typography>
        </Box>
      </HStack>
    </>
  );
};
