import mongoose from 'mongoose'
import ENVIRONMENT from './environment.config.js'



async function connectMongoDB (){
    try {
        await mongoose.connect (ENVIRONMENT.MONGO_DB_CONNECTION_STRING)
        console.log ('la conexion fue exitosa')
    }
    catch (error){
        console.error ('la conexion fallo')
        console.log (error)

    }

}

export default connectMongoDB