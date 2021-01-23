import { writable } from 'svelte/store';

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
export const socket = new WebSocket("ws://127.0.0.1:8080");

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
