// ==========================================================
//
// Denne filen gjør tre ting:
//   1. Sjekker at alt er fylt ut riktig før skjemaet kan sendes
//   2. Viser en feilmelding ved feltene som er feil
//   3. Viser en takk-melding når alt er i orden

// ==========================================================

// ---------- 1. Finne tingene på siden ----------
// Her "henter" vi delene av siden vi skal bruke, slik at vi kan lese
// fra dem og endre dem. Hver del finnes ved hjelp av id-en i HTML-en.

const skjema = document.querySelector("#kontakt-skjema");                    // hele skjemaet
const innhold = document.querySelector("#kontakt-innhold");                  // boksen rundt skjemaet
const bekreftelse = document.querySelector("#kontakt-bekreftelse");          // takk-boksen
const bekreftelseTekst = document.querySelector("#kontakt-bekreftelse-tekst"); // teksten inne i takk-boksen
const nyKnapp = document.querySelector("#ny-foresporsel");                   // knappen "Send en ny forespørsel"

// En samlet oversikt over alle feltene i skjemaet.
// Vi gir hvert felt et enkelt navn (firma, navn, epost ...) slik at vi kan finne dem igjen senere.
const felter = {
  firma: document.querySelector("#k-firma"),
  navn: document.querySelector("#k-navn"),
  epost: document.querySelector("#k-epost"),
  type: document.querySelector("#k-type"),
  dato: document.querySelector("#k-dato"),
  sted: document.querySelector("#k-sted"),
  gjester: document.querySelector("#k-gjester"),
  melding: document.querySelector("#k-melding")
};

// ---------- 2. Små hjelpere ----------

// Viser en feilmelding under et felt, eller fjerner den.
// Er "melding" tom, forsvinner feilen og feltet får vanlig utseende igjen.
function visFeil(felt, melding) {
  const gruppe = felt.closest(".felt");                       // finner boksen som feltet ligger i
  gruppe.querySelector(".feil").textContent = melding;       // skriver feilteksten
  gruppe.classList.toggle("har-feil", melding !== "");        // gir feltet gul ramme hvis det er en feil
}

// Sjekker om en e-postadresse ser riktig ut:
// noe + @ + noe + punktum + minst to bokstaver (f.eks. navn@epost.no)
function erGyldigEpost(epost) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(epost);
}

// ---------- 3. Sjekke ett felt ----------

// Ser på ett felt og gir tilbake en feilmelding hvis noe er galt.
// Hvis alt er i orden, gir den tilbake en tom tekst ("").
function sjekkFelt(navn) {
  const verdi = felter[navn].value.trim();   // det som er skrevet, uten mellomrom i start og slutt

  if (navn === "epost") {
    if (verdi === "") return "Skriv inn e-postadressen din.";
    if (!erGyldigEpost(verdi)) return "E-postadressen ser ikke riktig ut.";
  } else if (navn === "type") {
    if (verdi === "") return "Velg type arrangement.";
  } else if (navn === "dato") {
    // Finner dagens dato, slik at vi kan sjekke at ønsket dato ikke er passert
    const idag = new Date().toISOString().slice(0, 10);
    if (verdi === "") return "Velg ønsket dato.";
    if (verdi < idag) return "Datoen kan ikke ligge i fortiden.";
  } else if (navn === "gjester") {
    const antall = Number(verdi);
    if (verdi === "") return "Skriv inn omtrent hvor mange gjester dere blir.";
    // Må være et helt tall (ikke 2,5) mellom 1 og 5000
    if (!Number.isInteger(antall) || antall < 1 || antall > 5000) {
      return "Antall gjester må være et helt tall mellom 1 og 5000.";
    }
  } else if (navn === "melding") {
    if (verdi.length < 10) return "Skriv minst en setning om arrangementet.";
  } else if (verdi === "") {
    // Alle de andre feltene (firma, navn, sted) må bare ha noe i seg
    return "Dette feltet må fylles ut.";
  }
  return "";   // alt er ok
}

// ---------- 4. Sjekke hele skjemaet ----------

// Går gjennom alle feltene, viser feilmeldinger der det trengs,
// og flytter markøren til det første feltet som er feil.
// Gir tilbake "true" hvis alt er ok, og "false" hvis noe må rettes.
function validerSkjema() {
  let forsteFeil = null;

  for (const navn in felter) {
    const melding = sjekkFelt(navn);
    visFeil(felter[navn], melding);
    if (melding !== "" && !forsteFeil) {
      forsteFeil = felter[navn];   // husker det første feltet med feil
    }
  }

  if (forsteFeil) {
    forsteFeil.focus();   // setter markøren i feltet som må rettes
    return false;
  }
  return true;
}

// ---------- 5. Takk-meldingen ----------

// Skriver en personlig takk-tekst, skjuler skjemaet og viser bekreftelsen.
function visBekreftelse() {
  bekreftelseTekst.textContent =
    "Takk, " + felter.navn.value.trim() + "! Forespørselen fra " + felter.firma.value.trim() +
    " er sendt. Svar kommer til " + felter.epost.value.trim() + " så fort hun har fått sove.";
  innhold.hidden = true;        // skjuler skjemaet
  bekreftelse.hidden = false;   // viser takk-boksen
}

// Starter på nytt: tømmer skjemaet, fjerner feilmeldinger og viser skjemaet igjen.
function nyForesporsel() {
  skjema.reset();                       // tømmer alle feltene
  for (const navn in felter) {
    visFeil(felter[navn], "");          // fjerner alle feilmeldinger
  }
  bekreftelse.hidden = true;            // skjuler takk-boksen
  innhold.hidden = false;               // viser skjemaet igjen
  felter.firma.focus();                 // setter markøren i det første feltet
}

// ---------- 6. Reagere på det brukeren gjør ----------

// Når noen skriver i et felt som har en feilmelding, forsvinner feilen
// med en gang det som står der er blitt riktig.
for (const navn in felter) {
  felter[navn].addEventListener("input", function () {
    if (sjekkFelt(navn) === "") visFeil(felter[navn], "");
  });
}

// Når noen trykker "Send forespørsel":
skjema.addEventListener("submit", function (hendelse) {
  hendelse.preventDefault();   // stopper at siden lastes på nytt, slik nettleseren vanligvis gjør
  if (validerSkjema()) {       // bare hvis alt er riktig utfylt ...
    visBekreftelse();          // ... viser vi takk-meldingen
  }
});

// Når noen trykker "Send en ny forespørsel":
nyKnapp.addEventListener("click", nyForesporsel);