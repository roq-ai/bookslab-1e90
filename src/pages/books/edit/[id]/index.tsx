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
  Center,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useFormik, FormikHelpers } from 'formik';
import { getBookById, updateBookById } from 'apiSdk/books';
import { Error } from 'components/error';
import { bookValidationSchema } from 'validationSchema/books';
import { BookInterface } from 'interfaces/book';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { OrganizationInterface } from 'interfaces/organization';
import { getOrganizations } from 'apiSdk/organizations';

function BookEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<BookInterface>(
    () => (id ? `/books/${id}` : null),
    () => getBookById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: BookInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateBookById(id, values);
      mutate(updated);
      resetForm();
      router.push('/books');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<BookInterface>({
    initialValues: data,
    validationSchema: bookValidationSchema,
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
            Edit Book
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {formError && (
          <Box mb={4}>
            <Error error={formError} />
          </Box>
        )}
        {isLoading || (!formik.values && !error) ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <FormControl id="title" mb="4" isInvalid={!!formik.errors?.title}>
              <FormLabel>Title</FormLabel>
              <Input type="text" name="title" value={formik.values?.title} onChange={formik.handleChange} />
              {formik.errors.title && <FormErrorMessage>{formik.errors?.title}</FormErrorMessage>}
            </FormControl>
            <FormControl id="author" mb="4" isInvalid={!!formik.errors?.author}>
              <FormLabel>Author</FormLabel>
              <Input type="text" name="author" value={formik.values?.author} onChange={formik.handleChange} />
              {formik.errors.author && <FormErrorMessage>{formik.errors?.author}</FormErrorMessage>}
            </FormControl>
            <FormControl id="publication_year" mb="4" isInvalid={!!formik.errors?.publication_year}>
              <FormLabel>Publication Year</FormLabel>
              <NumberInput
                name="publication_year"
                value={formik.values?.publication_year}
                onChange={(valueString, valueNumber) =>
                  formik.setFieldValue('publication_year', Number.isNaN(valueNumber) ? 0 : valueNumber)
                }
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              {formik.errors.publication_year && <FormErrorMessage>{formik.errors?.publication_year}</FormErrorMessage>}
            </FormControl>
            <AsyncSelect<OrganizationInterface>
              formik={formik}
              name={'organization_id'}
              label={'Select Organization'}
              placeholder={'Select Organization'}
              fetcher={getOrganizations}
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
        )}
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
    entity: 'book',
    operation: AccessOperationEnum.UPDATE,
  }),
)(BookEditPage);
