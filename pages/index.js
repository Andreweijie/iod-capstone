import Image from "next/image";
import { Inter } from "next/font/google";
import { PlaceCard } from "@/components/PlaceCard";
import { Search } from "@mui/icons-material";
import Select from "react-select";
import { useAuthContext } from "@/components/context/AuthContext";
import { useEffect, useState } from "react";
import { getPlacesData, updateLikes } from "@/firebase/firestore";
import Head from "next/head";

const areas = [
  { value: "North", label: "North" },
  { value: "Central", label: "Central" },
  { value: "East", label: "East" },
  { value: "West", label: "West" },
];

const placeTypes = [
  { value: "FnB", label: "FnB" },
  { value: "Vet", label: "Vet" },
  { value: "Pet Store", label: "Pet Store" },
];

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const { user } = useAuthContext();
  const [places, setPlaces] = useState([]);
  const [areaFilter, setAreaFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [searchFilter, setSearchFilter] = useState("");
  const [placesSearched, setPlacesSearched] = useState([]);

  useEffect(() => {
    (async () => {
      const data = await getPlacesData();
      setPlaces(data);
      setPlacesSearched(data);
    })();
  }, []);

  useEffect(() => {
    if (searchFilter.length > 0) {
      const filtered = places.filter((place) => {
        return place.name.toLowerCase().includes(searchFilter.toLowerCase());
      });
      setPlacesSearched(filtered);
    } else {
      setPlacesSearched(places);
    }
  }, [searchFilter]);

  useEffect(() => {
    setPlacesSearched(places);
  }, [places]);

  const handleTypeChange = (newValue, action) => {
    if (action.action === "select-option") {
      setTypeFilter(newValue.value);
    } else if (action.action === "clear") {
      setTypeFilter("");
    }
  };

  const handleAreaChange = (newValue, action) => {
    if (action.action === "select-option") {
      setAreaFilter(newValue.value);
    } else if (action.action === "clear") {
      setAreaFilter("");
    }
  };

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

  let placesFiltered = placesSearched.filter((place) => {
    if (areaFilter === "" && typeFilter === "") {
      return true;
    } else if (areaFilter === "" && typeFilter !== "") {
      return place.placeType === typeFilter;
    } else if (typeFilter === "" && areaFilter !== "") {
      return place.area === areaFilter;
    } else {
      return place.placeType === typeFilter && place.area === areaFilter;
    }
  });

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-start p-2 pt-4 md:p-24 md:pt-12 ${inter.className}`}>
      <Head>
        <title>Singapaw</title>
      </Head>
      <div className="flex flex-col md:flex-row justify-between w-11/12 items-center mb-8">
        <div>
          <div className="flex mb-4">
            <div>
              <label className="font-semibold">Type Of Place</label>
              <Select
                theme={(theme) => ({
                  ...theme,
                  colors: {
                    ...theme.colors,
                    primary25: "#d4c050",
                    primary: "#debd04",
                  },
                })}
                className="basic-single mr-4"
                classNamePrefix="select"
                onChange={handleTypeChange}
                isDisabled={false}
                isLoading={false}
                isClearable={true}
                isRtl={false}
                isSearchable={false}
                name="color"
                options={placeTypes}
              />
            </div>
            <div>
              <label className="font-semibold">Area</label>
              <Select
                theme={(theme) => ({
                  ...theme,
                  colors: {
                    ...theme.colors,
                    primary25: "#cc4557",
                    primary: "#e83559",
                  },
                })}
                className="basic-single"
                classNamePrefix="select"
                isDisabled={false}
                isLoading={false}
                isClearable={true}
                isRtl={false}
                isSearchable={false}
                onChange={handleAreaChange}
                name="color"
                options={areas}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end">
          <Search style={{ color: "orange" }} />
          <input
            id="search-filter"
            className="ml-2 bg-slate-200 p-1 rounded-md"
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}></input>
        </div>
      </div>
      <div className="place-grid grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 w-full justify-items-center items-start">
        {places.length !== 0
          ? placesFiltered.map((place) => (
              <PlaceCard
                {...place}
                toggleLike={toggleLike}
                key={place.placeId}></PlaceCard>
            ))
          : null}
      </div>
    </main>
  );
}
