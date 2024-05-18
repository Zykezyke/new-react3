import logo from "./logo.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloud, faHeart, faStar } from "@fortawesome/free-solid-svg-icons";
import { faCloud as outlineCloud } from "@fortawesome/free-solid-svg-icons";
import "./App.css";
import { useState, useEffect } from "react";

const CLIENT_ID = "5bb4c5ead3324edb94176fc8dd9290c1";
const CLIENT_SECRET = "f488baf24f1e4fdbae548c9f65da83e0";

function App() {
  const [music, setMusic] = useState([]);
  const [playlist, setPlaylist] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredMusic, setFilteredMusic] = useState([]);
  const [sortOption, setSortOption] = useState("");
  const randomInitialPosition = Math.random();

  useEffect(() => {
    const sortedMusic = [...filteredMusic].sort((a, b) => {
      switch (sortOption) {
        case "nameaz":
          return (a.name ?? "").localeCompare(b.name ?? "");
        case "nameza":
          return (b.name ?? "").localeCompare(a.name ?? "");
        case "artist":
          return (a.artists[0].name ?? "").localeCompare(
            b.artists[0].name ?? ""
          );
        case "popularityup":
          return a.popularity - b.popularity;
        case "popularitydown":
          return b.popularity - a.popularity;
        default:
          return 0;
      }
    });

    if (!arraysAreEqual(sortedMusic, filteredMusic)) {
      setFilteredMusic(sortedMusic);
    }
  }, [sortOption, filteredMusic]);

  function arraysAreEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) {
      return false;
    }
    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i] !== arr2[i]) {
        return false;
      }
    }
    return true;
  }

  useEffect(() => {
    if (searchQuery === "") {
      setFilteredMusic(music);
    } else {
      const filtered = music.filter((music) => {
        if (music.name && music.artist) {
          return (
            music.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            music.artists[0].name
              .toLowerCase()
              .includes(searchQuery.toLowerCase())
          );
        }
        return false;
      });
      setFilteredMusic(filtered);
    }
  }, [searchQuery, music]);

  const addToPlaylist = (music) => {
    if (!playlist.some((m) => m.id === music.id)) {
      setPlaylist([...playlist, music]);
    }
  };

  const removeFromPlaylist = (music) => {
    setPlaylist(playlist.filter((m) => m.id !== music.id));
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  return (
    <div>
      <NavigationBar>
        <Logo />
        <Search setMusic={setMusic} />
        <NumResult music={filteredMusic} />
      </NavigationBar>
      <Title />
      <SortDropdown handleSortChange={handleSortChange} />
      <Main>
        <Box title={"Music List"} subtitle={'"Music itself is my very life"'}>
          <Music
            music={filteredMusic}
            playlist={playlist}
            addToPlaylist={addToPlaylist}
            removeFromPlaylist={removeFromPlaylist}
          />
        </Box>
        <Box
          title={"Playlist"}
          subtitle={'"You alone are my music"'}
          playlist={"Playlist"}
        >
          <Playlist playlist={playlist} />
        </Box>
      </Main>
      <div
        className="clouds"
        style={{ "--random-initial-position": randomInitialPosition }}
      ></div>
    </div>
  );
}

function NavigationBar({ children }) {
  return <div className="topnav-container">{children}</div>;
}

function Logo() {
  return (
    <h1 className="quicksand-bold-logo" style={{ textAlign: "center" }}>
      <span className="icon-container">
        <FontAwesomeIcon icon={outlineCloud} className="outline-icon" />
        <FontAwesomeIcon icon={faCloud} className="filled-icon" />
      </span>{" "}
      Clouds and the Summer Sky
    </h1>
  );
}

function NumResult({ music }) {
  return (
    <p className="quicksand-medium">
      Found <strong>{music.length}</strong> results
    </p>
  );
}

function Search({ setMusic }) {
  const [query, setQuery] = useState("");
  const [accessToken, setAccessToken] = useState("");

  useEffect(() => {
    const authParameter = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body:
        "grant_type=client_credentials&client_id=" +
        CLIENT_ID +
        "&client_secret=" +
        CLIENT_SECRET,
    };
    fetch("https://accounts.spotify.com/api/token", authParameter)
      .then((result) => result.json())
      .then((data) => setAccessToken(data.access_token))
      .catch((error) => console.error("Error fetching access token:", error));
  }, []);

  async function search() {
    if (!query) {
      setMusic([]);
      return;
    }

    console.log("Searching for " + query);
    const trackParameters = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
    };

    try {
      const response = await fetch(
        "https://api.spotify.com/v1/search?q=" + query + "&type=track&limit=50",
        trackParameters
      );
      const data = await response.json();
      if (data.tracks && data.tracks.items) {
        setMusic(data.tracks.items);
      } else {
        setMusic([]);
      }
    } catch (error) {
      console.error("Error fetching tracks:", error);
      setMusic([]);
    }
  }

  return (
    <input
      className="search"
      type="text"
      placeholder="Search music..."
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          search();
        }
      }}
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}

