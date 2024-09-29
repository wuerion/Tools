let createGradient = document.getElementById("createData");
let container = document.getElementById("container");
let divNotify = document.getElementById("notify");
let textNotify = document.getElementById("textNotify");
let allowedChar = "#";

// conexion a la db
fetch("http://localhost/Tools-api/get_gradients.php").then(response => response.json()).then(data => {
    console.log("Datos obtenidos", data);
}).catch(error => {
    console.log("Error al obtenr los datos", error);
})

// function para crear el gradiente en vase el valor del input
async function createBoxGradientWithitInput(val1, val2, val3) {
    let color1 = document.getElementById("input1").value;
    localStorage.setItem("color1", color1)
    let data1 = localStorage.getItem("color1")
    
    let deg = document.getElementById("input2").value;
    localStorage.setItem("deg", deg)
    let data2 = localStorage.getItem("deg")
    
    let color2 = document.getElementById("input3").value;
    localStorage.setItem("color2", color2)
    let data3 = localStorage.getItem("color2")

    if (color1 === "") {
        divNotify.classList.add("notify");
        textNotify.innerText = "Ingresa el color";
        notify();
    } else if (color1[0] !== allowedChar) {
        divNotify.classList.add("notify");
        textNotify.innerText = "Falte el (#)";
        notify();
    } else if (deg === "") {
        divNotify.classList.add("notify");
        textNotify.innerText = "Ingresa los grados";
        notify();
    } else if (color2 === "") {
        divNotify.classList.add("notify");
        textNotify.innerText = "Ingresa el color";
        notify();
    } else if (color2[0] !== allowedChar) {
        divNotify.classList.add("notify");
        textNotify.innerText = "Falta el (#)";
        notify();
    } else {
        createBoxGradient(color1, deg, color2);
        console.log("gradinete ingresado:" + data1, data2, data3);
        saveGradientInDB(data1, data2, data3);
    }
}

// function para crear le gradiente en vase el valor de la db
function createBoxGradient(val1, val2, val3) {
    let newCard = document.createElement("div");
    newCard.className = "border border-black dark:border-white hover:border-white dark:hover:border-cyan-400 p-3.5 rounded";
    container.appendChild(newCard);

    let codeColor = document.createElement("p");
    codeColor.className = "text-black dark:text-white text-center";
    codeColor.innerText = val1 + ', ' + val2 + ', ' + val3;
    newCard.appendChild(codeColor);

    let boxColor = document.createElement("div");
    boxColor.className = "h-10 rounded my-2.5";
    boxColor.style.backgroundImage = `linear-gradient(${val2}, ${val1}, ${val3})`;
    newCard.appendChild(boxColor);

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

    const copyGradient = async (val1, val2, val3) => {
        try {
            await navigator.clipboard.writeText(`background-image:(${val2}, ${val1}, ${val3});`);
            divNotify.classList.add("notify");
            textNotify.innerText = "Gradiente copiado";
            notify();
        } catch (error) {
            console.log("error al copiar:", error);
        }
    };

    function delet(val1, val2, val3) {
        newCard.remove();
        localStorage.removeItem("color1");
        localStorage.removeItem("deg");
        localStorage.removeItem("color2");
        divNotify.classList.add("notify");
        textNotify.innerText = "Gradiente eliminado";
        deleteGradientInDB(val1, val2, val3);
        notify();
    };

    bntCopy.addEventListener('click', function () { copyGradient(val1, val2, val3) });
    bntDelet.addEventListener('click', function () { delet(val1, val2, val3) });
}

// obtenemos los datos de la db
async function getColorsFromDB() {
    try {
        const response = await fetch("http://localhost/Tools-api/get_gradients.php");
        const result = await response.json();
        // aseguramos que  el resultado.data es un array antes de usar fetch
        if (result.status === "success" && Array.isArray(result.data)) {
            const colors = result.data;
            colors.forEach(color => {
                console.log("gradiente obtenido: ", color.firstColor,  color.deg,  color.secondColor);
                createBoxGradient(color.firstColor, color.deg, color.secondColor);
            });
        } else {
            console.log("Error en la respuesta: ", result.message || "Datos inesperados");
        }
    } catch (error) {
        console.error("error al obtener los datos")
    }
}

// function para eliminar los datos de la db
async function deleteGradientInDB(val1, val2, val3) {
    try {
        const response = await fetch("http://localhost/Tools-api/delet_gradients.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({val1:val1, val2: val2, val3: val3}),
        });
        // obtenemos la rrespuesta
        const textResponse = await response.text();
        console.log("Respuesta del servidor: ", textResponse);

        const result = await response.json();
        if (result.success) {
            console.log("Gradiente eliminado");
        } else {
            console.log("Error al eliminar: ", result.message);
        }
    } catch (error) {
        console.error("Error en la solicitud: ", error);
    }
}

// guardamos el nuevo datos en la db
async function saveGradientInDB(val1, val2, val3) {
    console.log("gradiente que se va a guardar: " , val1, val2, val3);
    try {
        const response = await fetch("http://localhost/Tools-api/save_gradients.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({val1: val1, val2: val2, val3: val3}),
        });
        const result = await response.json();
        if (result.success) {
            console.log("gradiente guardao");
        } else {
            console.log("error al guardar: ", result.message);
        }
    } catch (error) {
        console.error("error en la solucitud: ", error)
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
    getColorsFromDB()
}

window.addEventListener('keydown', (e) => {
    if (e.key === "Enter") {
        createBoxGradientWithitInput();
    }
})

createGradient.addEventListener("click", function () { createBoxGradientWithitInput(); });