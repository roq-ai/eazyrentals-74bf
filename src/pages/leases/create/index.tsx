import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { createLease } from 'apiSdk/leases';
import { Error } from 'components/error';
import { leaseValidationSchema } from 'validationSchema/leases';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { LandlordInterface } from 'interfaces/landlord';
import { PropertyInterface } from 'interfaces/property';
import { getLandlords } from 'apiSdk/landlords';
import { getProperties } from 'apiSdk/properties';
import { LeaseInterface } from 'interfaces/lease';

function LeaseCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: LeaseInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createLease(values);
      resetForm();
      router.push('/leases');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<LeaseInterface>({
    initialValues: {
      name: '',
      description: '',
      landlord_id: (router.query.landlord_id as string) ?? null,
      property_id: (router.query.property_id as string) ?? null,
    },
    validationSchema: leaseValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Create Lease
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="name" mb="4" isInvalid={!!formik.errors?.name}>
            <FormLabel>Name</FormLabel>
            <Input type="text" name="name" value={formik.values?.name} onChange={formik.handleChange} />
            {formik.errors.name && <FormErrorMessage>{formik.errors?.name}</FormErrorMessage>}
          </FormControl>
          <FormControl id="description" mb="4" isInvalid={!!formik.errors?.description}>
            <FormLabel>Description</FormLabel>
            <Input type="text" name="description" value={formik.values?.description} onChange={formik.handleChange} />
            {formik.errors.description && <FormErrorMessage>{formik.errors?.description}</FormErrorMessage>}
          </FormControl>
          <AsyncSelect<LandlordInterface>
            formik={formik}
            name={'landlord_id'}
            label={'Select Landlord'}
            placeholder={'Select Landlord'}
            fetcher={getLandlords}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.name}
              </option>
            )}
          />
          <AsyncSelect<PropertyInterface>
            formik={formik}
            name={'property_id'}
            label={'Select Property'}
            placeholder={'Select Property'}
            fetcher={getProperties}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.name}
              </option>
            )}
          />
          <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
            Submit
          </Button>
        </form>
      </Box>
    </AppLayout>
  );
}

export default compose(
  requireNextAuth({
    redirectTo: '/',
  }),
  withAuthorization({
    service: AccessServiceEnum.PROJECT,
    entity: 'lease',
    operation: AccessOperationEnum.CREATE,
  }),
)(LeaseCreatePage);
