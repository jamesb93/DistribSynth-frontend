import { io } from "socket.io-client"
// Development Toggle
let socketAddr = "wss://8f43.xyz:8080" // Live
// var socketAddr = "ws://localhost:4300" // Local
export const socket = io(socketAddr);

socket.on('connect', () => {
    console.log('connected')
})
