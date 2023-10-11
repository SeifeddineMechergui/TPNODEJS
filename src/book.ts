import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

let bookShema=new mongoose.Schema({
    title:{type:String,required:true},
    author:{type:String,required:true}

})

bookShema.plugin(mongoosePaginate);
const Book=mongoose.model("Book",bookShema);
export default Book;