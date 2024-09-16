let createFont = document.getElementById("createData");
let container = document.getElementById("container");
let divNotify = document.getElementById("notify");
let textNotify = document.getElementById("textNotify");

function createBoxFont (name, url) {
    let inputName = document.getElementById("input2").value;
    localStorage.setItem("name", inputName);
    let nameData = localStorage.getItem("name");
    let inputUrl = document.getElementById("input3").value;
    localStorage.setItem("url", inputUrl);
    let urlData = localStorage.getItem("url");

    if (inputName === '') {
        divNotify.classList.add("notify");
        textNotify.innerText = "Ingresa el nombre";
        notify();
    } else if (inputUrl === '') {
        divNotify.classList.add("notify");
        textNotify.innerText = "Ingresa el url";
        notify();
    } else {
        linkCss(inputUrl);
        let newCard = document.createElement("div");
        newCard.className = "border border-black dark:border-white hover:border-white dark:hover:border-cyan-400 p-3.5 rounded";
        container.appendChild(newCard);

        let nameFont = document.createElement("p");
        nameFont.className = "text-black dark:text-white text-center";
        nameFont.style.fontFamily = inputName;
        nameFont.innerText = nameData;
        newCard.appendChild(nameFont);

        let exampleText = document.createElement("p");
        exampleText.className = "h-10 rounded my-2.5 text-black dark:text-white text-center";
        exampleText.style.fontFamily = inputName;
        exampleText.innerHTML = "A, a, B, b, C, c, 0, 1, 2, 3, 4, 5";
        newCard.appendChild(exampleText);

        let containerBnt = document.createElement("div");
        containerBnt.className = "felx border rounded";
        containerBnt.style.display = 'space-around';
        newCard.appendChild(containerBnt);

        let bntCopy = document.createElement("button");
        // bntCopy.classList.add("bntCopy")
        bntCopy.className = "text-black text-center dark:text-white hover:text-cyan-400 border-r border-solid border-white hover:bg-white/10";
        bntCopy.style.width = "50%";
        bntCopy.innerText = "Copy";
        containerBnt.appendChild(bntCopy);

        let bntDelet = document.createElement("button");
        bntDelet.className = "text-black text-center dark:text-white hover:text-cyan-400 border-r border-solid border-white hover:bg-white/10";
        bntDelet.style.width = "50%";
        bntDelet.innerText = "Delet";
        containerBnt.appendChild(bntDelet);

        const copyColor = async () => {
            try {
                await navigator.clipboard.writeText(`@import url(${urlData});, font-family:${nameData}, cursive;`);
                divNotify.classList.add("notify");
                textNotify.innerText = "Font copiado";
                notify();
            } catch (error) {
                console.log(error);
            };
        };

        function delet() {
            newCard.remove();
            localStorage.removeItem("name");
            localStorage.removeItem("url");
            divNotify.classList.add("notify");
            textNotify.innerText = "Font eliminado";
            notify();
        };

        bntCopy.addEventListener('click', function() { copyColor(nameData, urlData); });
        bntDelet.addEventListener('click', function() { delet(nameData, urlData); });
    };
};

function linkCss(url) {
    let cssLink = document.createElement("link");
    cssLink.rel = "stylesheet";
    cssLink.type = "text/css";
    cssLink.href = url;
    document.head.appendChild(cssLink);
};

let time = 1;

function delay (ms) {
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
    time = 1;
};

createFont.addEventListener('click', function () { createBoxFont(); });
window.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        createBoxFont();
    }
})
