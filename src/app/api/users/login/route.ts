import { connect } from "@/dbConfig/dbConfig";
import { User } from "@/models/user.model";
import { compare } from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

connect()
export async function POST(req:NextRequest){
    try {
        const {username , email , password}= await req.json()

        const user = await User.findOne({
            $or:[{email},{username}]
        })

        if(!user){
            return NextResponse.json({error: 'User does not exists'}, {status: 404})
        }

        const isPassCorrect = await compare(password,user.password)

        if(!isPassCorrect){
            return NextResponse.json({error: "Incorrect Credentials"}, {status: 400})
        }

        const token = jwt.sign({id:user._id},process.env.TOKEN_SECRET!,{
            expiresIn: "1d"
        })
        const response = NextResponse.json({message:"Logged in successfully",user,success:true,status:200})

        response.cookies.set("token",token,{
            httpOnly : true
        })

        return response
    } catch (error : any) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
}