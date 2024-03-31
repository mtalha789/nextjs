import nodemailer from 'nodemailer'
import { User } from "@/models/user.model";
import bcryptjs from 'bcryptjs'

export const sendMail = async({mailType,userId,email}:any) =>{
  try {
    const hashedToken = await bcryptjs.hash(userId,10)
    
    if (mailType==="VERIFY") {
       await User.findByIdAndUpdate(userId,{
        verifyToken:hashedToken,verifyTokenExpiry: Date.now() + 60*60*1000
       })  
    }else{
      await User.findByIdAndUpdate(userId,{
        forgotPasswordToken:hashedToken , forgotPasswordTokenExpiry: Date.now() + 3600000
      })
    }
  
    const transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "50dc15b008a5ed",
        pass: "2432b8e8e65527"
      }
    });
  
    const mailOptions = {
      from:"",
      to : email,
      subject : `${mailType === 'VERIFY'?"Verify Your Account":"Reset Your Password"}`,
      html : `<p> Click <a href='${process.env.DOMAIN}/verifyemail?token${hashedToken}'>here</a>to ${mailType === "VERIFY" ? "verify your email" : "reset your password"}
      or copy and paste the link below in your browser. <br> ${process.env.DOMAIN}/verifyemail?token=${hashedToken}
      </p>`
    }
  
    const mail = await transport.sendMail(mailOptions)
    return mail
  } catch (error:any) {
    throw new Error(error.message)
  }
}