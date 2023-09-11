import React from "react";
import { Rating } from "@smastrom/react-rating";
import { FavoriteBorder, Favorite, ArrowForward } from "@mui/icons-material";
import { useAuthContext } from "./context/AuthContext";
import Link from "next/link";

export const PlaceCard = ({
  placeId,
  name,
  rating,
  placeType,
  area,
  image,
  likes,
  toggleLike,
}) => {
  const { user } = useAuthContext();
  let placeName = name;
  if (name.length > 25) {
    placeName = name.substring(0, 25) + "...";
  }
  let likedByUser = user ? likes.includes(user.uid) : false;
  return (
    <div className="rounded-lg shadow-2xl w-96 h-72 border border-slate-200">
      <img className="place-card-image rounded-t-lg" src={`${image}`}></img>
      <div className="p-4">
        <div className="flex justify-between mb-2">
          <h3 className="font-bold text-xl">{placeName}</h3>
          {user ? (
            <button onClick={() => toggleLike(placeId)}>
              {likes ? (
                likedByUser ? (
                  <Favorite style={{ color: "red" }} />
                ) : (
                  <FavoriteBorder style={{ color: "red" }} />
                )
              ) : null}
            </button>
          ) : null}
        </div>
        <div className="w-28 mb-2">
          <Rating value={rating} readOnly></Rating>
        </div>
        <div className="flex justify-between items-center mt-4">
          <div>
            <span className="text-yellow-800 font-semibold bg-yellow-200 p-1 pl-2 pr-2 text-sm rounded-lg mr-2">
              {placeType}
            </span>
            <span className="text-red-800 font-semibold bg-red-200 p-1 pl-2 pr-2 text-sm rounded-lg">
              {area}
            </span>
          </div>
          <Link
            href={`/place/${placeId}`}
            className="flex justify-between bg-yellow-300 text-yellow-900 font-bold rounded-lg p-1 pl-2 pr-2">
            More <ArrowForward className="ml-2" />
          </Link>
        </div>
      </div>
    </div>
  );
};
