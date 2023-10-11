import express,{Request , Response, query} from "express";
import Book from "./book";
import bodyParser from "body-parser";
import serverStatic from "serve-static";
import mongoose from "mongoose";
import cors from "cors";

const app=express();

app.use(bodyParser.json());
app.use(serverStatic("public"));
app.use(cors());


const uri = "mongodb+srv://seifeddine:B85mToSBEVYdGF6k@cluster0.o4udqpk.mongodb.net/biblio";
mongoose.connect(uri)
    .then(() => {
        console.log("MongoDb connection success");
    })
    .catch((err) => {
        console.error('MongoDb connection error:', err);
    });

app.get("/",(req:Request,resp:Response)=>{
    resp.send("Hello world");
});


app.get("/books", (req, resp) => {
    Book.find() 
        .then((books) => {
            resp.send(books); 
        })
        .catch((err) => {
            resp.status(500).send(err); 
        });
});




app.get("/books/:id", (req:Request, resp:Response) => {
    const bookId = req.params.id;

    Book.findById(bookId)
        .then((book) => {
            if (book) {
                resp.send(book);  
            } else {
                resp.status(404).send("Book not found");  
            }
        })
        .catch((err) => {
            resp.status(500).send(err);
        });
});


app.post("/books", (req:Request, resp:Response) => {
    const newBook = new Book(req.body);

    newBook.save()
        .then((book) => {
            resp.status(201).send(book); 
        })
        .catch((err) => {
            resp.status(500).send(err); 
        });
});


app.put("/books/:id", (req:Request, resp:Response) => {
    const bookId = req.params.id;

    Book.findByIdAndUpdate(bookId, req.body)
        .then(() => {
            resp.send("Successfully updated book");
        })
        .catch((err) => {
            resp.status(500).send(err);
        });
});


app.delete("/books/:id", (req, resp) => {
    const bookId = req.params.id;

    Book.findByIdAndRemove(bookId)
        .then((book) => {
            if (book) {
                resp.send(`Successfully deleted book with ID ${bookId}`);
            } else {
                resp.status(404).send("Book not found");
            }
        })
        .catch((err) => {
            resp.status(500).send(err);
        });
});




app.get("/pbooks", (req:Request, resp:Response) => {
    let p: number = parseInt(req.query.page as string, 10) || 1;
    let size: number = parseInt(req.query.size as string, 10) || 5;

    Book.paginate({}, { page: p, limit: size })
        .then((result:any) => {
            resp.send(result);
        })
        .catch((err:any) => {
            resp.status(500).send(err);
        });
});



app.get("/books-search", (req:Request, resp:Response) => {
    const keyword = req.query.kw || '';
    Book.find({ title: { $regex: new RegExp(".*" + keyword + ".*", "i") })
        .then((books) => {
            if (books.length > 0) {
                resp.send(books);
            } else {
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