function Title() {
  return (
    <div className="container-title">
      <h1 className="quicksand-bold-logo-title">Clouds and The Summer Sky</h1>
      <h3 className="quicksand-bold-subtitle">Fly and soar with music</h3>
    </div>
  );
}

function Box({ children, title, subtitle }) {
  return (
    <div className="container-box">
      <h2 className="quicksand-bold-title">{title}</h2>
      <h3 className="quicksand-semibold-title">{subtitle}</h3>
      <hr className="subtitle-divider" />
      {children}
    </div>
  );
}

function Music({ music, playlist, addToPlaylist, removeFromPlaylist }) {
  const togglePlaylist = (music) => {
    if (playlist.some((m) => m.id === music.id)) {
      removeFromPlaylist(music);
    } else {
      addToPlaylist(music);
    }
  };

  const PopularityRating = ({ popularity }) => {
    const stars = Math.ceil(popularity / 20); // 0 to 5 stars based on popularity
    return (
      <span style={{ fontSize: 25 }}>
        {[...Array(stars)].map((_, i) => (
          <FontAwesomeIcon key={i} icon={faStar} />
        ))}
      </span>
    );
  };

  if (music.length === 0) {
    return (
      <p className="quicksand-medium">
        No music found. Search for different music.
      </p>
    );
  }

  return (
    <ul>
      {music.map((music) => (
        <li key={music.id} className="quicksand-semibold-music">
          <img src={music.album.images[0].url} alt="Album" width={300} />
          <br />
          <h1 className="quicksand-bold-music-title">{music.name}</h1>
          <br />
          <h4 className="quicksand-medium-music-album">{music.album.name}</h4>
          <br />
          <h2 className="quicksand-medium-music-artist">
            {music.artists[0].name}
          </h2>
          <br />
          <button
            className={playlist.some((m) => m.id === music.id) ? "liked" : ""}
            onClick={() => togglePlaylist(music)}
          >
            {playlist.some((m) => m.id === music.id) ? (
              <FontAwesomeIcon icon={faHeart} className="blue-heart" />
            ) : (
              <FontAwesomeIcon icon={faHeart} className="white-heart" />
            )}
          </button>
          &nbsp; <PopularityRating popularity={music.popularity} />
        </li>
      ))}
    </ul>
  );
}
function Playlist({ playlist }) {
  if (playlist.length === 0) {
    return (
      <p className="quicksand-medium">
        Your playlist is empty. Start adding some music!
      </p>
    );
  }

  return (
    <ul className="quicksand-semibold-music">
      {playlist.map((music) => (
        <li key={music.id}>
          <img src={music.album.images[0].url} alt="Album" width={300} />
          <br />
          <FontAwesomeIcon icon={faHeart} className="blue-heart" />
          {"   "}
          <h1 className="quicksand-bold-music-title">{music.name}</h1>
          <h4 className="quicksand-medium-music-album">{music.album.name}</h4>
          <h2 className="quicksand-medium-music-artist">
            {music.artists[0].name}
          </h2>
        </li>
      ))}
    </ul>
  );
}

function Main({ children }) {
  return (
    <div>
      <div
        className="container-main"
        style={{ overflowY: "auto", height: "80vh" }}
      >
        {children}
      </div>
    </div>
  );
}

function SortDropdown({ handleSortChange }) {
  return (
    <div className="container-sort">
      <label className="quicksand-semibold-sort">Sort By: </label>
      <select
        id="sort"
        className="quicksand-bold-select"
        onChange={handleSortChange}
      >
        <option className="quicksand-semibold" value="nameaz">
          Title (A-Z)
        </option>
        <option className="quicksand-semibold" value="nameza">
          Title (Z-A)
        </option>
        <option className="quicksand-semibold" value="artist">
          Artist
        </option>
        <option className="quicksand-semibold" value="popularityup">
          Popularity ↑
        </option>
        <option className="quicksand-semibold" value="popularitydown">
          Popularity ↓
        </option>
      </select>
    </div>
  );
}

export default App;
