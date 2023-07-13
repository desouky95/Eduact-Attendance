declare type Classroom = {
  id: number;
  title: string;
  courses: Array<Course>;
};

declare type Course = {
  id: number;
  classroom_id: number;
  code: string;
};
