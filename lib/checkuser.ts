import { currentUser } from "@clerk/nextjs/server";
import {db} from "./prisma"
export const checkUser = async ()=>{
    const user = await currentUser()
    if(!user){
        return null
    }

    try {
        const loggedInUser = await db.user.findUnique({
            where:{
                clerkUserId:user.id
            }
        })
        if(!loggedInUser){
            const newUser = await db.user.create({
                data:{
                    clerkUserId:user.id,
                    email:user.emailAddresses[0].emailAddress,
                    name:user.fullName,
                    imageUrl:user.imageUrl
                }
            })
            return newUser
        }
        return loggedInUser
    } catch (error) {
        console.log(error)
    }
}