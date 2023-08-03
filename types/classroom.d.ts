declare type Classroom = {
  id: number;
  title: string;
  courses: Array<Course>;
  instructor_id: number;
  category_id: number;
  current_course: number;
  label: string;
  type: string;
  sub_type: string;
  description: string;
  prerequisites: string;
  language: string;
  thumbnail: string;
  rating: number;
  weight: number;
  status: string;
  active: boolean;
  accessible: boolean;
  has_admission: boolean;
  admission_status: boolean;
  code: string;
};

declare type Course = {
  id: number;
  classroom_id: number;
  code: string;
  section_id: number;
  name: string;
  description: null | string;
  preview_url: null | string;
  price: number;
  old_price: null | number;
  order: number;
  active: boolean;
  thumbnail: null | string;
  buyable: boolean;
  units: Unit[];
};

declare type Unit = {
  id: number;
  course_id: number;
  name : string;
  test: Test;
};
declare type Test = {
  id: number;
  unit_id: number;
  uuid: string;
  title: string;
  overall_score: number;
  passing_value: number;
  passing_unit: string;
};

declare type EnrolledCourse = {
  id: number;
  user_id: number;
  course_id: number;
  progress: number;
  course: {
    name: string;
    classroom_id: number;
  };
  student: {
    user_id: number;
    user: {
      username: string;
      first_name: string;
      last_name: string;
      phone_number: string;
    };
  };
};
declare type EnrolledClassroom = {
  user_id: number;
  classroom_id: number;
  active: boolean;
  completed_courses: number;
  status: string;
};

declare type EnrolledClassroomResponse = {
  enrolledClassrooms: ApiResponse<EnrolledClassroom[]>;
};

declare type Group = {
  id: number;
  classroom_id: number;
  name: string;
  code: string;
};

declare type TestAttempt = {
  id: number;
  active: boolean;
  grade: string | null;
  status: string | null;
  score: number | null;
  test_id: number;
  student_id: number;
};

declare type TestAttemptsResponse = {
  testAttempts: ApiResponse<TestAttempt[]>;
};
