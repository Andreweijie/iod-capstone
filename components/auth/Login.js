import React, { useState } from "react";
import app from "../../firebase/config";
import { signInWithEmailAndPassword, getAuth } from "firebase/auth";
import { useRouter } from "next/router";
const auth = getAuth(app);

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  async function logIn() {
    console.log(email);
    console.log(password);
    let result = null,
      error = null;
    try {
      result = await signInWithEmailAndPassword(auth, email, password);
      console.log(result);
      router.push("/");
    } catch (e) {
      error = e;
    }
  }
  return (
    <div className="p-16 rounded-r-lg flex flex-col justify-between items-center bg-yellow-300">
      <h2 className="font-bold text-2xl pb-4">Login</h2>
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
      <button className="p-2 rounded-md font-bold pl-8 pr-8" onClick={logIn}>
        Login
      </button>
    </div>
  );
};
