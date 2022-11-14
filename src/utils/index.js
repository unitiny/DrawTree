export const getDistance = (dot1, dot2) => {
    return Math.sqrt(Math.pow(dot1[0] - dot2[0], 2) + Math.pow(dot1[1] - dot2[1], 2))
}

export const toAngle = (rotate) => {
    return rotate * 180 / Math.PI
}

export const copy = (arr) => {
    return JSON.parse(JSON.stringify(arr))
}

export const randomKey = () => {
    return Math.floor((Math.random() * 100))
}