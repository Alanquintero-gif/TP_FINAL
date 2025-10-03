import dotenv from 'dotenv'
dotenv.config()
const ENVIRONMENT = {
    MONGO_DB_CONNECTION_STRING: process.env.MONGO_DB_CONNECTION_STRING,
    GMAIL_PASSWORD: process.env.GMAIL_PASSWORD,
    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY
}


export default ENVIRONMENT