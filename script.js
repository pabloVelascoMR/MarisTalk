const opcionesOriginalesBase = {
    '1': [
        "Elevator Pitch", "Defensa de un Personaje", "Improvisación", "Pechakucha", "Solución a un Problema Real"
    ],
    '2': [
        "Elevator Pitch", "Defensa de un Personaje", "Improvisación", "Pechakucha", "Solución a un Problema Real"
    ]
};

const AJUSTES_R1 = [
    1180, 1050, 1000, 1050, 1080 
];

const AJUSTES_R2 = [
    1170, 1070, 1100, 1050, 950  
];

const MAPEO_TEMAS = {
    'Elevator Pitch': 'Elevator Pitch', 'Defensa de un Personaje': 'Defensa de un Personaje', 
    'Improvisación': 'Improvisación', 'Solución a un Problema Real': 'Solución a un Problema Real', 
    
    'Elevator Pitch': 'Elevator Pitch', 'Defensa de un Personaje': 'Defensa de un Personaje', 
    'Improvisación': 'Improvisación', 'Solución a un Problema Real': 'Solución a un Problema Real' 
};

let opcionesRestantes = {}; 

function iniciarEstado() {
    const estadoGuardado = localStorage.getItem('estadoRuletas');
    
    if (estadoGuardado) {
        opcionesRestantes = JSON.parse(estadoGuardado);
        console.log("Estado de ruletas restaurado desde localStorage.");
    } else {
        opcionesRestantes = {
            '1': [...opcionesOriginalesBase['1']], 
            '2': [...opcionesOriginalesBase['2']]  
        };
        console.log("Estado de ruletas inicializado.");
    }
    
    dibujarCinta('1'); 
    dibujarCinta('2');
}


function getColorClass(index) {
    const colorIndex = (index % 5) + 1; 
    return `color-${colorIndex}`;
}

function dibujarCinta(idCaja) {
    const opcionesLogicasRestantes = opcionesRestantes[idCaja];
    const opcionesOriginales = opcionesOriginalesBase[idCaja]; 
    const cintaInnerElement = document.getElementById(`cinta-${idCaja}`);
    cintaInnerElement.innerHTML = ''; 

    if (!opcionesLogicasRestantes) return; 
    
    if (opcionesLogicasRestantes.length === 0) {
        cintaInnerElement.innerHTML = '<div class="cinta-item" style="background-color: black; color: white; ">No hay mas pruebas</div>';
        return;
    }
    
    const vueltasExtras = 20; 
    let opcionesExpandidas = [];
    
    for (let i = 0; i < vueltasExtras; i++) { 
        opcionesExpandidas = opcionesExpandidas.concat(opcionesOriginales);
    }
    
    opcionesExpandidas.forEach(opcion => {
        const div = document.createElement('div');
        div.classList.add('cinta-item');
        div.textContent = opcion;
        div.dataset.value = opcion;
        
        const originalIndex = opcionesOriginales.indexOf(opcion);
        div.classList.add(getColorClass(originalIndex));
        
        if (!opcionesLogicasRestantes.includes(opcion)) {
             div.style.backgroundColor = 'rgb(0, 0, 0)'; 
        }
        
        cintaInnerElement.appendChild(div);
    });
    
    const restantesElement = document.getElementById(`opciones-restantes-${idCaja}`);

    if (restantesElement) {
        restantesElement.textContent = opcionesLogicasRestantes.length;
    }
}

function navegarATema(opcionElegida) {
    localStorage.setItem('estadoRuletas', JSON.stringify(opcionesRestantes));
    
    const idGrupo = MAPEO_TEMAS[opcionElegida] || 'A'; 
    
    const urlDestino = `tema.html?grupo=${idGrupo}`;
    
    window.location.href = urlDestino;
}

