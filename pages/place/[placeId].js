import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { ReviewCard } from "@/components/ReviewCard";
import { Rating } from "@smastrom/react-rating";
import { LocalPhone, Language, Map, Add, Close } from "@mui/icons-material";
import * as Dialog from "@radix-ui/react-dialog";
import app from "../../firebase/config";
import {
  getFirestore,
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
} from "firebase/firestore";
import { useAuthContext } from "@/components/context/AuthContext";
import { getPlaceData } from "@/firebase/firestore";

const db = getFirestore(app);

export default function PlacePage() {
  const router = useRouter();
  const { user } = useAuthContext();
  const [placeData, setPlaceData] = useState({
    address: "",
    area: "",
    hours: [],
    image: "",
    mapUrl: "",
    name: "",
    phone: "",
    placeType: "",
    rating: 0,
    website: "",
  });
  const [reviews, setReviews] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [newBody, setNewBody] = useState("");

  async function addReview() {
    await addDoc(collection(db, "reviews"), {
      title: newTitle,
      body: newBody,
      placeId: router.query.placeId,
      userId: user.uid,
    });
  }

  useEffect(() => {
    const { placeId } = router.query;
    (async () => {
      const data = await getPlaceData(placeId);
      setPlaceData(data);
    })();
    const q = query(collection(db, "reviews"), where("placeId", "==", placeId));

    const unsub = onSnapshot(q, (querySnapshot) => {
      let reviewData = [];
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots

        reviewData.push({ ...doc.data(), reviewId: doc.id });
      });
      setReviews(reviewData);
    });

    return unsub;
  }, []);

  let {
    name,
    address,
    area,
    hours,
    image,
    mapUrl,
    phone,
    placeType,
    rating,
    website,
  } = placeData;

  return (
    <Dialog.Root>
      <div className="p-8 pt-4 md:p-24 md:pt-8 flex flex-col items-center">
        <div className="flex justify-center flex-col md:flex-row">
          <div className="md:w-2/6 md:m-16 mb-8">
            <img className="rounded-lg mb-4" src={image}></img>
            <div className="p-8 border border-slate-300 rounded-lg">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-3xl mb-2">{name}</h2>
                <div className="w-1/4 flex justify-end">
                  <a target="_blank">
                    <LocalPhone
                      className="ml-4"
                      style={{ color: "#3cde5a" }}></LocalPhone>
                  </a>
                  <a target="_blank" href={website}>
                    <Language
                      className="ml-4"
                      style={{ color: "#4a95e0" }}></Language>
                  </a>
                </div>
              </div>
              <div className="w-2/4 md:w-1/4 mb-4">
                <Rating value={rating}></Rating>
              </div>
              <div className="bg-slate-200 rounded-lg p-2 mb-4 flex justify-between">
                {address}
                <a target="_blank" href={mapUrl}>
                  <Map style={{ color: "#e86c2e" }}></Map>
                </a>
              </div>
              <div className="mb-4">
                <span className="text-yellow-800 font-semibold bg-yellow-200 p-1 pl-2 pr-2 text-sm rounded-lg mr-2">
                  {placeType}
                </span>
                <span className="text-red-800 font-semibold bg-red-200 p-1 pl-2 pr-2 text-sm rounded-lg">
                  {area}
                </span>
              </div>

              <div className="flex flex-col">
                {hours.map((timing, index) => (
                  <span key={index} className="flex justify-between">
                    <span>{timing.day}</span>
                    {`${timing.start}-${timing.end}`}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="md:w-2/6 md:m-16">
            <h2 className="font-bold text-4xl mb-4 text-yellow-500 flex items-center justify-between">
              REVIEWS
              {user ? (
                <Dialog.Trigger>
                  <button className="bg-yellow-200 text-lg font-semibold p-2 rounded-lg flex items-center">
                    <Add></Add>
                    Add Review
                  </button>
                </Dialog.Trigger>
              ) : (
                <div></div>
              )}
            </h2>
            {reviews.map((review) => (
              <ReviewCard key={review.reviewId} {...review}></ReviewCard>
            ))}
          </div>
        </div>
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
                disabled={!newTitle || !newBody}
                onClick={addReview}
                className="disabled:opacity-50 disabled:bg-slate-200 bg-green4 text-green11 hover:bg-green5 focus:shadow-green7 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none focus:shadow-[0_0_0_2px] focus:outline-none">
                Add Review
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
}
