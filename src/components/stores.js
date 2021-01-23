import { writable } from 'svelte/store';
// Development Toggle
let socketAddr = "wss://8f43.xyz:8080" // Live
let socketAddr = "ws://localhost:8080" // Local
// Grid
export const grid = writable({});
export const bpm  = writable(120);
export const play = writable(false);
// State
let data = {};
export const connectStatus = writable(false);
export const connections = writable(0);

// Users
export const users = writable([]);

//Sockets
export const socket = new WebSocket(socketAddr);

socket.addEventListener("open", () => {
    connectStatus.set(true);
});

socket.addEventListener("message", (m) => {
    // Parse the message
    let msg = JSON.parse(m.data);
    if (msg.type === "users") {
        connections.set(msg.connections)
    }
    if (msg.type === "data") {
        grid.set(msg.grid);
        bpm.set(msg.bpm);
        play.set(msg.play);
    }
});
