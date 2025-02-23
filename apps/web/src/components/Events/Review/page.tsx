'use client';
import { useContextGlobal } from '@/context/Context';
import { getMyEvent, getMyEvent2, postReview, postVoucher } from '@/lib/event';
import { CreateReview, CreateVoucher } from '@/type/event';
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from 'formik';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import * as yup from 'yup';

const Review: React.FC = () => {
  // Global state setting
  const { userData, fetchUser } = useContextGlobal();
  // State for event data
  const [events, setEvents] = useState<any[] | null>(null);

  useEffect(() => {
    if (!userData) {
      fetchUser();
    } else {
      // Fetch events by user when userData is available
      const fetchEvents = async () => {
        try {
          const fetchedEvents = await getMyEvent();
          setEvents(fetchedEvents);
        } catch (error) {
          console.error('Error fetching events:', error);
        }
      };

      fetchEvents();
    }
  }, [userData, fetchUser]);

  const VoucherSchema = yup.object().shape({
    review: yup.number().required('Review Is Required!'),
  });

  // Form Submit handler
  const handleSubmit = async (
    data: CreateReview,
    action: FormikHelpers<CreateReview>,
  ) => {
    try {
      const { result } = await postReview(data);

      if (result.status == 'error') {
        throw result.msg;
      } else {
        toast.success(result.msg);
      }

      action.resetForm();
    } catch (err) {
      console.log(err);
      toast.error(err as String);
    }
  };

  return (
    <div className="grow p-5">
      {userData && (
        <Formik
          initialValues={{
            userId: userData.id,
            eventId: 0,
            review: 0
          }}
          validationSchema={VoucherSchema}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue, values }) => {
            return (
              <Form className="flex flex-col gap-5">
                <h1 className="text-xl font-bold">
                  Welcome, {userData.firstName} {userData.lastName}
                </h1>
                {events ? (
                  <div className="flex gap-5 items-center">
                    <label htmlFor="eventId">Choose The Event</label>
                    <select
                      className="select w-full max-w-xs border-2"
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                        setFieldValue('eventId', Number(e.target.value));
                      }}
                      value={values.eventId}
                    >
                      <option value="">Select Event</option>
                      {events!.map((e: any) => (
                        <option key={e.idEvent} value={e.idEvent}>
                          {e.name}
                        </option>
                      ))}
                    </select>
                    <ErrorMessage
                      name="userId"
                      component="div"
                      className="text-red-500"
                    />
                  </div>
                ) : (
                  <div className="flex gap-5 items-center">
                    <label htmlFor="userId">Choose Event</label>
                    <select
                      className="select w-full max-w-xs border-2"
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                        setFieldValue('userId', Number(e.target.value));
                      }}
                      value={values.eventId}
                    >
                      <option value="">Select Event</option>
                    </select>
                    <ErrorMessage
                      name="userId"
                      component="div"
                      className="text-red-500"
                    />
                  </div>
                )}
                <div className='flex gap-5 items-center'>
                  <label htmlFor="review">Set Review</label>
                  <Field type="number" name="review" max="5" min="1" className="input input-bordered w-full max-w-xs" />
                  <ErrorMessage
                    name="review"
                    component="div"
                    className="text-red-500"
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-outline btn-warning w-40 mx-auto mt-5"
                >
                  Submit
                </button>
              </Form>
            );
          }}
        </Formik>
      )}
    </div>
  );
};

export default Review;
