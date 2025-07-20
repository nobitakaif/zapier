import express from "express"
import { prismaClient } from "db/clinet"

const app = express()
app.use(express.json())

app.post('/hooks/catch/:',async (req,res)=>{

})