import * as yup from 'yup';

export const bookValidationSchema = yup.object().shape({
  title: yup.string().required(),
  author: yup.string().required(),
  publication_year: yup.number().integer(),
  organization_id: yup.string().nullable(),
});
