import { useNote } from "./NoteLayout";
import { Row, Col, Stack, Badge } from "react-bootstrap";

export function Note() {
    const note = useNote();

    return (
        <>
            <Row className="align-items-center mb-4">
                <Col>
                    <h1>{note.title}</h1>
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
            </Row>
        </>
    )
}