type CenterAttendance = {
  id: number;
  student_id: number;
  classroom_id: number;
  course_id: number;
  quiz_id: number;
  homework_id: number;
  type: string;
  created_at : string
  course: {
    name: string;
  };
  quiz: [];
  homework: [];
};
