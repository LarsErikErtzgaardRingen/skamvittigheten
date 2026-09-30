// ---------- Henvendelsesskjema: "Book en sliten mamma" ----------

const skjema = document.querySelector("#kontakt-skjema");
const innhold = document.querySelector("#kontakt-innhold");
const bekreftelse = document.querySelector("#kontakt-bekreftelse");
const bekreftelseTekst = document.querySelector("#kontakt-bekreftelse-tekst");
const nyKnapp = document.querySelector("#ny-foresporsel");

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

function visFeil(felt, melding) {
  const gruppe = felt.closest(".felt");
  gruppe.querySelector(".feil").textContent = melding;
  gruppe.classList.toggle("har-feil", melding !== "");
}

function erGyldigEpost(epost) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(epost);
}

// Gir feilmelding som tekst, eller "" hvis feltet er ok
function sjekkFelt(navn) {
  const verdi = felter[navn].value.trim();

  if (navn === "epost") {
    if (verdi === "") return "Skriv inn e-postadressen din.";
    if (!erGyldigEpost(verdi)) return "E-postadressen ser ikke riktig ut.";
  } else if (navn === "type") {
    if (verdi === "") return "Velg type arrangement.";
  } else if (navn === "dato") {
    const idag = new Date().toISOString().slice(0, 10);
    if (verdi === "") return "Velg ønsket dato.";
    if (verdi < idag) return "Datoen kan ikke ligge i fortiden.";
  } else if (navn === "gjester") {
    const antall = Number(verdi);
    if (verdi === "") return "Skriv inn omtrent hvor mange gjester dere blir.";
    if (!Number.isInteger(antall) || antall < 1 || antall > 5000) {
      return "Antall gjester må være et helt tall mellom 1 og 5000.";
    }
  } else if (navn === "melding") {
    if (verdi.length < 10) return "Skriv minst en setning om arrangementet.";
  } else if (verdi === "") {
    return "Dette feltet må fylles ut.";
  }
  return "";
}

function validerSkjema() {
  let forsteFeil = null;

  for (const navn in felter) {
    const melding = sjekkFelt(navn);
    visFeil(felter[navn], melding);
    if (melding !== "" && !forsteFeil) {
      forsteFeil = felter[navn];
    }
  }

  if (forsteFeil) {
    forsteFeil.focus();
    return false;
  }
  return true;
}

function visBekreftelse() {
  bekreftelseTekst.textContent =
    "Takk, " + felter.navn.value.trim() + "! Forespørselen fra " + felter.firma.value.trim() +
    " er sendt. Svar kommer til " + felter.epost.value.trim() + " så fort hun har fått sove.";
  innhold.hidden = true;
  bekreftelse.hidden = false;
}

function nyForesporsel() {
  skjema.reset();
  for (const navn in felter) {
    visFeil(felter[navn], "");
  }
  bekreftelse.hidden = true;
  innhold.hidden = false;
  felter.firma.focus();
}

// Fjerner feilmelding så snart brukeren retter opp feltet
for (const navn in felter) {
  felter[navn].addEventListener("input", function () {
    if (sjekkFelt(navn) === "") visFeil(felter[navn], "");
  });
}

skjema.addEventListener("submit", function (hendelse) {
  hendelse.preventDefault();
  if (validerSkjema()) {
    visBekreftelse();
  }
});

nyKnapp.addEventListener("click", nyForesporsel);
