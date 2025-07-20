import express from "express"
import { prismaClient } from "db/client"

const app = express()
app.use(express.json())


app.post("/hooks/catch/:userId/:zapId",async (req,res)=>{
    const userId = req.params.userId
    const zapId = req.params.zapId
    const body = req.body
    
    // this is transaction in database either both will done or none of these happens
    await prismaClient.$transaction(async tx => {
        const res = await tx.zapRun.create({
            data:{
                zapId : zapId,
                metaData : body
            }
        })

        await tx.zapRunOutbox.create({
            data:{
                zapRunId : res.id
            }
        })
        
    })

    res.json(200).json({
        msg:"alrigh"
    })
})

app.listen(8000,()=>{
    console.log("server is running or port 8000")
})