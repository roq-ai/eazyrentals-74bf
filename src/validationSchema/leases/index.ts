import * as yup from 'yup';

export const leaseValidationSchema = yup.object().shape({
  name: yup.string().required(),
  description: yup.string(),
  landlord_id: yup.string().nullable(),
  property_id: yup.string().nullable(),
});
