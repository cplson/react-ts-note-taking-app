import { useMemo } from 'react'
import { Routes, Route, Navigate } from "react-router-dom";
import { Container } from "react-bootstrap";
import {useLocalStorage} from "./useLocalStorage";
import {v4 as uuidV4} from "uuid";
import "bootstrap/dist/css/bootstrap.min.css";

import { NewNote } from './NewNote';
import {NoteList} from './NoteList';

// CUSTOM TYPE DEFINITIONS
export type Note = {
  id: string
} & NoteData

export type RawNote = {
  id: string
} & RawNoteData

export type RawNoteData = {
  title: string,
  markdown: string,
  tagIds: string[]
}

export type NoteData = {
  title: string,
  markdown: string,
  tags: Tag[]
}

export type Tag = {
  id: string,
  label: string
}
// END CUSTOM TYPE DEFINITIONS

function App() {

  // useLocalStorage is a custom hook that uses useState and:
  //  - takes in a label and an initialValue
  //  - returns a generic type <T>
  const [notes, setNotes] = useLocalStorage<RawNote[]>('NOTES', []);
  const [tags, setTags] = useLocalStorage<Tag[]>('TAGS', []);

  //  -useMemo is a React Hook that lets you 
  //    cache the result of a calculation between re-renders.
  //    see: https://react.dev/reference/react/useMemo for details

  // converts RawNote -> Note
  const notesWithTags = useMemo(() => {
    // for every note thats in our list of RawNotes
    return notes.map(note => {
      // return that note as is + its list of tags that is defined by...
      return {
        ...note, 
        // ...every Tag(tag.id) in the Tag list of the RawNote(tagIds)
        tags: tags.filter(tag => note.tagIds.includes(tag.id))
      }
    })
  }, [notes, tags])

  // handles RawNote creation to add Note to the Note list
  // - takes an object of type NoteData
  function onCreateNote({tags, ...data}: NoteData){
    // set Notes based on previous notes
    setNotes(prevNotes => {
      return [
        // return the previous Note list and append the new Note to the end of the list
        //  * the new Note is comprised of:
        //    - all of the NoteData.data
        //    - a unique id of uuid
        //    - a list of all of the tagIds of the tag list passed into the function
        ...prevNotes, 
        {...data, id: uuidV4(), tagIds: tags.map(tag => tag.id)}
      ]
    })
  }

  // Adds a Tag to Tag list in local storage and update state
  function addTag(tag: Tag){
    setTags(prev => [...prev, tag]);
  }

  return (
    // Wrap contents of the App in a bootstrap Container and give it 
    // top and bottom margin of 4px
    <Container className="my-4">
      {/* Define all routes using react-router-dom */}
      <Routes>
        <Route path="/" element={<NoteList notes={notesWithTags} availableTags={tags}/>} />
        <Route path="/new" 
          element={<NewNote onSubmit={onCreateNote} 
          onAddTag={addTag}
          availableTags={tags}
          />} />
        <Route path="/:id">
          <Route index element={<h1>Show</h1>} />
          <Route path="edit" element={<h1>Edit</h1>} />
        </Route>
        {/* For any endpoint that does not match a defined 
          route, use <Navigate> to redirect to home */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Container>
  )
}

export default App
