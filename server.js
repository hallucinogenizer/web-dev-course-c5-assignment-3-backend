const express = require('express');
const multer = require('multer');
const path = require("path");
const cors = require('cors');
const Fuse = require('fuse.js');

const app = express();
const port = 3000;

// Middleware
app.use(cors()); // Allow requests from all sources
app.use(express.json()); // For JSON payloads
app.use(express.urlencoded({ extended: true })); // For URL-encoded payloads

// Configure multer
const upload = multer();

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));

// In-memory storage for books by roll number
const studentBooks = {};

// Route to add a book for a specific student
app.post('/books/:rollNumber', upload.none(), (req, res) => {
    const { rollNumber } = req.params;
    const { title, author, price } = req.body;

    console.log(req.body)

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

// New fuzzy search endpoint for books by title or author
app.get('/books/search/:rollNumber', (req, res) => {
    const { rollNumber } = req.params;
    const { query } = req.query; // search query string sent by the frontend

    // If no books exist for this student, return an empty array
    const books = studentBooks[rollNumber] || [];

    // If there's no search query provided, return all books
    if (!query) {
        return res.status(200).send({ rollNumber, books });
    }

    // Configure Fuse.js for fuzzy search
    const fuse = new Fuse(books, {
        keys: ['title', 'author'], // Search by title and author
        threshold: 0.4, // Adjust the fuzziness threshold (0 = exact match, 1 = very fuzzy)
    });

    // Perform the search
    const results = fuse.search(query).map(result => result.item);

    res.status(200).send({ rollNumber, books: results });
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "/documentation.html"));
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