function abrirCaja(boton) {
    const idCaja = boton.dataset.caja; 

    const opciones = opcionesRestantes[idCaja];
    const cintaInnerElement = document.getElementById(`cinta-${idCaja}`);
    const resultadoElement = document.getElementById(`resultado-${idCaja}`);
    const btnTemaElement = document.getElementById(`btn-tema-${idCaja}`); 

    if (opciones.length === 0) {
        resultadoElement.textContent = "......";
        boton.disabled = true;
        return;
    }

    boton.disabled = true; 
    resultadoElement.textContent = '.......'; 
    
    cintaInnerElement.classList.remove('desplazando');
    cintaInnerElement.style.transform = 'translateX(0)'; 
    
    void cintaInnerElement.offsetWidth; 

    const indiceAleatorio = Math.floor(Math.random() * opciones.length);
    const opcionElegida = opciones[indiceAleatorio]; 

    const itemWidth = 150; 
    const wrapperWidth = 450; 
    
    const opcionesOriginales = opcionesOriginalesBase[idCaja];
    const indiceOriginal = opcionesOriginales.indexOf(opcionElegida);
    
    let ajusteCompensacion = 0;
    if (idCaja === '1') {
        ajusteCompensacion = AJUSTES_R1[indiceOriginal];
    } else if (idCaja === '2') {
        ajusteCompensacion = AJUSTES_R2[indiceOriginal];
    }
   
    const vueltasExtras = 20; 
    let opcionesExpandidas = [];
    for (let i = 0; i < vueltasExtras; i++) { 
        opcionesExpandidas = opcionesExpandidas.concat(opcionesOriginales);
    }
    
    const startSearchIndex = (vueltasExtras - 1) * opcionesOriginales.length;
    let targetIndexInExpanded = -1;
    for (let i = startSearchIndex; i < opcionesExpandidas.length; i++) {
        if (opcionesExpandidas[i] === opcionElegida) {
            targetIndexInExpanded = i;
            break;
        }
    }

    const randomOffset = 0; 
    
    const posicionIdeal = (targetIndexInExpanded * itemWidth + (itemWidth / 2)) - (wrapperWidth / 2) + randomOffset;
    
    const finalPosition = posicionIdeal - ajusteCompensacion; 
    
    cintaInnerElement.classList.add('desplazando'); 
    cintaInnerElement.style.transform = `translateX(${-finalPosition}px)`; 
    

    setTimeout(() => {
        const finalTransformStyle = cintaInnerElement.style.transform; 
        
        resultadoElement.textContent = `¡Elegido: ${opcionElegida}!`;
        
        if (opcionElegida === "Pechakucha" ) {
            btnTemaElement.disabled = true;
            btnTemaElement.textContent = '';
            btnTemaElement.style.backgroundColor = '#6c757d'; 
            btnTemaElement.onclick = null;
        } else {

            btnTemaElement.disabled = false;
            btnTemaElement.textContent = 'IR A TEMA';
            btnTemaElement.style.backgroundColor = '#f39c12';
        
            btnTemaElement.onclick = function() { navegarATema(opcionElegida); };
        }
        
        opciones.splice(opciones.indexOf(opcionElegida), 1);
        localStorage.setItem('estadoRuletas', JSON.stringify(opcionesRestantes));
        
        cintaInnerElement.classList.remove('desplazando');
        
        dibujarCinta(idCaja); 
        
        cintaInnerElement.style.transform = finalTransformStyle; 
        
        if (opciones.length > 0) {
            boton.disabled = false;
        } else {
            boton.textContent = "VACÍA";
        }
        
    }, 10200); 
}

function resetearJuego() {
    if (confirm("¿Estás seguro de que quieres resetear el juego? Se perderán todas las tiradas y serás redirigido a la página de inicio.")) {
        
        localStorage.removeItem('estadoRuletas');
        
        window.location.href = 'index.html'; 
    }
}

document.querySelectorAll('.tirar-btn').forEach(boton => {
    boton.addEventListener('click', (event) => {
        abrirCaja(event.currentTarget);
    });
});

iniciarEstado();