import {object, string} from 'yup';

export const LoginSchema = object({
  identifier: string()
    .required('Email / Phone is required')
    .test(
      'identifier',
      'Email / Phone is invalid',
      value => validateEmail(value) || validatePhone(value),
    ),
  password: string().required(),
});

const validateEmail = (email?: string) =>
  string().email('Invalid e-mail').isValidSync(email);
const validatePhone = (phone?: string) =>
  string()
    .matches(/^01[0125][0-9]{8}$/gm, {message: 'Invalid phone'})
    .isValidSync(phone);
