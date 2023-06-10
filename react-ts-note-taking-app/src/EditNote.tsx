import { NoteForm } from "./NoteForm"
import { NoteData, Tag } from "./App"
import { useNote } from "./NoteLayout"

// in order to recieve the EditNoteProps as a prop
// we need to define the custom type
type EditNoteProps = {
    onSubmit: (id: string, data: NoteData) => void
    onAddTag: (tag: Tag) => void
    availableTags: Tag[]
}
export function EditNote({ onSubmit, onAddTag, availableTags }: EditNoteProps) {
    // gets the context (note) from NoteLayout
    const note = useNote();
    return (
        <>
            <h1 className="mb-4">Edit Note</h1>
            <NoteForm
                title={note.title}
                markdown={note.markdown}
                tags={note.tags}
                onSubmit={data => onSubmit(note.id, data)}
                onAddTag={onAddTag}
                availableTags={availableTags}
            />
        </>
    )
}