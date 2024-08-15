const express = require('express');
const app = express();
const port = 3000;

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));

// In-memory storage for books by roll number
const studentBooks = {};

// Route to add a book for a specific student
app.post('/books/:rollNumber', (req, res) => {
    const { rollNumber } = req.params;
    const { title } = req.body;

    // Initialize the array if this is the first book for the student
    if (!studentBooks[rollNumber]) {
        studentBooks[rollNumber] = [];
    }

    // Add the book to the student's list
    studentBooks[rollNumber].push(title);

    res.status(201).send({ message: `Book added for student ${rollNumber}`, book: title });
});

// Route to get the list of books for a specific student
app.get('/books/:rollNumber', (req, res) => {
    const { rollNumber } = req.params;

    // If no books exist for this student, return an empty array
    const books = studentBooks[rollNumber] || [];

    res.status(200).send({ rollNumber, books });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
