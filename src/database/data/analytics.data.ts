import {Q} from '@nozbe/watermelondb';
import {database} from '..';
import EnrolledClassroomModel from '../models/EnrolledClassroomModel';

export const getCourseEnrollmentAnalytics = (
  classroom_id: string,
  course_id: string,
  group_id?: string,
) => {
  console.log('GROUP', group_id);
  const base = database.get<EnrolledClassroomModel>(
    EnrolledClassroomModel.table,
  );

  const groupStatement = group_id
    ? `and group_id = '${Q.sanitizeLikeString(group_id?.toString())}'`
    : '';

  const baseQueryString = `
    select ec.* from enroll_classrooms ec 
    left join  
        (select * from  enroll_courses where course_id = ? and classroom_id = ? ) ec2 
        on ec.user_id = ec2.user_id 
  `;

  const notEnrolledQuery = base.query(
    Q.unsafeSqlQuery(
      `
        ${baseQueryString}
        where ec2.user_id is null
         ${groupStatement}
        `,
      [course_id, classroom_id],
    ),
  );
  const enrolledQuery = base.query(
    Q.unsafeSqlQuery(
      `
        ${baseQueryString}
        ${group_id ? `where group_id = '${Q.sanitizeLikeString(group_id.toString())}'`: ''}
        `,
      [course_id, classroom_id],
    ),
  );

  return {
    enrolled: enrolledQuery.observe(),
    notEnrolled: notEnrolledQuery.observe(),
  };
};
