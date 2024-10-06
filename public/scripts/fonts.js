let createFont = document.getElementById("createData");
let container = document.getElementById("container");
let divNotify = document.getElementById("notify");
let textNotify = document.getElementById("textNotify");

// Conexion a la db
fetch("http://localhost/Tools-api/get_fonts.php").then(response => response.json()).then(data => {
    console.log("Datos obtenidos", data);
}).catch(error => {
    console.log("Error al obtenr los datos", error);
})

// function para crear la font en vase el valor del input
async function createBoxFontWithitInput(name, url) {
    let inputName = document.getElementById("input2").value;
    localStorage.setItem("name", inputName);
    let nameFont = localStorage.getItem("name");

    let inputUrl = document.getElementById("input3").value;
    localStorage.setItem("url", inputUrl);
    let urlFont = localStorage.getItem("url");

    if (nameFont === '') {
        divNotify.classList.add("notify");
        textNotify.innerText = "Ingresa el nombre";
        notify();
    } else if (urlFont === ''){
        divNotify.classList.add("notify");
        textNotify.innerText = "Ingresa la url";
        notify();
    } else {
        createBoxFont(inputName, inputUrl);
        saveFontInDB(nameFont, urlFont);
    }
}

// function para crear la font en vase el valor de la db
function createBoxFont(val1, val2) {
    linkCss(val2);
    let newCard = document.createElement("div");
    newCard.className = "border border-black dark:border-white hover:border-white dark:hover:border-cyan-400 p-3.5 rounded";
    container.appendChild(newCard);

    let nameFont = document.createElement("p");
    nameFont.className = "text-black dark:text-white text-center";
    nameFont.style.fontFamily = val1;
    nameFont.innerText = val1;
    newCard.appendChild(nameFont);

    let exampleText = document.createElement("p");
    exampleText.className = "h-10 rounded my-2.5  text-black dark:text-white text-center";
    exampleText.style.fontFamily = val1;
    exampleText.innerText = "A, a, B, b, C, c, 0, 1, 2, 3, 4, 5";
    newCard.appendChild(exampleText);

    let containerBnt = document.createElement("div");
    containerBnt.classList.add("containerBNT");
    newCard.appendChild(containerBnt);

    let bntCopy = document.createElement("button");
    bntCopy.classList.add("bntCopy");
    bntCopy.innerText = "Copy";
    containerBnt.appendChild(bntCopy);

    let bntDelet = document.createElement("button");
    bntDelet.classList.add("bntDelet");
    bntDelet.innerText = "Delet";
    containerBnt.appendChild(bntDelet);

    const copyFont = async (val1, val2) => {
        try {
            await navigator.clipboard.writeText(`fontFamily:${val1}, @import url(${val2}, cursive);`);
            divNotify.classList.add("notify");
            textNotify.innerText = "Font copiado";
            notify();
        } catch (error) {
            console.log("error al copiar: ", error);
        }
    }

    function delet(val1, val2) {
        newCard.remove();
        localStorage.removeItem("name");
        localStorage.removeItem("url");
        textNotify.innerText = "Font eliminado";
        deleteFontInDB(val1, val2);
        notify();
    }

    bntCopy.addEventListener('click', function () { copyFont(val1, val2) })
    bntDelet.addEventListener('click', function () { delet(val1, val2) })
}

function linkCss (url) {
    let cssLink = document.createElement("link");
    cssLink.rel = "stylesheet";
    cssLink.type = "text/css";
    cssLink.href = url;
    document.head.appendChild(cssLink);
}

// obtenemos los datos de la db
async function getFontsFromDB() {
    try {
        const response = await fetch("http://localhost/Tools-api/get_fonts.php");
        const result = await response.json();
        // aseguramos que le resultado.data es un array antes de usar fetch
        if (result.status === "success" && Array.isArray(result.data)) {
            const fonts = result.data;
            fonts.forEach(font => {
                console.log("fonts obtenido: ", font.fontname, font.fonturl);
                createBoxFont(font.fontname, font.fonturl);
                linkCss(font.fonturl);
            });
        } else {
            console.log("Error en la respusta: ", result.message || "Datos inesperados")
        }
    } catch (error) {
        console.error("error al obtener los datos")
    }
}

// function para eliminar los datos de la db
async function deleteFontInDB(val1, val2) {
    try {
        const response = await fetch("http://localhost/Tools-api/delet_fonts.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({val1:val1, val2:val2}),
        });
        // // obtenemos la respuesta
        // const textResponse = await response.text();
        // console.log("Respuesta del servidor: ", textResponse);

        const result = await response.json();
        if (result.success) {
            console.log("Font eliminado");
        } else {
            console.log("Error al eliminar: ", result.message);
        }
    } catch (error) {
        console.error("Error en la solicitud: ", error)
    }
}

// guradamos el nuevo datos en la db
async function saveFontInDB(val1, val2) {
    console.log("font que se va a guardar: " , val1, val2);
    try {
        const response = await fetch("http://localhost/Tools-api/save_fonts.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({val1: val1, val2: val2}), 
        });

        const result = await response.json();
        if (result.success) {
            console.log("Font guardado");
        } else {
            console.log("error al guardar: ", result.message);
        }
    } catch (error) {
        console.error("error em la solucitud: ", error)
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

window.onload = () => {
    getFontsFromDB();
}

window.addEventListener('keydown', (e) => {
    if (e.key === "Enter") {
        createBoxFontWithitInput();
    }
})

createFont.addEventListener('click', function () { createBoxFontWithitInput(); });
