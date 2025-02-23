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
import { postEvent } from '@/lib/event';
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const EventCreateSchema = yup.object().shape({
  name: yup.string().required('Event Name Required'),
  desc: yup.string().required('Description is required'),
  price: yup.number().required('Price is required'),
  amount: yup.number().required('Ticket amount is required'),
  startDate: yup.date().required('Start Date is required'),
  endDate: yup.date().required('End Date is required'),
  startTime: yup.string().required('Start Time is required'),
  endTime: yup.string().required('End Time is required'),
  locationId: yup.number().required('Location is required'),
  categoryId: yup.number().required('Category is required'),
});

const FormCreateEvent: React.FC = () => {
  // State For Form
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isPaid, setIsPaid] = useState(false);

  // Global state setting
  const { categories, locations, fetchCategoriesLocations } =
    useContextGlobal();
  useEffect(() => {
    if (!categories && !locations) {
      fetchCategoriesLocations();

      console.log('Search component = ', categories);
    }
  }, [categories, locations, fetchCategoriesLocations]);

  // Slug creation
  const createSlug = (title: string): string => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

  // Form Submit handler
  const handleSubmit = async (
    data: FormEventCreate,
    action: FormikHelpers<FormEventCreate>,
  ) => {
    try {
      const { result } = await postEvent(data);

      if (result.status == 'error') {
        throw result.msg;
      } else {
        toast.success(result.msg);
      }

      // console.log(data);
      // toast.success('data success');

      action.resetForm();
    } catch (err) {
      console.log(err);
      toast.error(err as String);
    }
  };

  // useEffect(() => {
  //   const {locations, categories} = await getLocationAndCategory
  // })

  return (
    <div className="grow p-5">
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
                {/* Image */}
                <div className='flex items-center gap-5'>
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
                        // console.log(file);

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
                {/* {imagePreview && (
                  <div className="w-fit h-fit">
                    <h1>Preview</h1>
                    <Image src={imagePreview} alt="No Image" width={0} height={0} sizes='100vw' className='w-9/12 h-36' />
                  </div>
                )} */}

                {/* Name */}
                <div className='flex items-center gap-5'>
                  <label htmlFor="name">Name</label>
                  <input
                    type="text"
                    name="name"
                    className="input input-bordered w-full max-w-xs"
                    value={values.name}
                    placeholder="Enter the name of the event"
                    onChange={(e: React.FormEvent<HTMLInputElement>) => {
                      setFieldValue('name', e.currentTarget.value);
                      setFieldValue('slug', createSlug(e.currentTarget.value));
                    }}
                  />
                  {/* <Field
                    type="text"
                    name="name"
                    placeholder="Enter the name of the event"
                    onChange={(e: React.FormEvent<HTMLInputElement>) => {
                      setFieldValue('slug', e.currentTarget.value)
                    }}
                  /> */}
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="text-red-500"
                  />
                </div>

                {/* Slug */}
                <div>
                  <input
                    type="text"
                    name="slug"
                    value={values.slug}
                    readOnly
                    disabled
                  />
                </div>

                {/* Description */}
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

                {/* <div className='w-10/12 h-fit p-4'>
                    <label htmlFor="desc">Description</label>
                    <ReactQuill
                        value={description}
                        onChange={setDescription}
                        theme="snow"
                    />
                    <ErrorMessage
                        name="desc"
                        component="div"
                        className="text-red-500"
                    />
                </div> */}

                {/* Set Ticket Price */}
                <div className="form-control w-4/12">
                  <label className="label cursor-pointer">
                    <span className="label-text">Is This Paid Event</span>
                    <input
                      type="checkbox"
                      checked={isPaid}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setIsPaid(e.target.checked);

                        if (!e.target.checked) {
                          setFieldValue('price', 0);
                        }
                      }}
                      className="checkbox"
                    />
                  </label>
                </div>

                {isPaid && (
                  <div className='flex items-center gap-5'>
                    <label htmlFor="price">Set Price</label>
                    <Field type="number" name="price" className="input input-bordered w-full max-w-xs" />
                    <ErrorMessage
                      name="price"
                      component="div"
                      className="text-red-500"
                    />
                  </div>
                )}

                {/* Maximum Attendees */}
                <div className='flex items-center gap-5'>
                  <label htmlFor="amount">Set Maximum Attendees</label>
                  <Field type="number" name="amount" className="input input-bordered w-full max-w-xs" />
                  <ErrorMessage
                    name="amount"
                    component="div"
                    className="text-red-500"
                  />
                </div>

                {/* Start Date */}
                <div className='flex items-center gap-5'>
                  <label htmlFor="startDate">Start Date</label>
                  <Field type="date" name="startDate" />
                  <ErrorMessage
                    name="startDate"
                    component="div"
                    className="text-red-500"
                  />
                </div>

                {/* End Date */}
                <div className='flex items-center gap-5'>
                  <label htmlFor="endDate">End Date</label>
                  <Field type="date" name="endDate" />
                  <ErrorMessage
                    name="endDate"
                    component="div"
                    className="text-red-500"
                  />
                </div>

                {/* Start Time */}
                <div className='flex items-center gap-5'>
                  <label htmlFor="startTime">Open Time</label>
                  <Field type="time" name="startTime" />
                  <ErrorMessage
                    name="startTime"
                    component="div"
                    className="text-red-500"
                  />
                </div>

                {/* End Time */}
                <div  className='flex items-center gap-5'>
                  <label htmlFor="endTime">Close Time</label>
                  <Field type="time" name="endTime" />
                  <ErrorMessage
                    name="endTime"
                    component="div"
                    className="text-red-500"
                  />
                </div>

                {/* Category Select */}
                <div>
                  <label htmlFor="categoryId">Category</label>
                  <select
                    className="select w-full max-w-xs border-2"
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                      setFieldValue('categoryId', Number(e.target.value));
                    }}
                    value={values.categoryId}
                  >
                    <option value="">Select Category</option>
                    {categories!.map((cat: any) => (
                      <option key={cat.idCategory} value={cat.idCategory}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  <ErrorMessage
                    name="categoryId"
                    component="div"
                    className="text-red-500"
                  />
                </div>

                {/* <div>
                  <label htmlFor="categoryId">Category</label>
                  <Field
                    as="select"
                    name="categoryId"
                    className="border p-2"
                    value={values.categoryId}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                      setFieldValue('categoryId', Number(e.target.value));
                    }}
                  >
                    <option value="">Select Category</option>
                    {categories &&
                      categories.map((category: any) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                  </Field>
                  <ErrorMessage
                    name="categoryId"
                    component="div"
                    className="text-red-500"
                  />
                </div> */}

                {/* Location Select */}
                <div>
                  <label htmlFor="locationId">Location</label>
                  <select
                    className="select w-full max-w-xs border-2"
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                      setFieldValue('locationId', Number(e.target.value));
                    }}
                    value={values.locationId}
                  >
                    <option value="">Select Location</option>
                    {locations!.map((lot: any) => (
                      <option key={lot.idLocation} value={lot.idLocation}>
                        {lot.name}
                      </option>
                    ))}
                  </select>
                  <ErrorMessage
                    name="categoryId"
                    component="div"
                    className="text-red-500"
                  />
                </div>

                {/* <div>
                  <label htmlFor="locationId">Location</label>
                  <Field
                    as="select"
                    name="locationId"
                    className="border p-2"
                    value={values.locationId}
                    onChange={(e: any) => {
                      setFieldValue('locationId', Number(e.target.value));
                    }}
                  >
                    <option value="">Select Location</option>
                    {locations &&
                      locations.map((location: any) => (
                        <option key={location.id} value={location.id}>
                          {location.name}
                        </option>
                      ))}
                  </Field>
                  <ErrorMessage
                    name="locationId"
                    component="div"
                    className="text-red-500"
                  />
                </div> */}

                <button type="submit" className="btn btn-outline btn-warning w-40 mx-auto mt-5">Submit</button>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default FormCreateEvent;
