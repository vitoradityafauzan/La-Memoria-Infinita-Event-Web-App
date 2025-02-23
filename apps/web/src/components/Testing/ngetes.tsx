import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css'; // Import the styles for React-Quill

// Dynamically import React-Quill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

// Define initial form values and validation schema using Yup
interface FormValues {
  name: string;
  image: File | null;
  date: string;
  time: string;
  description: string;
}

const initialValues: FormValues = {
  name: '',
  image: null,
  date: '',
  time: '',
  description: '', // Rich Text Field
};

const validationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  image: Yup.mixed().required('Image is required'),
  date: Yup.string().required('Date is required'),
  time: Yup.string().required('Time is required'),
  description: Yup.string().required('Description is required'),
});

const FormPage: React.FC = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [description, setDescription] = useState<string>(''); // State for Rich Text Editor

  const handleSubmit = (values: FormValues) => {
    // Include the current description from ReactQuill in form submission
    values.description = description;
    console.log(values);
    // Handle form submission logic here
  };

  return (
    <div className="container">
      <h1>Extended Form with Rich Text</h1>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue, values }) => (
          <Form>
            {/* Text Input */}
            <div>
              <label htmlFor="name">Name</label>
              <Field type="text" name="name" placeholder="Enter your name" />
              <ErrorMessage
                name="name"
                component="div"
                className="text-red-500"
              />
            </div>

            {/* Image Input */}
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

                  // Image preview
                  if (file) {
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

            {/* Image Preview */}
            {imagePreview && (
              <div>
                <h4>Image Preview</h4>
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{
                    width: '200px',
                    height: '200px',
                    objectFit: 'cover',
                  }}
                />
              </div>
            )}

            {/* Date Input */}
            <div>
              <label htmlFor="date">Date</label>
              <Field type="date" name="date" />
              <ErrorMessage
                name="date"
                component="div"
                className="text-red-500"
              />
            </div>

            {/* Time Input */}
            <div>
              <label htmlFor="time">Time</label>
              <Field type="time" name="time" />
              <ErrorMessage
                name="time"
                component="div"
                className="text-red-500"
              />
            </div>

            {/* Rich Text (React-Quill) */}
            <div>
              <label htmlFor="description">Description</label>
              <ReactQuill
                value={values.description} // Bind value to Formik state
                onChange={(content) => setFieldValue('description', content)} // Update Formik state
                theme="snow"
              />
              <ErrorMessage
                name="description"
                component="div"
                className="text-red-500"
              />
            </div>
            {/* <div>
              <label htmlFor="description">Description</label>
              <ReactQuill
                value={description}
                onChange={setDescription}
                theme="snow"
              />
              <ErrorMessage name="description" component="div" className="text-red-500" />
            </div> */}

            <button type="submit">Submit</button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default FormPage;
