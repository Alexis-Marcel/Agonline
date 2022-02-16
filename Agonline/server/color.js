function randInt(a, b) {
    return a + Math.floor(Math.random() * (b - a));
}

function getRandomColor() {
    const focusColor = randInt(200, 255);
    const otherColor1 = randInt(100, 255);
    const otherColor2 = randInt(100, 255);
    const index = randInt(0, 3);
    const colors = [otherColor1, otherColor2];
    colors.splice(index, 0, focusColor);
    return `rgb(${colors.join(",")})`;
}


function rgbToHex(r, g, b) {
    return "0x" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}
module.exports = { getRandomColor , rgbToHex };