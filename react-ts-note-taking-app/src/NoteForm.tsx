import { Form, Stack, Row, Col, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { FormEvent, useRef, useState } from "react";
import CreatableReactSelect from "react-select/creatable";
import {v4 as uuidV4} from "uuid";
import { NoteData, Tag } from './App'


// custom data type used to define what onSubmit is for TS
// which is a function that:
//   -takes a parameter - data of type NoteData
//   -returns nothing
type NoteFormProps = {
    onSubmit: (data: NoteData) => void
    onAddTag: (tag: Tag) => void
    availableTags: Tag[]
}

// NoteForm component takes in a prop:
//  - onSubmit - a function of custom type NoteFormProps
export function NoteForm({ onSubmit, onAddTag, availableTags }: NoteFormProps) {

    // useRefs are local state hooks that will only reload the component when changed
    // titleRef is a useref hook that takes in a HTMLInputElement
    // markdownRef is a useref hook that takes in a HTMLTextAreaElement
    const titleRef = useRef<HTMLInputElement>(null)
    const markdownRef = useRef<HTMLTextAreaElement>(null)

    // useState hook that takes in an array of our custom Tag type
    const [selectedTags, setSelectedTags] = useState<Tag[]>([]);

    const navigate = useNavigate()


    function handleSubmit(e: FormEvent) {
        e.preventDefault();

        // userefvalue.current.value refers to the 
        // current value present inside the inputs
        onSubmit({
            title: titleRef.current!.value,
            markdown: markdownRef.current!.value,
            tags: selectedTags
        })
        // NOTE: the ! is a NON-NULL ASSERTION OPERATOR
        // which tells the compiler to ignore the possibility of
        // of the variable being null or undefined

        
        navigate("..");
    }

    // Renders the new note form to the DOM
    return (
        <>
            <Form onSubmit={handleSubmit}>
                <Stack gap={4}>
                    {/* Title and Tags form groups will be on the same row */}
                    <Row>
                        <Col>
                            {/* New Note Title - field is required */}
                            <Form.Group controlId="title">
                                <Form.Label>Title</Form.Label>
                                <Form.Control ref={titleRef} required />
                            </Form.Group>
                        </Col>
                        <Col>
                            {/* New Note Tag List */}
                            <Form.Group controlId="tags">
                                <Form.Label>Tags</Form.Label>
                                {/* 
                                CreatableReactSelect comes from react-select
                                -isMulti allows for multiple Tags 
                            */}
                                <CreatableReactSelect 
                                onCreateOption={label => {
                                    const newTag = { id: uuidV4(), label}
                                    // add new tag to local storage list
                                    onAddTag(newTag);
                                    // add newTag to local state array
                                    setSelectedTags(prev => [...prev, newTag]);
                                }}
                                // the value of the component is the 
                                // list of tags from local state reflected by options
                                value={selectedTags.map(tag => {
                                    return {label: tag.label, value: tag.id}
                                })} 
                                // options is the array of options that populate the select menu
                                options={availableTags.map(tag => {
                                    return { label: tag.label, value: tag.id}
                                })}
                                // onChange, update local state
                                onChange={tags => {
                                    setSelectedTags(tags.map(tag => {
                                        return {label: tag.label, id: tag.value}
                                    }))
                                }}
                                isMulti />
                            </Form.Group>
                        </Col>
                    </Row>
                    {/* New Note Body - field is required as textarea */}
                    <Form.Group controlId="markdown">
                        <Form.Label>Body</Form.Label>
                        <Form.Control required as="textarea" ref={markdownRef} rows={15} />
                    </Form.Group>
                    <Stack direction="horizontal" gap={2} className="justify-content-end" >
                        <Button type="submit" variant="primary">
                            Save
                        </Button>
                        <Link to="..">
                            <Button type="button" variant="outline-secondary">
                                Cancel
                            </Button>
                        </Link>
                    </Stack>
                </Stack>
            </Form>
        </>
    )
}