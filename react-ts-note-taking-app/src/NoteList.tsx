import { Form, Stack, Row, Col, Button, Card, Badge, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import ReactSelect from 'react-select';
import { useState, useMemo } from 'react';
import { Tag } from "./App";
import styles from "./NoteList.module.css";

type SimplifiedNote = {
    tags: Tag[]
    title: string
    id: string
}
type NoteListProps = {
    availableTags: Tag[]
    notes: SimplifiedNote[]
    onDeleteTag: (id: string) => void
    onUpdateTag: (id: string, label: string) => void
}
type EditTagsModalProps = {
    show: boolean
    availableTags: Tag[]
    handleClose: () => void
    onDeleteTag: (id: string) => void
    onUpdateTag: (id: string, label: string) => void
}

export function NoteList({ availableTags, notes, onUpdateTag, onDeleteTag }: NoteListProps) {
    const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
    const [title, setTitle] = useState("");
    const [editTagsModalIsOpen, setEditTagsModalIsOpen] = useState(false);

    // this useMemo just filters our notList from NoteListProps
    // that matches the search criteria for both title and selectedTags
    // NOTE: the video really helps to visualize whats going on,
    //       so don't get overwhelmed by the complexity
    const filteredNotes = useMemo(() => {
        // loop through every note and filter for notes that...
        return notes.filter(note => {
            // ...matches the title input
            return (title === "" || note.title.toLowerCase().includes(title.toLowerCase())) &&
                (selectedTags.length === 0 ||
                    // also filter by...
                    // loop through selectedTags to
                    // check that every tag in the selector matches for..
                    selectedTags.every(tag =>
                        // ...each note to be filtered
                        note.tags.some(noteTag => noteTag.id === tag.id)))
        })
    }, [title, selectedTags, notes])
    return (
        <>
            <Row className="align-items-center mb-4">
                <Col>
                    <h1>Notes</h1>
                </Col>
                <Col xs="auto">
                    <Stack gap={2} direction="horizontal">
                        <Link to="/new">
                            <Button variant="primary">Create</Button>
                        </Link>
                        <Button
                            onClick={() => setEditTagsModalIsOpen(true)}
                            variant="outline-secondary">Edit Tags</Button>
                    </Stack>
                </Col>
            </Row>
            <Form>
                <Row className="mb-4">
                    <Col>
                        <Form.Group>
                            <Form.Label>Title</Form.Label>
                            <Form.Control type="text" value={title}
                                onChange={e => setTitle(e.target.value)} />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId="tags">
                            <Form.Label>Tags</Form.Label>
                            {/* 
                                CreatableReactSelect comes from react-select
                                -isMulti allows for multiple Tags 
                            */}
                            <ReactSelect
                                value={selectedTags.map(tag => {
                                    return { label: tag.label, value: tag.id }
                                })}
                                options={availableTags.map(tag => {
                                    return { label: tag.label, value: tag.id }
                                })}
                                onChange={tags => {
                                    setSelectedTags(tags.map(tag => {
                                        return { label: tag.label, id: tag.value }
                                    }))
                                }}
                                isMulti />
                        </Form.Group>
                    </Col>
                </Row>
            </Form>
            {/* This row will display more columns the larger the screen size */}
            {/* className g-3 indicates there will be a gap of 3 between the inner elements */}
            {/* displays all notes that match the filter criteria if there is any */}
            <Row xs={1} sm={2} lg={3} xl={4} className="g-3">
                {filteredNotes.map(note => (
                    <Col key={note.id}>
                        <NoteCard id={note.id} title={note.title} tags={note.tags} />
                    </Col>
                ))}
            </Row>
            <EditTagsModal
                onUpdateTag={onUpdateTag}
                onDeleteTag={onDeleteTag}
                show={editTagsModalIsOpen}
                handleClose={() => setEditTagsModalIsOpen(false)}
                availableTags={availableTags}
            />
        </>
    )
}

// NoteCard component for each note to be rendered
function NoteCard({ id, title, tags }: SimplifiedNote) {
    return (
        // clicking on the Note, navigates you to this cards details
        <Card as={Link} to={`/${id}`}
            // card is set to height: 100px
            // text-reset sets link color to its parent elements style
            // text-decoration-none removes the underline for the link
            // styles.card applies the styles from NoteList.module.css
            className={`h-100 text-reset text-decoration-none ${styles.card}`}
        >
            <Card.Body>
                <Stack gap={2} className="align-items-center
                    justify-content-center h-100">
                    {/* fs-5: font-size: 5px */}
                    <span className="fs-5">{title}</span>
                    {/* if note has tags, map them */}
                    {tags.length > 0 && (
                        <Stack gap={1} direction="horizontal"
                            className="justify-content-center flex-wrap">
                            {tags.map(tag => (
                                // text-truncate ensures no text overflow
                                <Badge className="text-truncate" key={tag.id}>{tag.label}</Badge>
                            ))}
                        </Stack>
                    )}
                </Stack>
            </Card.Body>
        </Card>
    )
}

function EditTagsModal({ availableTags, handleClose, show, onDeleteTag, onUpdateTag }: EditTagsModalProps) {
    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Edit Tags</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Stack gap={2}>
                        {availableTags.map(tag => (
                            <Row key={tag.id}>
                                <Col>
                                    <Form.Control type="text" value={tag.label}
                                        onChange={e => onUpdateTag(tag.id, e.target.value)}
                                    />
                                </Col>
                                <Col xs="auto">
                                    <Button
                                        variant="outline-danger"
                                        onClick={() => onDeleteTag(tag.id)}
                                    >
                                        &times;
                                    </Button>
                                </Col>
                            </Row>
                        ))}
                    </Stack>
                </Form>
            </Modal.Body>
        </Modal >
    )
}