import React from "react";
import { UserCard } from "./UserCard";
import { useAuthContext } from "./context/AuthContext";
import { getAuth, signOut } from "firebase/auth";
import app from "../firebase/config";
import { Pets } from "@mui/icons-material";
import Link from "next/link";

const auth = getAuth(app);

export const Navbar = () => {
  const { user } = useAuthContext();
  return (
    <div className="w-full bg-yellow-300 p-4 pl-28 pr-28 flex items-center justify-between">
      <h2 className="font-bold text-yellow-800 flex items-center">
        <Link href="/">
          <Pets className="mr-2"></Pets>SINGAPAW
        </Link>
      </h2>
      {user ? (
        <div className="w-1/4 justify-end flex">
          <UserCard />
          <button
            className="ml-4 p-1 pl-2 pr-2 text-yellow-600 bg-white font-semibold rounded-lg"
            onClick={() => signOut(auth)}>
            Logout
          </button>
        </div>
      ) : (
        <div className="w-1/4 flex justify-end">
          <Link
            href={"/auth"}
            className="bg-yellow-300 text-yellow-900 font-bold rounded-lg p-1 pl-2 pr-2">
            Sign Up / Log In
          </Link>
        </div>
      )}
    </div>
  );
};
