const express = require('express');
const cors = require('cors');  // Import the CORS middleware
const app = express();
const port = 3000;

// Enable CORS for all routes
app.use(cors());

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));

// In-memory storage for books by roll number
const studentBooks = {};

// Route to add a book for a specific student
app.post('/books/:rollNumber', (req, res) => {
    const { rollNumber } = req.params;
    const { title, author, price } = req.body;

    // Validate the request body
    if (!title || !author || !price) {
        return res.status(400).send({ message: 'Title, author, and price are required.' });
    }

    // Initialize the array if this is the first book for the student
    if (!studentBooks[rollNumber]) {
        studentBooks[rollNumber] = [];
    }

    // Add the book to the student's list
    const newBook = { title, author, price };
    studentBooks[rollNumber].push(newBook);

    res.status(201).send({ message: `Book added for student ${rollNumber}`, book: newBook });
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
