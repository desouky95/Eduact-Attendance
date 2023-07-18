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
