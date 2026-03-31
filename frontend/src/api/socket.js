import { io } from 'socket.io-client'

let socket = null

export const connectSocket = (token) => {
  if (socket && socket.connected) return socket

  const url = import.meta.env.VITE_API_URL || 'http://localhost:5000'
  socket = io(url, {
    auth: {
      token: token ? `Bearer ${token}` : undefined
    }
  })

  socket.on('connect', () => {
    console.log('Socket connected', socket.id)
  })

  socket.on('connect_error', (err) => {
    console.error('Socket connect error', err)
  })

  return socket
}

export const joinRoom = (room) => {
  if (!socket) return
  socket.emit('joinRoom', room)
}

export default () => socket
