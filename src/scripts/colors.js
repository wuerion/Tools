let createColor = document.getElementById("createData");
let container = document.getElementById("container");
let divNotify = document.getElementById("notify");
let textNotify = document.getElementById("textNotify");

function createBoxColor(color) {
    let inputColor = color || document.getElementById("input1").value;
    localStorage.setItem("color", inputColor);
    let colorData = localStorage.getItem("color");

    let allowedChar = '#';
    if (inputColor === '') {
        divNotify.classList.add("notify");
        textNotify.innerText = 'Ingresa el color';
        notify();
    } else if (inputColor[0] !== allowedChar) {
        divNotify.classList.add("notify");
        textNotify.innerText = 'Falta el (#)';
        notify();
    } else{
        let newCard = document.createElement("div");
        newCard.className = "border border-black dark:border-white hover:border-white dark:hover:border-cyan-400 p-3.5 rounded";
        container.appendChild(newCard);

        let codeRGB = hexa_rgb(inputColor);
        let codeColor = document.createElement('p');
        codeColor.className = "text-black dark:text-white text-center";
        codeColor.innerText = inputColor + ' | ' + codeRGB;
        newCard.appendChild(codeColor);

        let boxColor = document.createElement("div");
        boxColor.className = "h-10 rounded my-2.5";
        boxColor.style.backgroundColor = inputColor || colorData;
        newCard.appendChild(boxColor);

        let containerBnt = document.createElement("div");
        containerBnt.className = "flex justify-evenly border rounded";
        newCard.appendChild(containerBnt);

        let bntCopy = document.createElement("buttom");
        bntCopy.className = "text-black text-center dark:text-white hover:text-white dark:hover:text-cyan-400 border-r hover:bg-white/10 w-1/2";
        bntCopy.innerHTML = "Copy";
        containerBnt.appendChild(bntCopy);

        let bntDelet = document.createElement("buttom");
        bntDelet.className = "text-black text-center dark:text-white hover:text-white dark:hover:text-cyan-400 hover:bg-white/10 w-1/2";
        bntDelet.innerText = "Delet";
        containerBnt.appendChild(bntDelet);

        const copyColor = async () => {
            try {
                await navigator.clipboard.writeText(colorData);
                divNotify.classList.add("notify");
                textNotify.innerText = "Color copiado: " + colorData;
                notify();
            } catch (error) {
                console.log(error)
            };
        };
        
        function delet() {
            newCard.remove();
            localStorage.removeItem('color');
            divNotify.classList.add('notify');
            textNotify.innerText = "Color eliminado: " + colorData;
            notify();
        };
        ``
        bntCopy.addEventListener('click', function () { copyColor(colorData); });
        bntDelet.addEventListener("click", function () { delet(colorData); });
    };
};


function hexa_rgb(code_hexa) {
    code_hexa = code_hexa.replace(/^#/, '');
    let r = parseInt(code_hexa.substring(0, 2), 16);
    let g = parseInt(code_hexa.substring(2, 4), 16);
    let b = parseInt(code_hexa.substring(4, 6), 16);
    return 'rgb(' + r + ", " + g + ", " + b + ')';
};

let time = 1;

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
};

async function notify() {
    while (time < 10) {
        time++;
        await delay(800);
        console.log(time);
    }
    divNotify.classList.remove("notify");
    textNotify.innerText = '';
    console.log("end");
    time = 1;
};

createColor.addEventListener('click', function () { createBoxColor(); });
window.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        createBoxColor();
    };
});