
import { Kafka } from "kafkajs"

const TOPIC_NAME = "zap-events"

const kafka = new Kafka({
    clientId : 'outbox-processor',
    brokers : ["localhost:9092"]
})

async function main(){

    // connecting to the queue
    const consumer = kafka.consumer({ groupId: "main-worker" })
    await consumer.connect()

    // telling the queue where from to get the item in queue eg from 1 or from 5, in this case it starts from the beginning

    await consumer.subscribe({ topic : TOPIC_NAME , fromBeginning : true})

    //pick up the item from the queue and acknowledge back to the queue that it dones the work sending email or sending money or solana etc
    await consumer.run({
        // we disable the automatic acknowledgement by setting the autoCommit false
        autoCommit:false,
        eachMessage:async({ topic, partition, message})=>{
            console.log({
                partition,
                offset: message.offset,
                value : message.value?.toString()
            })

            await new Promise(r => setTimeout(() => {
                
            }, 1000))

            // we're doing manual acknowledged by this
            await consumer.commitOffsets([{
                topic : TOPIC_NAME,
                partition : partition,
                offset : (parseInt(message.offset) + 1).toString()
            }])
        }
    })
}

main()