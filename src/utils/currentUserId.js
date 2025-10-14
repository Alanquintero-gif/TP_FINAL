export default function currentUserId(req) {
  const u = req.user || {}
  return String(u.id || u._id || u.userId || '')
}
