import mongoose from "mongoose";

export async function connect(){
    try {
        mongoose.connect(process.env.MONGODB_URI!)
        const connection = mongoose.connection
        connection.on('connected',()=>{
            console.log('connected to db');
            
        })
    
        connection.on('error',(err)=>{
            console.log('error connecting to db: ',err);
            process.exit()
        })
    } catch (error) {
        console.log('Something goes wrong!');
        console.log(error);
    }
    
}