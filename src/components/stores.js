import { io } from "socket.io-client"
import { writable } from 'svelte/store';

export const numUsers = writable(0);

// Development Toggle
// let socketAddr = "wss://8f43.xyz:4300" // Live
let socketAddr = "ws://localhost:4300" // Local
export const socket = io(socketAddr);

export const numUsers = writable(0);
let storedRoom = localStorage.getItem("mfrtjbcode");
if (storedRoom === null) {
    storedRoom = ""
} 
export const room = writable(storedRoom)
if (storedRoom !== "") {
    socket.emit('roomJoin', storedRoom)
    room.set(storedRoom)
}
socket.on('connect', () => {
    console.log('connected to ', socketAddr)
})

socket.on('numUsers', (e) => {
    numUsers.set(e)
});