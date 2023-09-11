import {
  getFirestore,
  collection,
  getDocs,
  doc,
  updateDoc,
  addDoc,
  getDoc,
} from "firebase/firestore";
import app from "./config";

const db = getFirestore(app);

export async function getPlacesData() {
  const querySnapshot = await getDocs(collection(db, "places"));
  let placesData = [];
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots

    placesData.push({ ...doc.data(), placeId: doc.id });
  });
  return placesData;
}

export async function updateLikes(placeId, newLikes) {
  const placeRef = doc(db, "places", placeId);

  await updateDoc(placeRef, {
    likes: newLikes,
  });
}

export async function getPlaceData(placeId) {
  const docRef = doc(db, "places", placeId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    console.log(docSnap.data());
    return docSnap.data();
  } else {
    // docSnap.data() will be undefined in this case
    console.log("No such document!");
  }
}
