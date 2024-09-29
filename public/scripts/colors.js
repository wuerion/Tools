let createColor = document.getElementById("createData");
let container = document.getElementById("container");
let divNotify = document.getElementById("notify");
let textNotify = document.getElementById("textNotify");
let allowedChar = '#';

// conecxion a la db
fetch("http://localhost/Tools-api/get_colors.php").then(response => response.json()).then(data => {
    console.log("Datos obtenidos", data);
}).catch(error => {
    console.log("Error al obtenr los datos", error);
})

// function para crear el color en vase del valor del input
async function createBoxColorWithinput(data) {
    let inputColor = document.getElementById("input1").value;

    localStorage.setItem("color", inputColor);
    let colorseve = localStorage.getItem("color");
    
    if (inputColor === '') {
        createBoxColor(data);
        divNotify.classList.add("notify");
        textNotify.innerText = 'Ingresa el color';
        notify();
    } else if (inputColor[0] !== allowedChar) {
        divNotify.classList.add("notify");
        textNotify.innerText = 'Falta el (#)';
        notify();
    } else {
        createBoxColor(inputColor);
        console.log('color ingresado: ' + inputColor)
        console.log('color save: ' + colorseve)
        saveColorInDB(colorseve);
    }
}

// function para crear el color en vase del valor de la db
function createBoxColor(color) {
    let newCard = document.createElement("div");
    newCard.className = "border border-black dark:border-white hover:border-white dark:hover:border-cyan-400 p-3.5 rounded";
    container.appendChild(newCard);

    let codeRGB = hexa_rgb(color)
    let codeColor = document.createElement("p");
    codeColor.className = "text-black dark:text-white text-center";
    codeColor.innerText = color + " | " + codeRGB;
    newCard.appendChild(codeColor);

    let boxColor = document.createElement("div");
    boxColor.className = "h-10 rounded my-2.5";
    boxColor.style.backgroundColor = color;
    newCard.appendChild(boxColor);

    let containerBnt = document.createElement("div");
    containerBnt.classList.add('containerBNT');
    newCard.appendChild(containerBnt);

    let bntCopy = document.createElement("button");
    bntCopy.classList.add("bntCopy");
    bntCopy.innerText = "Copy";
    containerBnt.appendChild(bntCopy);

    let bntDelet = document.createElement("button");
    bntDelet.classList.add('bntDelet');
    bntDelet.innerText = "Delet";
    containerBnt.appendChild(bntDelet);


    const copyColor = async (color) => {
        try {
            await navigator.clipboard.writeText(color);
            divNotify.classList.add("notify");
            textNotify.innerText = "Color copiado: " + color;
            notify();
        } catch (error) {
            console.log(error)
        };
    }

    function delet(color) {
        newCard.remove();
        localStorage.removeItem("color");
        divNotify.classList.add("notify");
        textNotify.innerText = "Color eliminado: " + color;
        deleteColorInDB(color);
        notify();
    };

    function hexa_rgb(code_hexa) {
        code_hexa = code_hexa.replace(/^#/, '');
        let r = parseInt(code_hexa.substring(0,2), 16);
        let g = parseInt(code_hexa.substring(2,4), 16);
        let b = parseInt(code_hexa.substring(4,6), 16);
        return 'rgb(' + r + "," + g + "," + b + ")";
    }

        bntCopy.addEventListener('click', function () { copyColor(color); });
        bntDelet.addEventListener('click', function () { delet(color); });
}

// obtenemos los datos de la db
async function getColorsFromDB() {
    try {
        const response = await fetch("http://localhost/Tools-api/get_colors.php");
        const result = await response.json();

        // aseguramos que el result.data es un array antes de usar fetch
        if (result.status === "success" && Array.isArray(result.data)) {
            const colors = result.data;
            colors.forEach(color => {
                console.log("color obtenido de la db", color.hexa);
                createBoxColor(color.hexa); // usamos la function para crear la box color
            });
        } else {
            console.log("Error en la respuesta: ", result.message || "Datos inesperados");
        }
    } catch (error) {
        console.error("error al obtener lod datos: ", error);
    }
}

async function deleteColorInDB(color) {
    try {
        const response = await fetch("http://localhost/Tools-api/delet_data.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({color:color}),
        });

        const textResponse = await response.text(); // Obtenemos el texto de la respuesta
        console.log("Respuesta del servidor: ", textResponse);

        const result = await response.json();
        if (result.success) {
            console.log("Color eliminado");
        } else {
            console.log("Error al eliminar: ", result.message);
        }
    } catch (error) {
        console.error("Error en la solicitud: ", error)
    }
}


// guardamos el nuevo datos en la db
async function saveColorInDB(color) {
    console.log("color que se va a guardar: ", color);
    try {
        const response = await fetch("http://localhost/Tools-api/save_color.php", {
            method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({color: color}),
        });
        const result = await response.json();
        if (result.success) {
            console.log("color guardado");
        } else {
            console.log("Error al guardar: ", result.message);
        }
    } catch (error) {
        
    }
}

// function de la notificacion
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

// llamamos a la function createBoxColor cuando se recarge la web con el valor obtenido de la db
window.onload = () => {
    getColorsFromDB();
}


window.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        createBoxColorWithinput();
    }
})

createColor.addEventListener('click', function () { createBoxColorWithinput(inputColor) })
