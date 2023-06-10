import { Form, Stack, Row, Col, Button, Card, Badge } from "react-bootstrap";
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
}

export function NoteList({ availableTags, notes }: NoteListProps) {
    const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
    const [title, setTitle] = useState("");

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
                            <Button variant="primary">Primary</Button>
                        </Link>
                        <Button variant="outline-secondary">Edit Tags</Button>
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
        </>
    )
}

function NoteCard({ id, title, tags }: SimplifiedNote) {
    return (
        <Card as={Link} to={`/${id}`}
            className={`h-100 text-reset text-decoration-none ${styles.card}`}
        >
            <Card.Body>
                <Stack gap={2} className="align-items-center
                    justify-content-center h-100">
                    <span className="fs-5">{title}</span>
                    {tags.length > 0 && (
                        <Stack gap={1} direction="horizontal"
                            className="justify-content-center flex-wrap">
                            {tags.map(tag => (
                                <Badge className="text-truncate" key={tag.id}>{tag.label}</Badge>
                            ))}
                        </Stack>
                    )}
                </Stack>
            </Card.Body>
        </Card>
    )
}