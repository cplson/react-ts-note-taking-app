import { useNote } from "./NoteLayout";
import { Row, Col, Stack, Badge, Button } from "react-bootstrap";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { Link, useNavigate } from "react-router-dom";

type NoteProps = {
    onDelete: (id: string) => void
}

export function Note({onDelete}: NoteProps) {
    // gets note from NoteLayout
    const note = useNote();
    const navigate = useNavigate();

    return (
        <>
            <Row className="align-items-center mb-4">
                <Col>
                    <h1>{note.title}</h1>
                    {/* if the Note has any tags, displays them */}
                    {note.tags.length > 0 && (
                        <Stack gap={1} direction="horizontal"
                            className="flex-wrap">
                            {note.tags.map(tag => (
                                // text-truncate ensures no text overflow
                                <Badge className="text-truncate" key={tag.id}>{tag.label}</Badge>
                            ))}
                        </Stack>
                    )}
                </Col>
                <Col xs="auto">
                    <Stack gap={2} direction="horizontal">
                        {/* EDIT */}
                        <Link to={`/${note.id}/edit`}>
                            <Button variant="primary">Edit</Button>
                        </Link>
                        {/* DELETE */}
                        <Button onClick={() => {
                            onDelete(note.id);
                            // Navigate to home (NoteList)
                            navigate("/");
                        }}
                        variant="outline-danger">Delete</Button>
                        {/* BACK to home (NoteList) */}
                        <Link to="/">
                            <Button variant="outline-secondary">Back</Button>
                        </Link>

                    </Stack>
                </Col>
            </Row>
            {/* Display Note body */}
            <ReactMarkdown>{note.markdown}</ReactMarkdown>
        </>
    )
}