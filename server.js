const express = require('express');
const multer = require('multer');
const cors = require('cors');

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
app.post('/books/:rollNumber', upload.none(),(req, res) => {
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

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "/documentation.html"))
})

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
