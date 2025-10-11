// src/server.js
import express from 'express'
import cors from 'cors'
import connectMongoDB from './config/mongoDB.config.js'

// Routers (import estático para que estén montados en serverless)
import auth_router from './routes/auth.router.js'
import contactsRouter from './routes/contacts.route.js'
import conversationsRouter from './routes/conversations.route.js'
import messagesRouter from './routes/messages.route.js'
// import workspace_router from './routes/workspace.route.js' // si lo usás

const app = express()

// === CORS ===
// Permitimos el front en Vercel y los localhost de dev.
// Si querés, podés usar envs: process.env.FRONT_ORIGIN
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
  // Importante para cachés/CDN
  res.header('Vary', 'Origin')
  res.header('Access-Control-Allow-Credentials', 'true')
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204) // preflight OK
  }
  next()
})

app.use(express.json())

// Healthcheck (útil para verificar headers en prod)
app.get('/health', (_req, res) => res.json({ ok: true }))

// === Montaje de rutas ===
app.use('/api/auth', auth_router)
app.use('/api/contacts', contactsRouter)
app.use('/api/conversations', conversationsRouter)
app.use('/api/messages', messagesRouter)
// app.use('/api/workspace', workspace_router)

// 404
app.use((req, res) => res.status(404).json({ message: 'Not found' }))

// Handler global de errores
app.use((err, req, res, _next) => {
  console.error('[EXPRESS ERROR]', err)
  res.status(err?.status || 500).json({ message: err?.message || 'Internal error' })
})

// === Conexión a Mongo ===
// En serverless, intenta reusar la conexión si la lib lo permite; si ya está conectada, connectMongoDB debería no duplicar.
// No bloqueamos el arranque del handler por esto.
connectMongoDB().catch((e) => console.error('[Mongo] connect error:', e))

// === Export / Listen ===
// En Vercel (serverless) debemos EXPORTAR el app y NO escuchar un puerto.
// Localmente sí levantamos el server.
const isVercel = !!process.env.VERCEL

if (!isVercel) {
  const PORT = process.env.PORT || 8080
  app.listen(PORT, () => {
    console.log(`[BOOT] Server OK en http://localhost:${PORT}`)
  })
}

export default app
