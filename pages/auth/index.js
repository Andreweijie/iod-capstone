import { Login } from "@/components/auth/Login";
import { Signup } from "@/components/auth/Signup";
import React, { useState } from "react";
import { useRouter } from "next/router";
import { useAuthContext } from "@/components/context/AuthContext";

export default function signUpOrLogIn() {
  const router = useRouter();
  const { user } = useAuthContext();

  React.useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user]);

  if (user) {
    return null;
  }
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="shadow-2xl flex flex-col md:flex-row">
        <Signup></Signup>
        <Login></Login>
      </div>
    </div>
  );
}
