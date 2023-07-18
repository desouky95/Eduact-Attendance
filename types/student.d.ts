type InstructorCode = {
  id: number;
  student_id: number;
  instructor_id: number;
  code: string;
  group_name: string;
  student: Student;
};

type Student = {
  user_id: number;
  education_type_id: number;
  education_language_id: number;
  education_section_id: number;
  education_year_id: number;
  school: string;
  ssn: string | null;
  parent_relation: string;
  parent_phone: string;
  profile_complete: boolean;
  registration_paid: boolean;
  user: User;
};
