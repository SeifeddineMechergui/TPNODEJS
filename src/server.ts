import express = require('express');
import { Request,Response } from "express";

export default class server{
    constructor(private port:number){};

    public start():void
    {
        const app  = express();
        app.get('/',(req:Request,res:Response)=>{
            res.send(`TypeScript start`);
        });
        app.listen(this.port,()=>{
            console.log("Server Start");
            
        })
    }
}