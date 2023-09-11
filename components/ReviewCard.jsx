import React, { useState } from "react";
import { useAuthContext } from "./context/AuthContext";
import * as Dialog from "@radix-ui/react-dialog";
import app from "../firebase/config";
import { getFirestore, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { Close, Edit, Delete } from "@mui/icons-material";
const db = getFirestore(app);

export const ReviewCard = ({ title, body, userId, reviewId }) => {
  const { user } = useAuthContext();
  const [newTitle, setNewTitle] = useState(title);
  const [newBody, setNewBody] = useState(body);

  async function updateReview() {
    const docRef = doc(db, "reviews", reviewId);

    await updateDoc(docRef, {
      title: newTitle,
      body: newBody,
    });
  }

  async function deleteReview() {
    await deleteDoc(doc(db, "reviews", reviewId));
  }

  return (
    <Dialog.Root>
      <div className="p-4 rounded-lg border border-slate-300 mb-4">
        <h4 className="text-ellipsis flex justify-between items-center font-bold text-2xl mb-4">
          {title}
          {user && user.uid === userId ? (
            <div className="flex items-center">
              <Dialog.Trigger>
                <button className="flex items-center">
                  <Edit style={{ color: "orange" }}></Edit>
                </button>
              </Dialog.Trigger>
              <button onClick={deleteReview} className="flex items-center">
                <Delete style={{ color: "red" }}></Delete>
              </button>
            </div>
          ) : null}
        </h4>
        <p className="bg-slate-100 p-4 rounded-lg">{body}</p>
      </div>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-blackA9 data-[state=open]:animate-overlayShow fixed inset-0" />
        <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
          <Dialog.Title className="text-yellow-600 m-0 text-xl font-medium mb-4">
            Add Review
          </Dialog.Title>
          {/*           <Dialog.Description className="text-mauve11 mt-[10px] mb-5 text-[15px] leading-normal">
            Make changes to your profile here. Click save when you're done.
          </Dialog.Description> */}
          <div className="flex flex-col">
            <label className="font-semibold">Review Title</label>
            <input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              type="text"
              className="border rounded-md p-2"></input>
          </div>
          <div className="flex flex-col">
            <label className="font-semibold">Review Body</label>
            <textarea
              value={newBody}
              onChange={(e) => setNewBody(e.target.value)}
              type="text"
              className="border rounded-md p-2"></textarea>
          </div>

          <div className="mt-[25px] flex justify-end">
            <Dialog.Close asChild>
              <button
                onClick={updateReview}
                className="bg-green4 text-green11 hover:bg-green5 focus:shadow-green7 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none focus:shadow-[0_0_0_2px] focus:outline-none">
                Update Review
              </button>
            </Dialog.Close>
          </div>
          <Dialog.Close asChild>
            <button
              className="text-violet11 hover:bg-violet4 focus:shadow-violet7 absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
              aria-label="Close">
              <Close />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
