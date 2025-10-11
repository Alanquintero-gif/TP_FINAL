// src/server.js
import express from 'express'
import cors from 'cors'
import connectMongoDB from './config/mongoDB.config.js'

const app = express()

// CORS para tu front de Vite
app.use(cors({ origin: 'http://localhost:5173' }))

// Body parser
app.use(express.json())

// Healthcheck
app.get('/health', (_req, res) => res.json({ ok: true }))

async function bootstrap() {
  try {
    console.log('[BOOT] Conectando a Mongo…')
    await connectMongoDB()
    console.log('[BOOT] Mongo conectado OK')

    console.log('[BOOT] Cargando routers…')
    // 👇 TODOS relativos a /src y DENTRO del try
    const { default: auth_router }         = await import('./routes/auth.router.js')
    const { default: contactsRouter }      = await import('./routes/contacts.route.js')
    const { default: conversationsRouter } = await import('./routes/conversations.route.js')
    const { default: messagesRouter }      = await import('./routes/messages.route.js')
    // const { default: workspace_router } = await import('./routes/workspace.route.js') // si lo usás

    console.log('[BOOT] Montando routers…')
    app.use('/api/auth', auth_router)
    app.use('/api/contacts', contactsRouter)
    app.use('/api/conversations', conversationsRouter)
    app.use('/api/messages', messagesRouter)
    // app.use('/api/workspace', workspace_router)

    // 404
    app.use((req, res) => res.status(404).json({ message: 'Not found' }))

    // Handler global de errores (DEBE ir tras montar rutas)
    app.use((err, req, res, next) => {
      console.error('[EXPRESS ERROR]', err)
      res.status(err?.status || 500).json({ message: err?.message || 'Internal error' })
    })

    const PORT = 8080
    app.listen(PORT, () => {
      console.log(`[BOOT] Server OK en http://localhost:${PORT}`)
    })
  } catch (err) {
    console.error('[BOOT] ERROR al iniciar:', err)
  }
}

bootstrap()
