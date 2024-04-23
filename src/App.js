import logo from "./logo.svg";
import "./App.css";
import { useState } from "react";
const tempMusicData = [
  {
    id: 1,
    title: "Song 1",
    artist: "Artist A",
    genre: "Pop",
  },
  {
    id: 2,
    title: "Song 2",
    artist: "Artist B",
    genre: "Rock",
  },
  {
    id: 3,
    title: "Song 3",
    artist: "Artist C",
    genre: "Jazz",
  },
];
const tempPlaylist = [
  {
    id: 1,
    title: "Song 1",
    artist: "Artist A",
    genre: "Pop",
    rating: 4,
  },
  {
    id: 2,
    title: "Song 2",
    artist: "Artist B",
    genre: "Rock",
    rating: 3,
  },
  {
    id: 3,
    title: "Song 3",
    artist: "Artist C",
    genre: "Jazz",
    rating: 5,
  },
];

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
  return (
    <input
      className="search"
      type="text"
      placeholder="Search music..."
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
  const [playlist, setPlaylist] = useState(tempPlaylist);
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
function App() {
  const [music, setMusic] = useState(tempMusicData);
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

export default App;

//stateful component
//stateless component
//structural component
