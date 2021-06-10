const categoria = {
    CU: 'Cultura',
    SU: 'Supervivencia',
    OV: 'Ocio-vicio',
    EX: 'Extra'
}

let losMovimientos //variable global sin nada, para guardar los movimientos "pa' luego"

function detallaMovimiento(id) {
    let movimiento
    for (let i=0; i<losMovimientos.length; i++) {
        const item = losMovimientos[i]
        if (item.id == id) {
            movimiento = item
            break
        }
    }

    if (!movimiento) return //esto es si la variable movimiento no existe.

    document.querySelector("#fecha").value = movimiento.fecha
    document.querySelector("#concepto").value = movimiento.concepto
    document.querySelector("#categoria").value = movimiento.categoria
    document.querySelector("#cantidad").value = movimiento.cantidad.toFixed(2) //toFixe pone 2 decimales
    if (movimiento.esGasto == 1) {
        document.querySelector("#gasto").checked = true
    } else {
        document.querySelector("#ingreso").checked = true
    }
}

function muestraMovimientos() {
    if (this.readyState === 4 && this.status === 200) {
        const respuesta = JSON.parse(this.responseText)

        if (respuesta.status !== 'success') {
            alert("Se ha producido un error en la consulta de movimientos")
            return
        }

        losMovimientos = respuesta.movimientos

        for (let i = 0; i < respuesta.movimientos.length; i++) {
            const movimiento = respuesta.movimientos[i]
            const fila = document.createElement("tr")
            fila.addEventListener("click", () => {
                detallaMovimiento(movimiento.id)
            })

            const dentro = `
                <td>${movimiento.fecha}</td>
                <td>${movimiento.concepto}</td>
                <td>${movimiento.esGasto ? "Gasto" : "Ingreso"}</td>
                <td>${movimiento.categoria ? categoria[movimiento.categoria] : ""}</td>
                <td>${movimiento.cantidad} €</td>
            `
            fila.innerHTML = dentro
            const tbody = document.querySelector(".tabla-movimientos tbody")
            tbody.appendChild(fila)
        }
    }
}

xhr = new XMLHttpRequest()
xhr.onload = muestraMovimientos

function llamarApiMovimientos() {
    xhr.open('GET', `http://localhost:5000/api/v1/movimientos`, true)
    xhr.send()
}

window.onload = function () {
    llamarApiMovimientos()

}