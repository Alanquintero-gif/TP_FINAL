// Devuelve el ID de usuario como string desde request.user (según tu token)
export default function currentUserId(req) {
  const u = req.user || {}
  // cubre posibles variantes del payload: { id }, { _id }, { userId }
  return String(u.id || u._id || u.userId || '')
}
