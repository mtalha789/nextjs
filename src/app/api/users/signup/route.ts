import { User } from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from 'bcryptjs'
import {sendMail} from '@/helpers/mailer'
import { connect } from "@/dbConfig/dbConfig";

connect()

export async function POST(request: NextRequest) {
    try {
        const { username , email , password } = await request.json()
    
        if(await User.findOne({$or:[{username},{email}]})){
            return NextResponse.json({error:"User Already Exist"},{status:400})
        }
    
        const salt = await bcryptjs.genSalt(10)
        const hashedPassword = await bcryptjs.hash(password,salt)
    
        const newUser = new User({
            username,
            email,
            password: hashedPassword
        })
    
        const savedUser = await newUser.save()
        console.log(savedUser);
    
        await sendMail({emailType : "VERIFY",userId : savedUser._id , email})
    
        return NextResponse.json({
            message : "User Created Successfully",
            savedUser,
            success: true
        })
    } catch (error:any) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
}