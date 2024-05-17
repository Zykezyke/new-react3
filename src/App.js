import logo from "./logo.svg";
import "./App.css";
import { useState } from "react";

const CLIENT_ID = "5bb4c5ead3324edb94176fc8dd9290c1";
const CLIENT_SECRET = "f488baf24f1e4fdbae548c9f65da83e0";

function App() {
  const [music, setMusic] = useState([]);
  return (
    <div>
      <NavigationBar>
        <NumResult music={music} />
      </NavigationBar>
      <Main>
        <Box title={"Music List"}>
          <Music music={music} />
        </Box>
        <Box title={"Playlist"}>
          <Playlist />
        </Box>
      </Main>
    </div>
  );
}

function NavigationBar({ children }) {
  return (
    <nav className="container">
      {" "}
      <Logo />
      <Search />
      {children}
    </nav>
  );
}

function Logo() {
  return <h1 style={{ textAlign: "center" }}>Music App</h1>;
}

function NumResult({ music }) {
  return (
    <p>
      Found <strong>{music.length}</strong> results
    </p>
  );
}

function Search() {
  const [query, setQuery] = useState("");
  const [accessToken, setAccessToken] = useState("");

  var authParameter = {
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
  fetch("https://accounts.spotify.com/api/token", authParameter).then(
    (result) => result.json().then((data) => console.log(data.access_token))
  );

  async function search() {
    console.log("Searching for " + query);
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

// function MusicListBox({ music }) {
//   return (
//     <div className="container">
//       <h2>Music List</h2>
//       <Music music={music} />
//     </div>
//   );
// }

function Box({ title, children }) {
  return (
    <div className="container">
      <h2>{title}</h2>
      {children}
    </div>
  );
}

function Music({ music }) {
  return (
    <ul>
      {music.map((music) => (
        <li key={music.id}>
          {music.title} by {music.artist} ({music.genre})<button>♥️</button>
        </li>
      ))}
    </ul>
  );
}

// function PlaylistBox() {
//   return (
//     <div className="container">
//       <h2>Playlist</h2>
//       <Playlist />
//     </div>
//   );
// }

function Playlist() {
  const [playlist, setPlaylist] = useState([]);
  const addToPlaylist = (music) => {
    setPlaylist([...playlist, music]);
  };
  return (
    <ul>
      {playlist.map((music) => (
        <li key={music.id}>
          {music.title} by {music.artist}
          <p>
            <span>⭐</span>
            <span>{music.rating}</span>
          </p>
        </li>
      ))}
    </ul>
  );
}

function Main({ children }) {
  return (
    <div>
      <div className="container"></div>
      <div className="container">{children}</div>
    </div>
  );
}

export default App;

//stateful component
//stateless component
//structural component
