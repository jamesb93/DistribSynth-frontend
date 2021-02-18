const fmod = (a,b) => { 
    return Number((a - (Math.floor(a / b) * b)).toPrecision(8));
};

export const mapRange = (i, iMin, iMax, oMin, oMax) => {
    return (i - iMin) * (oMax - oMin) / (iMax - iMin) + oMin;
}

export const fold = (i: number, min: number, max: number) => {
    let range: number = max - min;

    if (i <= max && i >= min) {
        return i
    }
    
    if (min === max) {
        return min
    }

    let below: boolean = (i < min)

    let diff: number = below ? min - i : i - max
    let mag: number = diff / range

    diff -= (range * mag)
    if ((mag % 2 == 0) != below) {
        return max - diff
    } else {
        return min + diff
    }
}

export const wrap = (i: number, min: number, max: number) => {
    let retVal: number;
    let range: number = max - min; 

    if (i < max && i >= min) {
        return i;
    }

    if (max == min) {
        return min;
    }

    if (i < min) {
        retVal = i;
        while (retVal < min)
            retVal += range;
    }
    else
        retVal = fmod(i - min, range) + min;

    return retVal;
} 