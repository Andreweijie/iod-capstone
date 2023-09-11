import { PlaceCard } from "@/components/PlaceCard";
import { useRouter } from "next/router";
import { useAuthContext } from "@/components/context/AuthContext";
import { useState, useEffect } from "react";
import { getPlacesData, updateLikes } from "@/firebase/firestore";

export default function Page() {
  const { user } = useAuthContext();
  const router = useRouter();
  const [places, setPlaces] = useState([]);
  useEffect(() => {
    if (!user) {
      router.push("/");
    }
  }, [user]);

  useEffect(() => {
    (async () => {
      const data = await getPlacesData();
      setPlaces(data);
    })();
  }, []);

  async function toggleLike(placeId) {
    let placeIndex = places.findIndex((place) => placeId === place.placeId);
    let placeToUpdate = { ...places[placeIndex] };
    let newLikes = [...placeToUpdate.likes];

    const isUserInLikes = newLikes.indexOf(user.uid);
    if (isUserInLikes == -1) {
      newLikes.push(user.uid);
    } else {
      newLikes.splice(isUserInLikes, 1);
    }
    placeToUpdate.likes = newLikes;

    let placesCopy = [...places];
    placesCopy.splice(placeIndex, 1, placeToUpdate);

    setPlaces(placesCopy);

    await updateLikes(placeId, newLikes);
  }

  return (
    <div className="p-24">
      <div className="grid grid-cols-4 gap-8 w-full justify-items-center">
        {places
          .filter((place) => place.likes.includes(user.uid))
          .map((place) => (
            <PlaceCard
              {...place}
              toggleLike={toggleLike}
              key={place.placeId}></PlaceCard>
          ))}
      </div>
    </div>
  );
}
