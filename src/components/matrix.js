export const rotate = (arr, count) => {
    count -= arr.length * Math.floor(count / arr.length);
    arr.push.apply(arr, arr.splice(0, count));
    return arr;
}

export const random = (arr) => {
    for (var i=0; i < arr.length; i++) {
        arr[i].state = Math.random() > 0.5;
    }
    return arr
}