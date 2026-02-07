import React, { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Note from "./Note";
import CreateArea from "./CreateArea";

function App() {
  const [noteList, setNewNote] = useState([]);
  function addNote(inputNote) {
    setNewNote((prevNotes) => {
      return [...prevNotes, inputNote];
    });
  }
  function deleteNote(id) {
    setNewNote((prevNotes) => {
      return prevNotes.filter((item, index) => {
        return index !== id;
      });
    });
  }
  return (
    <div>
      <Header />
      <CreateArea onClick={addNote} />
      {noteList.map((note, index) => (
        <Note
          key={index}
          id={index}
          title={note.title}
          content={note.content}
          onClick={deleteNote}
        />
      ))}
      ;
      <Footer />
    </div>
  );
}

export default App;
