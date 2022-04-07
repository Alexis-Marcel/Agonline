function randInt(a, b) {
    return a + Math.floor(Math.random() * (b - a));
}

/*
function getRandomColor() {
    const focusColor = randInt(200, 255);
    const otherColor1 = randInt(100, 255);
    const otherColor2 = randInt(100, 255);
    const index = randInt(0, 3);
    const colors = [otherColor1, otherColor2];
    colors.splice(index, 0, focusColor);
    return `rgb(${colors.join(",")})`;
}*/

function getRandomColorHexa(){
    return (Math.floor(Math.random()*0xFFFFFF)).toString(16);
}

function getRandomColor(colors){

    let color;
    if(colors.length===0){
        color = getRandomColorHexa();
    }
    else {
        const indexRandom = Math.floor(Math.random()*colors.length);
        color = colors[indexRandom];
        console.log(color);
        colors.splice(indexRandom,1);
    }
    
    return color;
}

function rgbToHex(r, g, b) {
    return "0x" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}


const Colors = [
     "f0ffff",
     "0000ff",
     "a52a2a",
     "00ffff",
     "00008b",
     "008b8b",
     "a9a9a9",
     "006400",
     "bdb76b",
     "8b008b",
     "000000",
     "556b2f",
     "ff8c00",
     "9932cc",
     "8b0000",
     "e9967a",
     "9400d3",
     "ff00ff",
     "ffd700",
     "008000",
     "4b0082",
     "f0e68c",
     "add8e6",
     "90ee90",
     "d3d3d3",
     "ffb6c1",
     "ffffe0",
     "00ff00",
     "ff00ff",
     "800000",
     "000080",
     "808000",
     "ffa500",
     "ffc0cb",
     "800080",
     "c0c0c0",
     "ffffff",
     "ffff00"
];

module.exports = { getRandomColor , rgbToHex, getRandomColorHexa, Colors};