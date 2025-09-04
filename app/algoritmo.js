// Combinaciones Ganador (Cg)
const COMBINACIONES_GANADOR = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8], // Filas
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8], // Columnas
  [0, 4, 8],
  [2, 4, 6] // Diagonales
];

function algoritmo(board, emptyPositions) {
  const vacias = emptyPositions.length;
  const somosX = vacias % 2 === 1;
  const miSimbolo = somosX ? 1 : 2;
  const simboloOponente = somosX ? 2 : 1;
  const posicionesVacias = emptyPositions;

  // Movimiento 1: Centro
  if (vacias === 9) {
    return 4;
  }

  // Movimiento 2: Centro o esquina
  if (vacias === 8) {
    if (posicionesVacias.includes(4)) {
      return 4;
    }
    const esquinas = [0, 2, 6, 8];
    for (let esquina of esquinas) {
      if (posicionesVacias.includes(esquina)) {
        return esquina;
      }
    }
  }

  // Movimiento 3: Estrategia específica
  if (vacias === 7) {
    // Intentar ganar
    for (let pos of posicionesVacias) {
      const testBoard = [...board];
      testBoard[pos] = miSimbolo;
      if (verificarGanador(testBoard, miSimbolo)) {
        return pos;
      }
    }

    // Bloquear oponente
    for (let pos of posicionesVacias) {
      const testBoard = [...board];
      testBoard[pos] = simboloOponente;
      if (verificarGanador(testBoard, simboloOponente)) {
        return pos;
      }
    }

    // Estrategia posicional
    const posicionesO = board
      .map((cell, index) => (cell === simboloOponente ? index : null))
      .filter((i) => i !== null);
    const posicionO = posicionesO[0];

    if ([0, 2, 6, 8].includes(posicionO)) {
      // O en esquina - bloquear diagonal opuesta
      const diagonalOpuesta = {
        0: 8,
        2: 6,
        6: 2,
        8: 0
      };
      const posicionBloqueo = diagonalOpuesta[posicionO];
      if (posicionesVacias.includes(posicionBloqueo)) {
        return posicionBloqueo;
      }
    }

    if (posicionO === 4) {
      // O en centro - tomar esquina
      const esquinas = [0, 2, 6, 8].filter((pos) =>
        posicionesVacias.includes(pos)
      );
      if (esquinas.length > 0) return esquinas[0];
    }

    if ([1, 3, 5, 7].includes(posicionO)) {
      // O en borde - bloquear fila/columna
      const fila = Math.floor(posicionO / 3);
      const columna = posicionO % 3;

      for (let i = 0; i < 3; i++) {
        const posFila = fila * 3 + i;
        const posColumna = i * 3 + columna;

        if (posicionesVacias.includes(posFila) && posFila !== posicionO) {
          return posFila;
        }
        if (posicionesVacias.includes(posColumna) && posColumna !== posicionO) {
          return posColumna;
        }
      }
    }

    return posicionesVacias[0];
  }

  // Movimientos 4+: Estrategia avanzada
  if (vacias <= 6) {
    // Intentar ganar
    const movimientoGanador = buscarMovimientoGanador(
      board,
      posicionesVacias,
      miSimbolo
    );
    if (movimientoGanador !== null) {
      return movimientoGanador;
    }

    // Bloquear oponente
    const movimientoBloqueo = buscarMovimientoGanador(
      board,
      posicionesVacias,
      simboloOponente
    );
    if (movimientoBloqueo !== null) {
      return movimientoBloqueo;
    }

    // Completar combinación propia
    const movimientoCompletar = buscarMovimientoCompletar(
      board,
      posicionesVacias,
      miSimbolo
    );
    if (movimientoCompletar !== null) {
      return movimientoCompletar;
    }

    // Bloquear combinación oponente
    const movimientoBloquearCombinacion = buscarMovimientoCompletar(
      board,
      posicionesVacias,
      simboloOponente
    );
    if (movimientoBloquearCombinacion !== null) {
      return movimientoBloquearCombinacion;
    }

    // Estrategia posicional
    return estrategiaPosicional(posicionesVacias);
  }

  return posicionesVacias[0];
}

function buscarMovimientoGanador(board, posicionesVacias, simbolo) {
  for (const posicion of posicionesVacias) {
    const tableroPrueba = [...board];
    tableroPrueba[posicion] = simbolo;
    if (verificarGanador(tableroPrueba, simbolo)) {
      return posicion;
    }
  }
  return null;
}

function buscarMovimientoCompletar(board, posicionesVacias, simbolo) {
  for (const combinacion of COMBINACIONES_GANADOR) {
    const posicionesCombinacion = combinacion.filter(
      (pos) => board[pos] === simbolo
    );

    if (posicionesCombinacion.length === 2) {
      const posicionFaltante = combinacion.find((pos) => board[pos] === 0);
      if (
        posicionFaltante !== undefined &&
        posicionesVacias.includes(posicionFaltante)
      ) {
        return posicionFaltante;
      }
    }
  }
  return null;
}

function estrategiaPosicional(posicionesVacias) {
  const centro = 4;
  if (posicionesVacias.includes(centro)) {
    return centro;
  }

  const esquinas = [0, 2, 6, 8].filter((pos) => posicionesVacias.includes(pos));
  if (esquinas.length > 0) {
    return esquinas[0];
  }

  const bordes = [1, 3, 5, 7].filter((pos) => posicionesVacias.includes(pos));
  if (bordes.length > 0) {
    return bordes[0];
  }

  return posicionesVacias[0];
}

function verificarGanador(board, simbolo) {
  return COMBINACIONES_GANADOR.some((combinacion) =>
    combinacion.every((posicion) => board[posicion] === simbolo)
  );
}

export default algoritmo;
