import { socket, grid } from "../pages/_components/stores.js";
import { mirror, deepCopy } from "./matrix.js";
import { get } from "svelte/store";

const sendGrid = (store) => {
    const grid = get(store); 
    socket.send('grid', grid) 
};

export const mirrorGridHorizontal = (store) => {
    const grid = get(store);
    const t = grid.map(row => mirror(row));
    store.set(t);
    sendGrid(store)
}

export const mirrorGridVertical = (store) => {
    const grid = get(store);
    const t = grid.map(row => row);
    for (let i=0; i < grid.length; i++) {
        if (i >= grid.length / 2) {
            let mirrored = (grid.length-1)-i
            t[i] = grid[mirrored]
        }
    }
    store.set(t);
    sendGrid(store);
}

export const invertGridVertical = (store) => {
    let grid = get(store);
    const temp = deepCopy(grid);
    for (let i=grid.length-1, j=0; i>0, j < grid.length ; i--, j++) {
        grid[j] = temp[i]
    }
    store.set(grid);
    sendGrid(store);
}

export const shiftColumnDown = (store, col) => {
    let grid = get(store);
    const temp = deepCopy(grid);
    for (var i=0; i < grid.length; i++) { // in each row
        let below = (i + 1) % grid.length;
        grid[below][col] = temp[i][col]
    }
    store.set(grid);
    sendGrid(store)
}

export const shiftColumnUp = (store, col) => {
    let grid = get(store);
    const temp = deepCopy(grid);
    for (var i=0; i < grid.length; i++) { // in each row
        let invert = (grid.length - i) - 1
        let above = invert - 1
        
        if (above < 0) { // Wrap
            above = grid.length - (Math.abs(0 - above));
        }
        grid[above][col] = temp[invert][col]
    }
    store.set(grid);
    sendGrid(store);
}

export const clearGrid = (store) => {
    let grid = get(store);
    grid = grid.map(gridRow => 
        gridRow.map(cell => false)
    )
    store.set(grid);
    sendGrid(store);
}

export const randomiseGrid = (store) => {
    let grid = get(store);
    grid = grid.map(gridRow =>
        gridRow.map(cell => Math.random() < 0.2)
    )
    store.set(grid);
    sendGrid(store);
}