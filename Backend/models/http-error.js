//Alador
/**
 *dette er en logikk for feilhåndtering i hele backend. jeg bruker dette først og fremst i controller.js-filene
 *der jeg lager en ny konstant av denne HttpError-klassen og legger til en feilmelding med en feilkode
 */
class HttpError extends Error {
  constructor(message, errorCode) {
    super(message);
    this.code = errorCode;
  }
}

module.exports = HttpError;
