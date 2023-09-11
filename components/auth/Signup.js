import React, { useState } from "react";
import * as Toast from "@radix-ui/react-toast";
import app from "../../firebase/config";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { getFirestore, setDoc, doc } from "firebase/firestore";
const auth = getAuth(app);
const db = getFirestore(app);

export const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [open, setOpen] = React.useState(false);

  async function signUp() {
    let result = null,
      error = null;
    try {
      result = await createUserWithEmailAndPassword(auth, email, password);
    } catch (e) {
      error = e;
    }
    if (result) {
      console.log(result.user.uid);
      await setDoc(doc(db, "users", result.user.uid), {
        email: result.user.email,
      });
      setOpen(true);
      setEmail("");
      setPassword("");
    }
  }
  return (
    <Toast.Provider>
      <div className="p-16 rounded-l-lg flex flex-col justify-between items-center">
        <h2 className="font-bold text-2xl pb-4">Sign Up</h2>
        <div className="flex flex-col pb-4">
          <label className="font-bold">Email</label>
          <input
            className="border-2 p-2 rounded-md border-yellow-300"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}></input>
        </div>
        <div className="flex flex-col pb-4">
          <label className="font-bold">Password</label>
          <input
            className="border-2 p-2 rounded-md border-yellow-300"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}></input>
        </div>
        <button
          className="bg-yellow-400 p-2 rounded-md font-bold pl-8 pr-8"
          onClick={signUp}>
          Sign Up
        </button>
      </div>
      <Toast.Root
        open={open}
        onOpenChange={setOpen}
        className="bg-green-400 rounded-md shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] p-[15px] grid [grid-template-areas:_'title_action'_'description_action'] grid-cols-[auto_max-content] gap-x-[15px] items-center data-[state=open]:animate-slideIn data-[state=closed]:animate-hide data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=cancel]:translate-x-0 data-[swipe=cancel]:transition-[transform_200ms_ease-out] data-[swipe=end]:animate-swipeOut">
        <Toast.Title className="[grid-area:_title] mb-[5px] font-medium text-slate12 text-[15px]">
          Account Created!
        </Toast.Title>
        <Toast.Description className="[grid-area:_description] m-0 text-slate11 text-[13px] leading-[1.3]">
          You can now log in!
        </Toast.Description>
      </Toast.Root>
      <Toast.Viewport className="[--viewport-padding:_25px] fixed bottom-0 right-0 flex flex-col p-[var(--viewport-padding)] gap-[10px] w-[390px] max-w-[100vw] m-0 list-none z-[2147483647] outline-none" />
    </Toast.Provider>
  );
};
