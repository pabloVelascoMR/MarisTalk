const GRUPOS_DE_TEMAS = {
    'Elevator Pitch': [
        "Mi idea para mejorar el mundo","Mi colegio, mi orgullo","La tecnología del futuro" , "Un héroe anónimo al que deberíamos dar voz"
    ],
    'Defensa de un Personaje': [
        "Clara Campoamor","San Marcelino Champagnat","Desmond Doss","Marie Curie"
    ],
    'Improvisación': [
         "Clara Campoamor","San Marcelino Champagnat","Desmond Doss","Marie Curie"
    ],
    'Solución a un Problema Real': [
        "Demasiadas pantallas. La sobreutilización digital","Todos iguales, todos distintos. El reto de la inclusión"
    ]
};


const resultadoElemento = document.getElementById('resultado-tema');
const botonGirar = document.getElementById('btn-girar-tema');
const ruletaElemento = document.getElementById('ruleta-circular');

let opcionesTemaActivas = []; 


function getColorClassTema(index) {
    const colorIndex = (index % 5) + 1; 
    return `tema-color-${colorIndex}`;
}


function dibujarRuletaCircular() {
    ruletaElemento.innerHTML = ''; 
    
    const numOpciones = opcionesTemaActivas.length; 
    if (numOpciones === 0) return;

    const ANGULO_POR_SECTOR = 360 / numOpciones;
    const ANGULO_AJUSTE_CSS = ANGULO_POR_SECTOR / 2;
    
    if (numOpciones === 2) {
        ruletaElemento.style.transform = 'rotate(90deg)'; 
        
        opcionesTemaActivas.forEach((opcion, index) => {
            const sector = document.createElement('div');
            
            sector.classList.add('sector-half', getColorClassTema(index)); 
            ruletaElemento.appendChild(sector);
        });
        return; 
    }

    
    let clipPathValue = 'polygon(-5% 0%, 105% 0%, 65% 100%)'; 
    if (numOpciones === 4) {
        clipPathValue = 'polygon(-5% 0%, 105% 0%, 105% 105%, -5% 105%)'; 
    } 

    opcionesTemaActivas.forEach((opcion, index) => {
        const sector = document.createElement('div');
        sector.classList.add('sector', getColorClassTema(index));
        
        const rotation = index * ANGULO_POR_SECTOR;
        sector.style.transform = `rotate(${rotation}deg)`;
        sector.style.clipPath = clipPathValue; 
        
        
        ruletaElemento.appendChild(sector);
    });
    
    ruletaElemento.style.transform = `rotate(-${ANGULO_AJUSTE_CSS}deg)`;
}


function girarTema() {
    const numOpciones = opcionesTemaActivas.length;
    if (numOpciones === 0) {
        resultadoElemento.textContent = "Error";
        return;
    }
    
    botonGirar.disabled = true;
    resultadoElemento.textContent = '...';
    
    const ANGULO_POR_SECTOR = 360 / numOpciones;
    const ANGULO_AJUSTE_CSS = ANGULO_POR_SECTOR / 2; 

    const indiceElegido = Math.floor(Math.random() * opcionesTemaActivas.length);
    const opcionElegida = opcionesTemaActivas[indiceElegido];

    const VUELTAS = 5; 
    
    const anguloCentroSector = indiceElegido * ANGULO_POR_SECTOR;
    const anguloGiroNeto = 360 - anguloCentroSector;
    

    const ajusteFinalRotacion = numOpciones === 2 ? 0 : ANGULO_AJUSTE_CSS;

    const anguloFinal = (VUELTAS * 360) + anguloGiroNeto + ajusteFinalRotacion;
    
    ruletaElemento.classList.add('girando-tema');
    ruletaElemento.style.transform = `rotate(0deg)`; 
    void ruletaElemento.offsetWidth;
    ruletaElemento.style.transform = `rotate(${anguloFinal}deg)`;
    
    setTimeout(() => {
        resultadoElemento.textContent = `Tema: ${opcionElegida}`;
        botonGirar.disabled = false;
        ruletaElemento.classList.remove('girando-tema');
        
        const rotacionFinalLimpia = anguloFinal % 360;
        ruletaElemento.style.transform = `rotate(${rotacionFinalLimpia}deg)`;

    }, 5100); 
}


function iniciarPaginaTema() {
    const urlParams = new URLSearchParams(window.location.search);
    const idGrupo = urlParams.get('grupo'); 
    
    if (idGrupo && GRUPOS_DE_TEMAS[idGrupo]) {
        opcionesTemaActivas = GRUPOS_DE_TEMAS[idGrupo];
        document.getElementById('tema-main').querySelector('h1').textContent = `Sorteo de Tema ${idGrupo}`;
        dibujarRuletaCircular();
        botonGirar.addEventListener('click', girarTema);
    } else {
        document.getElementById('tema-main').querySelector('h1').textContent = `Error de Carga`;
        resultadoElemento.textContent = "Error: No se pudo identificar el tema a cargar.";
        botonGirar.disabled = true;
    }
}


botonGirar.addEventListener('click', girarTema);
iniciarPaginaTema();