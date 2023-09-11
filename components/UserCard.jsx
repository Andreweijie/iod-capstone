import React from "react";
import { Favorite } from "@mui/icons-material";
import Link from "next/link";

export const UserCard = () => {
  return (
    <Link
      href="/user/123"
      className="shadow-2xl bg-red-200 p-1 pl-2 pr-2 rounded-lg text-red-800 font-semibold">
      <Favorite className="mr-1"></Favorite>Favourites
    </Link>
  );
};
