let createGradient = document.getElementById("createData");
let container = document.getElementById("container");
let divNotify = document.getElementById("notify");
let textNotify = document.getElementById("textNotify");

function createBoxGradient(val1, val2, va3) {
    let input1 = document.getElementById("input1").value;
    localStorage.setItem("color1", input1);
    let colorData1 = localStorage.getItem("color1");

    let input2 = document.getElementById("input2").value;
    localStorage.setItem("deg", input2);
    let deg = localStorage.getItem("deg");
    
    let input3 = document.getElementById("input3").value;
    localStorage.setItem("color2", input3);
    let colorData2 = localStorage.getItem("color2");

    let allowedChar = '#';
    let allowedword = 'deg';
    if (input1 === '') {
        divNotify.classList.add("notify");
        textNotify.innerText = 'Ingresa el color'
        notify();
    } else if (input1[0] !== allowedChar) {
        divNotify.classList.add('notify');
        textNotify.innerText = 'Falta el (#)';
        notify();
    } else if (input2 === '') {
        divNotify.classList.add("notify");
        textNotify.innerText = 'Ingresa los grados';
        notify();
    } else if (input3 === '') {
        divNotify.classList.add("notify");
        textNotify.innerText = 'Ingresa el color'
        notify();
    } else if (input3[0] !== allowedChar) {
        divNotify.classList.add("notify");
        textNotify.innerText = 'Falte el (#)'
        notify();
    } else {
        let newCard = document.createElement("div");
        newCard.className = "border border-black dark:border-white hover:border-white dark:hover:border-cyan-400 p-3.5 rounded";
        container.appendChild(newCard);
        
        let codeColor = document.createElement("p");
        codeColor.className = "text-black dark:text-white text-center";
        codeColor.innerText = input1 + ', ' + input2 + ', ' + input3;
        newCard.appendChild(codeColor);

        let boxColor = document.createElement("div");
        boxColor.className = "h-10 rounded my-2.5";
        boxColor.style.backgroundImage = `linear-gradient(${input2}, ${input1}, ${input3})`;
        newCard.appendChild(boxColor);

        let containerBnt = document.createElement("div");
        containerBnt.className = "flex justify-around border rounded";
        newCard.appendChild(containerBnt);

        let bntCopy = document.createElement("button");
        bntCopy.className = "text-black text-center dark:text-white hover:text-white dark:hover:text-cyan-400 border-r hover:bg-white/10";
        bntCopy.style.width = "50%";
        bntCopy.innerText = "Copy";
        containerBnt.appendChild(bntCopy);

        let bntDelet = document.createElement("button");
        bntDelet.className = "text-black text-center dark:text-white hover:text-white dark:hover:text-cyan-400 border-r hover:bg-white/10";
        bntDelet.style.width = "50%";
        bntDelet.innerText = "Delet";
        containerBnt.appendChild(bntDelet);

        const copyGradient = async () => {
            try {
                await navigator.clipboard.writeText(`background-image:linear-gradient(${deg},${colorData1},${colorData2});`);
                divNotify.classList.add('notify');
                textNotify.innerText = "Gradiente copiado";
                notify();
            } catch (error) {
                console.log(error);
            }
        };

        function delet() {
            newCard.remove();
            localStorage.removeItem('color1');
            localStorage.removeItem('deg');
            localStorage.removeItem('color2');
            divNotify.classList.add("notify");
            textNotify.innerText = "Gradiente eliminado";
            notify();
        };

        bntCopy.addEventListener('click', function () { copyGradient(colorData1, deg, colorData2); });
        bntDelet.addEventListener('click', function () { delet(colorData1, deg, colorData2); });
    }
}

let time = 1;

function delay(ms) {
    return new Promise(resolove => setTimeout(resolove, ms));
}
async function notify() {
    while (time < 10) {
        time++;
        await delay(800);
        console.log(time);
    }
    divNotify.classList.remove("notify");
    textNotify.innerText = '';
    time = 1;
    console.log('end');
}

createGradient.addEventListener('click', function () { createBoxGradient(); });
window.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        createBoxGradient();
    };
});