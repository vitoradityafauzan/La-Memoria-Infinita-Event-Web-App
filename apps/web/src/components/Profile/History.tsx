'use client';

import { EventPost, FormEventCreate } from '@/type/event';
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from 'formik';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import 'react-quill/dist/quill.snow.css';
import dynamic from 'next/dynamic';
import { useContextGlobal } from '@/context/Context';
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const EventCreateSchema = yup.object().shape({
  name: yup.string().required('Event Name Required'),
  desc: yup.string().required('Description is required'),
  price: yup.number().required('Price is required'),
  amount: yup.number().required('Ticket amount is required'),
  startDate: yup.date().required('Time Required'),
  location: yup.date().required('Location Required'),
  category: yup.date().required('Category Required'),
});

const FormCreateEvent: React.FC = () => {
  // State For Form
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [location, setLocations] = useState<string[]>([]);
  const [category, setCategories] = useState<string[]>([]);
  const [time, setTime] = useState<Date>();

  // Global state setting
  const { categories, locations, fetchCategoriesLocations } =
    useContextGlobal();

  useEffect(() => {
    if (!categories && !locations) {
      
      fetchCategoriesLocations();

      console.log('Search component = ', categories);
      
    }
  }, [categories, locations, fetchCategoriesLocations]);

  const handleSubmit = async (
    data: FormEventCreate,
    action: FormikHelpers<FormEventCreate>,
  ) => {
    try {
      // const {result, ok} = await postEvent(data)

      // if (!ok)
      //     throw result.msg;

      // toast.success(result.msg);
      //   data.desc = description;

      console.log(data);

      toast.success('data success');

      action.resetForm();
    } catch (err) {
      console.log(err);

      toast.error(err as String);
    }
  };

  return (
    <div className="border-4 grow">
      <Formik
        initialValues={{
          name: '',
          slug: '',
          desc: '',
          image: '',
          price: 0,
          amount: 0,
          locationId: 0,
          categoryId: 0,
          startDate: '',
          endDate: '',
          startTime: '',
          endTime: '',
        }}
        validationSchema={EventCreateSchema}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue, values }) => {
          return (
            <Form>
              <div className="flex flex-col gap-8">
                {imagePreview ? (
                  <div className="grow m-4 h-96 border-4 border-dashed">
                    <Image
                      src={imagePreview}
                      alt="No Image"
                      width={0}
                      height={0}
                      sizes="100vw"
                      className="w-full h-full"
                    />
                  </div>
                ) : (
                  <div className="w-9/12 h-56 border-4 border-dashed">
                    No Image
                  </div>
                )}
                <div>
                  <label htmlFor="image">Upload Image</label>
                  <input
                    type="file"
                    id="image"
                    name="image"
                    accept="image/*"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      setFieldValue('image', file);

                      if (file) {
                        console.log(file);
                        
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setImagePreview(reader.result as string);
                        };
                        reader.readAsDataURL(file);
                      } else {
                        setImagePreview(null);
                      }
                    }}
                  />
                  <ErrorMessage
                    name="image"
                    component="div"
                    className="text-red-500"
                  />
                </div>
                <div>
                  <label htmlFor="name">Name</label>
                  <Field
                    type="text"
                    name="name"
                    placeholder="Enter the name of the event"
                  />
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="text-red-500"
                  />
                </div>
                <div className="w-10/12 h-fit p-4">
                  <label htmlFor="desc">Description</label>
                  <ReactQuill
                    value={values.desc}
                    onChange={(content) => {
                      setFieldValue('desc', content);
                    }}
                    theme="snow"
                  />
                  <ErrorMessage
                    name="desc"
                    component="div"
                    className="text-red-500"
                  />
                </div>
                <div>
                  <label htmlFor="startDate">Start Date</label>
                  <Field type="startDate" name="startDate" />
                  <ErrorMessage
                    name="startDate"
                    component="div"
                    className="text-red-500"
                  />
                </div>

                <div>
                  <label htmlFor="endDate">End Date</label>
                  <Field type="endDate" name="endDate" />
                  <ErrorMessage
                    name="endDate"
                    component="div"
                    className="text-red-500"
                  />
                </div>

                <div>
                  <label htmlFor="startTime">Open Time</label>
                  <Field type="startTime" name="startTime" />
                  <ErrorMessage
                    name="startTime"
                    component="div"
                    className="text-red-500"
                  />
                </div>

                <div>
                  <label htmlFor="endTime">Close Time</label>
                  <Field type="endTime" name="endTime" />
                  <ErrorMessage
                    name="endTime"
                    component="div"
                    className="text-red-500"
                  />
                </div>

                {/* Category Select Here */}

                <button type="submit">Submit</button>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default FormCreateEvent;
