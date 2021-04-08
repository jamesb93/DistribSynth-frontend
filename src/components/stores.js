import { io } from "socket.io-client"
import { writable } from 'svelte/store';

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

export const recentParamValue = writable('')
export const recentParamName = writable('')
socket.on('connect', () => {
    console.log('connected to ', socketAddr)
})

socket.on('numUsers', (num) => {
    numUsers.set(num)
});