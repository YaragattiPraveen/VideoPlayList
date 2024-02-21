import express, { urlencoded } from 'express'
import CookieParser from 'cookie-parser'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express()


// Midlleware for app

// This is for the cors policy
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}))

// This is for body parser
app.use(express.json({ limit: '16kb' }))

// This is for url encoded parser
app.use(express.urlencoded({ extended: true, limit: '16kb' }))

// This is for static file upload
app.use(express.static('public'))

// This is for the cookie parser
app.use(cookieParser())

export { app }