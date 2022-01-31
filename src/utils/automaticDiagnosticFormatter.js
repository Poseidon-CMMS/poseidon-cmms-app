export const automaticDiagnosticFormatter = (statusCode) => {
  switch (statusCode) {
    case 0:
      return "Todo funciona normalmente";
    case 1:
      return "Revisar NODO GPS";
    case 2:
      return "Revisar sensor de presión";
    case 3:
      return "Revisar todos los dispositivos";
    default:
        return `Diagnostico automatico desconocido: ${statusCode}`;
  }
};
