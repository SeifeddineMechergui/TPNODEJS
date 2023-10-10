const express=require("express")
const mongooose=require("mongoose")
const bodyparser=require("body-parser")

const app=express();
const port=3002;

app.use(bodyparser.json());


mongooose.connect('mongodb://localhost:27017/biblio',{
    useNewUrlParser: true, useUnifiedTopology: true 
    }
    ).then(()=>{
        app.listen(port, () => {
            console.log('Server is running on port ' + port);
        });
         console.log("Connect Server");
    }).catch(err=>{
        console.log("Erreur de connexion");
        process.exit(1);
    })

const bookSchema=new mongooose.Schema({
    title:{
        type:String,
        required:true
    },
    author:{
        type:String,
        required:true
    }
})

const book=mongooose.model("book",bookSchema);

app.get('/books',async (req,res)=>{
    try{
        const books=await book.find().exec();
        res.status(200).json(books);
    }catch(err){
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

app.get('/books/:id',async (req,res)=>{
    try{
        const book=await book.findById(req.params.id);
        if(!book){
            return res.status(404).json({'message':"Book Not Found"});
        }
        res.json(book);
    }catch(err){
        res.status(400).json({ error: err.message });
    }
})

app.post('/books',async (req,res)=>{
    const {title,author}=req.body;
    if(!title || !author){
        return res.status(400).json({"message":"Titre et author sont requis"})
    }
    const newBook=new book({title,author});
    try{
        const saveBook=await newBook.save();
        res.status(201).json(saveBook);
    }catch(err)
        {
          res.status(400).json({ error: err.message });
            (otherError)=>{
                res.status(500).json({ error: otherError.message });
         }
     }
})



app.put('/books/:id',async  (req,res)=>{
    try{
        const updatedBook=await book.findByIdAndUpdate(req.params.id,req.body,{new:true});
        if(!updatedBook){
            return res.status(404).json({'message':"Not Found"});
        }
        res.json(updatedBook);
    }catch(err){
        res.status(400).json({ error: err.message });
    }
})


app.delete("/books/:id",async (req,res)=>{
    try{
        const updatedBook=await book.findByIdAndDelete(req.params.id);
        if(!updatedBook){
            return res.status(404).json({'message':"Not Found"});
        }
        res.status(204).send()
    }catch(err){
        res.status(500).json({ error: err.message });
    }
})







