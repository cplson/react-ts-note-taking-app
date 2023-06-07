// import { useState } from 'react'
import { Routes, Route, Navigate } from "react-router-dom";
import { Container } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css"

function App() {
  return (
    // Wrap contents of the App in a bootstrap Container and give it 
    // top and bottom margin of 4px
    <Container className="my-4">
    {/* Define all routes using react-router-dom */}
      <Routes>
        <Route path="/" element={<h1>Home</h1>} />
        <Route path="/new" element={<h1>New</h1>} />
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
