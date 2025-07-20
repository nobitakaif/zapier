import { PrismaClient } from "./generated/prisma/client"


export const prismaClient = new PrismaClient()


// async function main (){
//         try{
//             const res  = await prismaClient.user.create({
//                 data:{
//                     username:"kaif",
//                     email:"kaif@gmail.com",
//                     password:"nobitakaif"
//                 }
//             })
//             console.log(res.id)
            
//         }catch(e){
//             console.log("something happens wrong",e)
//         }
// }
// main()
