import { connect } from "@/dbConfig/dbConfig";
import { User } from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

connect()

export async function POST(request :NextRequest) {
    try {
        const { token } = await request.json()

        const user = await User.findOne({verifyToken : token , verifyTokenExpiry :{ $gt : Date.now()}});

        if(!user){
            return NextResponse.json({error: "Invalid token"}, {status: 400})
        }

        user.isVerfied=true
        user.verifyToken= undefined
        user.verifyTokenExpiry= undefined
        await user.save()

        return NextResponse.json({success:true,message:"Verified Successfully"})
    } catch (error : any) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
}