import axios from "axios";
import { useEffect, useState } from "react";
import type { Character } from "./types/Character";
import type { CharacterDetails } from "./types/CharacterDetails";
import type { Homeworld } from "./types/Homeworld";
import Login from "./auth/Login";
import { isAuthenticated } from "./auth/Auth";
import { logout } from "./auth/Auth";

const App = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [speciesMap, setSpeciesMap] = useState<Record<string, string>>({});
  const [url, setUrl] = useState<string>("https://swapi.tech/api/people");
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(
    null,
  );
  const [characterDetails, setCharacterDetails] =
    useState<CharacterDetails | null>(null);
  const [homeworld, setHomeworld] = useState<Homeworld | null>(null);
  const [nextUrl, setNextUrl] = useState<string>("");
  const [prevUrl, setPrevUrl] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [errors, setErrors] = useState<string>("");
  const [search, setSearch] = useState<string>("");

  const fetchCharacterDetails = async (url: string) => {
    try {
      const res = await axios.get(url);
      const data = res.data.result.properties;

      setCharacterDetails(data);

      // homeworld API call
      fetchHomeworld(data.homeworld);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchHomeworld = async (url: string) => {
    try {
      const res = await axios.get(url);

      setHomeworld(res.data.result.properties);
    } catch (err) {
      console.log(err);
    }
  };

  const formatDate = (date: string) => {
    const d = new Date(date);

    return `${String(d.getDate()).padStart(2, "0")}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getFullYear())}`;
  };

  const speciesColors: Record<string, string> = {
    Human: "bg-blue-50 border-blue-400",

    Droid: "bg-gray-100 border-gray-400",

    Wookie: "bg-amber-50 border-amber-400",

    Rodian: "bg-green-50 border-green-400",

    Hutt: "bg-yellow-50 border-yellow-400",

    "Yoda's species": "bg-purple-50 border-purple-400",

    Trandoshan: "bg-red-50 border-red-400",

    "Mon Calamari": "bg-cyan-50 border-cyan-400",

    Ewok: "bg-orange-50 border-orange-400",

    Sullustan: "bg-pink-50 border-pink-400",
  };

  const getCardColor = (speciesName: string) => {
    return speciesColors[speciesName] || "bg-slate-50 border-slate-300";
  };

  const filteredCharacters = characters.filter((char) => {
    return char.name.toLowerCase().includes(search.toLowerCase());
  });

  useEffect(() => {
    const fetchSpecies = async () => {
      const map: Record<string, string> = {};
      const res = await axios.get("https://swapi.tech/api/species");
      // console.log(res.data.results);

      for (const species of res.data.results) {
        const detail = await axios.get(species.url);
        const peopleUrls = detail.data.result.properties.people;
        // console.log(species.name, peopleUrls);

        for (const peopleUrl of peopleUrls) {
          map[peopleUrl] = species.name;
        }
      }
      // console.log(map);
      setSpeciesMap(map);
    };
    const fetchData = async () => {
      try {
        const res = await axios.get(url);
        console.log(res.data);

        setCharacters(res.data.results);
        setNextUrl(res.data.next);
        setPrevUrl(res.data.previous);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setErrors(err.message);
        } else {
          setErrors("Something went wrong!");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    fetchSpecies();
  }, [url]);

  if (!isAuthenticated()) {
    return <Login />;
  }

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-slate-100">
        <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-5 text-xl font-semibold text-gray-700">
          Loading Characters...
        </p>
      </div>
    );
  }

  // Error State
  if (errors) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-red-50">
        <div className="bg-white shadow-xl rounded-xl p-8 text-center">
          <h2 className="text-3xl font-bold text-red-600">Oops!</h2>
          <p className="text-gray-600 mt-3">{errors}</p>
        </div>
      </div>
    );
  }

  const handleNextClick = () => {
    if (!nextUrl) return;

    setLoading(true);
    setUrl(nextUrl);
  };

  const handlePrevClick = () => {
    if (!prevUrl) return;

    setLoading(true);
    setUrl(prevUrl);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-gray-100 to-slate-200 p-8">
      <div className="flex justify-between items-center mb-12">
        <div className="w-24" /> {/* left spacer, right button jitni width */}
        <h1 className="text-5xl font-extrabold text-center text-gray-800 tracking-wide">
          ⭐ Star Wars Characters
        </h1>
        <button
          onClick={() => {
            logout();
            window.location.reload();
          }}
          className="flex items-center gap-2 bg-white hover:bg-red-50 text-gray-700 hover:text-red-600 font-semibold px-4 py-2 rounded-xl shadow-md border border-gray-200 hover:border-red-300 transition-all duration-200"
        >
          🚪 Logout
        </button>
      </div>

      <div className="flex justify-center mb-8">
        <input
          type="text"
          placeholder="Search character..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="
w-96
px-5
py-3
rounded-xl
border
shadow
focus:outline-none
focus:ring-2
focus:ring-indigo-500
"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredCharacters.map((char) => (
          <div
            key={char.uid}
            onClick={() => {
              setSelectedCharacter(char);
              fetchCharacterDetails(char.url);
            }}
            className={`
   rounded-2xl
    shadow-lg
    p-4
    border-2
    cursor-pointer
    transition-all
    duration-300
    hover:scale-105
    hover:-translate-y-2
    hover:shadow-2xl
    active:scale-95
    group
    ${getCardColor(speciesMap[char.url] || "Human")}
    ${selectedCharacter?.uid === char.uid ? "ring-4 ring-indigo-500" : ""}
 `}
          >
            <div className="overflow-hidden rounded-lg">
              <img
                className="
      w-full
      h-60
      object-cover
      transition-transform
      duration-500
      group-hover:scale-110
    "
                src={`https://picsum.photos/300/300?${Math.random()}`}
                alt={char.name}
              />
            </div>

            <div className="p-5">
              <h2
                className="
    text-xl
    font-bold
    mt-4
    transition-colors
    duration-300
    group-hover:text-blue-600
  "
              >
                {char.name}
              </h2>
              <p className="mt-2 font-semibold">
                Species: {speciesMap[char.url] || "Human"}
              </p>

              <p
                className="
    text-gray-500
    mt-2
    transition-colors
    duration-300
    group-hover:text-gray-700
  "
              >
                Character ID: {char.uid}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center items-center gap-5 mt-12">
        <button
          onClick={handlePrevClick}
          disabled={!prevUrl}
          className={`px-8 py-3 rounded-xl font-semibold text-white transition-all duration-300 ${
            !prevUrl
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700 hover:scale-105"
          }`}
        >
          ⬅ Previous
        </button>

        <button
          onClick={handleNextClick}
          disabled={!nextUrl}
          className={`px-8 py-3 rounded-xl font-semibold text-white transition-all duration-300 ${
            !nextUrl
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700 hover:scale-105"
          }`}
        >
          Next ➡
        </button>
      </div>

      {selectedCharacter && (
        <div
          className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4"
          onClick={() => {
            setSelectedCharacter(null);
            setCharacterDetails(null);
          }}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-indigo-600 px-6 py-5">
              <h2 className="text-2xl font-bold text-white">
                {characterDetails ? characterDetails.name : "Loading..."}
              </h2>
            </div>

            {/* Body */}
            <div className="p-6">
              {!characterDetails ? (
                <div className="flex justify-center py-8">
                  <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <>
                  <div className="space-y-3">
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-gray-500 font-medium">Height</span>
                      <span className="font-semibold text-gray-800">
                        {Number(characterDetails.height) / 100} m
                      </span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-gray-500 font-medium">Mass</span>
                      <span className="font-semibold text-gray-800">
                        {characterDetails.mass} kg
                      </span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-gray-500 font-medium">
                        Added Date
                      </span>
                      <span className="font-semibold text-gray-800">
                        {formatDate(characterDetails.created)}
                      </span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-gray-500 font-medium">Films</span>
                      <span className="font-semibold text-gray-800">
                        {characterDetails.films?.length ?? 0}
                      </span>
                    </div>
                    <div className="flex justify-between pb-2">
                      <span className="text-gray-500 font-medium">
                        Birth Year
                      </span>
                      <span className="font-semibold text-gray-800">
                        {characterDetails.birth_year}
                      </span>
                    </div>
                  </div>

                  {homeworld && (
                    <div className="mt-5 border-t pt-4">
                      <h3 className="text-lg font-bold text-indigo-600 mb-3">
                        🌍 Homeworld
                      </h3>

                      <div className="space-y-3">
                        <div className="flex justify-between border-b pb-2">
                          <span className="text-gray-500 font-medium">
                            Name
                          </span>
                          <span className="font-semibold text-gray-800">
                            {homeworld.name}
                          </span>
                        </div>

                        <div className="flex justify-between border-b pb-2">
                          <span className="text-gray-500 font-medium">
                            Terrain
                          </span>
                          <span className="font-semibold text-gray-800">
                            {homeworld.terrain}
                          </span>
                        </div>

                        <div className="flex justify-between border-b pb-2">
                          <span className="text-gray-500 font-medium">
                            Climate
                          </span>
                          <span className="font-semibold text-gray-800">
                            {homeworld.climate}
                          </span>
                        </div>

                        <div className="flex justify-between pb-2">
                          <span className="text-gray-500 font-medium">
                            Residents
                          </span>
                          <span className="font-semibold text-gray-800">
                            {homeworld.residents?.length ?? 0}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}

              <button
                onClick={() => {
                  setSelectedCharacter(null);
                  setCharacterDetails(null);
                  setHomeworld(null);
                }}
                className="mt-6 w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-2.5 rounded-xl transition-colors duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
