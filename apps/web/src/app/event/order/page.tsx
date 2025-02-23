'use client';

import { useRouter } from 'next/router';

const OrderTicket: React.FC = () => {
  const router = useRouter();
  const { slug } = router.query;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };
  return (
    <div className="flex flex-col p-4 border-2 border-red-500">
      <button
        className="btn btn-outline btn-success w-1/6 mb-4"
        onClick={() =>
          (document.getElementById('order') as HTMLDialogElement)?.showModal()
        }
      >
        Order Ticket
      </button>

      <dialog id="order" className="modal">
        <div className="modal-box">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
          <div className="flex flex-col gap-5 items-center">
            <h1 className="text-2xl font-bold">Order Ticket</h1>
            <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
              <label className="form-control w-full max-w-xs">
                <div className="label">
                  <span className="label-text">How Many Ticket</span>
                </div>
                <input
                  type="text"
                  name="amount"
                  placeholder="Amount of Ticket"
                  className="input input-bordered w-full max-w-xs"
                />
              </label>

              <br />

              <button className="btn btn-success w-1/6">
                Proceed To The Next Step
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};
