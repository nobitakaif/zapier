
import { prismaClient } from "db/client"
import { Kafka } from "kafkajs"

const TOPIC_NAME = 'zap-events'

const kafka = new Kafka({
    clientId : "outbox-processor",
    brokers:['localhost:9092']
})

async function main(){

    const producer = kafka.producer()
    await producer.connect()

    setInterval(async () => {
        // getting the pending triggers from the database 
        const pendingrows = await prismaClient.zapRunOutbox.findMany({
            where:{},
            take:10
        })

        // pushing triggers to the queue
            producer.send({
                topic:TOPIC_NAME,
                messages: pendingrows.map( item =>({
                    value:item.id
                }))
            })
        
        // once the triggers is pushed to the queue the it not need to exist in the queue 
        await prismaClient.zapRunOutbox.deleteMany({
            where:{
                id:{
                    in:pendingrows.map(r => r.id)
                }
            }
        })

    }, 1000);
}

main()