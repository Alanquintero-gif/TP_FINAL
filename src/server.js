import express from 'express'
import cors from 'cors'
import connectMongoDB from './config/mongoDB.config.js'

import auth_router from './routes/auth.router.js'
import contactsRouter from './routes/contacts.route.js'
import conversationsRouter from './routes/conversations.route.js'
import messagesRouter from './routes/messages.route.js'

const app = express()


const ALLOWLIST = new Set([
  'https://tp-final-front-gold.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000',
])

app.use((req, res, next) => {
  const origin = req.headers.origin
  if (origin && ALLOWLIST.has(origin)) {
    res.header('Access-Control-Allow-Origin', origin)
  }
  res.header('Vary', 'Origin')
  res.header('Access-Control-Allow-Credentials', 'true')
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204) 
  }
  next()
})

app.use(express.json())

app.get('/health', (_req, res) => res.json({ ok: true }))

app.use('/api/auth', auth_router)
app.use('/api/contacts', contactsRouter)
app.use('/api/conversations', conversationsRouter)
app.use('/api/messages', messagesRouter)

app.use((req, res) => res.status(404).json({ message: 'Not found' }))

app.use((err, req, res, _next) => {
  console.error('[EXPRESS ERROR]', err)
  res.status(err?.status || 500).json({ message: err?.message || 'Internal error' })
})


connectMongoDB().catch((e) => console.error('[Mongo] connect error:', e))


const isVercel = !!process.env.VERCEL

if (!isVercel) {
  const PORT = process.env.PORT || 8080
  app.listen(PORT, () => {
    console.log(`[BOOT] Server OK en http://localhost:${PORT}`)
  })
}

export default app
