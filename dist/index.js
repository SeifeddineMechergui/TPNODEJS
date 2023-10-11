"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const book_1 = __importDefault(require("./book"));
const body_parser_1 = __importDefault(require("body-parser"));
const serve_static_1 = __importDefault(require("serve-static"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
app.use((0, serve_static_1.default)("public"));
app.use((0, cors_1.default)());
const uri = "mongodb+srv://seifeddine:B85mToSBEVYdGF6k@cluster0.o4udqpk.mongodb.net/biblio";
mongoose_1.default.connect(uri)
    .then(() => {
    console.log("MongoDb connection success");
})
    .catch((err) => {
    console.error('MongoDb connection error:', err);
});
app.get("/", (req, resp) => {
    resp.send("Hello world");
});
app.get("/books", (req, resp) => {
    book_1.default.find()
        .then((books) => {
        resp.send(books);
    })
        .catch((err) => {
        resp.status(500).send(err);
    });
});
app.get("/books/:id", (req, resp) => {
    const bookId = req.params.id;
    book_1.default.findById(bookId)
        .then((book) => {
        if (book) {
            resp.send(book);
        }
        else {
            resp.status(404).send("Book not found");
        }
    })
        .catch((err) => {
        resp.status(500).send(err);
    });
});
app.post("/books", (req, resp) => {
    const newBook = new book_1.default(req.body);
    newBook.save()
        .then((book) => {
        resp.status(201).send(book);
    })
        .catch((err) => {
        resp.status(500).send(err);
    });
});
app.put("/books/:id", (req, resp) => {
    const bookId = req.params.id;
    book_1.default.findByIdAndUpdate(bookId, req.body)
        .then(() => {
        resp.send("Successfully updated book");
    })
        .catch((err) => {
        resp.status(500).send(err);
    });
});
app.delete("/books/:id", (req, resp) => {
    const bookId = req.params.id;
    book_1.default.findByIdAndRemove(bookId)
        .then((book) => {
        if (book) {
            resp.send(`Successfully deleted book with ID ${bookId}`);
        }
        else {
            resp.status(404).send("Book not found");
        }
    })
        .catch((err) => {
        resp.status(500).send(err);
    });
});
app.get("/pbooks", (req, resp) => {
    let p = parseInt(req.query.page, 10) || 1;
    let size = parseInt(req.query.size, 10) || 5;
    book_1.default.paginate({}, { page: p, limit: size })
        .then((result) => {
        resp.send(result);
    })
        .catch((err) => {
        resp.status(500).send(err);
    });
});
app.get("/books-search", (req, resp) => {
    const keyword = req.query.kw || '';
    book_1.default.find({ title: { $regex: new RegExp(".*" + keyword + ".*", "i") } })
        .then((books) => {
        if (books.length > 0) {
            resp.send(books);
        }
        else {
            resp.status(404).send("No books found with the given keyword");
        }
    })
        .catch((err) => {
        resp.status(500).send(err);
    });
});
const port = 8700;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
