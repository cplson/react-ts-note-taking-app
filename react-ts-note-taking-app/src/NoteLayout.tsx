import { Navigate, useParams, Outlet, useOutletContext } from "react-router-dom";
import {Note} from "./App";

type NoteLayoutProps = {
    notes: Note[]
}

export function NoteLayout({notes}: NoteLayoutProps) {
    // useParams is a custom hook from react-router-dom
    // its able to grab a parameter from the url endpoint
    const {id} = useParams();
    // search the Notes list and set note to the one with a matching id
    const note = notes.find(n => n.id === id);

    // if the note doesn't exist, return to home
    if(note == null) return <Navigate to="/" replace />

    // returns the appropriate Route component depending on the context (note)
    return <Outlet context={note} />
}

// this helper function just returns the context from the Outlet component
// so it can be accessed from the appropriate Route component in App
export function useNote(){
    return useOutletContext<Note>()
}