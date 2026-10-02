// ---------- 1. DATA (variabler) ----------

// Alle eventene. id-en må være lik data-id i HTML-en. NB! For å spare tid fikk jeg hjelp til å hente denne informasjonen fra Kristins eksisterende side, og generere dette:  

const events = [
  { id: "kolveireid", navn: "Kolveireid", dato: "2026-10-16", tid: "20:00", sted: "Nærøysund kulturhus, Kolveireid", pris: 349, tilgjengelig: true, bilde: "Pictures/kolvereid.png" },
  { id: "stjordal", navn: "Stjørdal", dato: "2026-10-23", tid: "20:00", sted: "Kimen kulturhus, Stjørdal", pris: 349, tilgjengelig: true, bilde: "Pictures/stjørdal.png" },
  { id: "verdal", navn: "Verdal", dato: "2026-10-29", tid: "19:30", sted: "Verdal", pris: 349, tilgjengelig: true, bilde: "Pictures/verdal.png" },
  { id: "singsas", navn: "Damenes Aften, Singsås", dato: "2026-11-07", tid: "19:00", sted: "Kotsøy Samfunnshus, Singsås/Støren", pris: 299, tilgjengelig: true, bilde: "Pictures/singsås.jpeg" },
  { id: "trondheim", navn: "Trondheim", dato: "2026-11-19", tid: "19:30", sted: "Olavshallen, Trondheim", pris: 399, tilgjengelig: true, bilde: "Pictures/trondheim.png" },
  { id: "levanger", navn: "Levanger", dato: "2026-11-20", tid: "20:00", sted: "Festiviteten Kulturhus, Levanger", pris: 349, tilgjengelig: true, bilde: "Pictures/levanger.png" },
  { id: "stavanger", navn: "Stavanger", dato: "2027-01-22", tid: "20:00", sted: "Spor 5, Stavanger", pris: 399, tilgjengelig: true, bilde: "Pictures/stavanger.png" },
  { id: "orkanger", navn: "Orkanger", dato: "2027-01-29", tid: "20:00", sted: "Damphuset, Orkanger", pris: 349, tilgjengelig: false, bilde: "Pictures/orkanger.png" },
  { id: "kristiansand", navn: "Kristiansand", dato: "2027-02-04", tid: "19:30", sted: "Teateret, Kristiansand", pris: 399, tilgjengelig: true, bilde: "Pictures/kristiansand.png" },
  { id: "steinkjer", navn: "Steinkjer", dato: "2027-03-18", tid: "19:30", sted: "Steinkjer kulturhus", pris: 349, tilgjengelig: true, bilde: "Pictures/steinkjer.png" },
  { id: "bergen", navn: "Bergen", dato: "2027-04-22", tid: "19:30", sted: "Ole Bull Scene, Bergen", pris: 399, tilgjengelig: true, bilde: "Pictures/bergen.png" }
];

const MAKS_BILLETTER = 8;

// Bookingen som pågår akkurat nå
let booking = {
  eventId: "",
  antall: 1,
  navn: "",
  epost: ""
};

// ---------- 2. HENTE ELEMENTER FRA DOM ----------

const skjema = document.querySelector("#booking-skjema");
const eventValg = document.querySelector("#event-valg");
const antallFelt = document.querySelector("#antall");
const navnFelt = document.querySelector("#navn");
const epostFelt = document.querySelector("#epost");

const oppsummeringTom = document.querySelector("#oppsummering-tom");
const oppsummeringInnhold = document.querySelector("#oppsummering-innhold");
const oppEvent = document.querySelector("#opp-event");
const oppDato = document.querySelector("#opp-dato");
const oppSted = document.querySelector("#opp-sted");
const oppPris = document.querySelector("#opp-pris");
const oppAntall = document.querySelector("#opp-antall");
const oppTotal = document.querySelector("#opp-total");

const bookingInnhold = document.querySelector("#booking-innhold");
const bekreftelse = document.querySelector("#bekreftelse");
const bekreftelseTekst = document.querySelector("#bekreftelse-tekst");
const nyBookingKnapp = document.querySelector("#ny-booking");

const velgKnapper = document.querySelectorAll(".velg-knapp");
const kort = document.querySelectorAll(".kort");

// Bilde i oppsummeringen lages med JavaScript og settes inn under overskriften
const oppBilde = document.createElement("img");
oppBilde.hidden = true;
oppBilde.width = 800;
oppBilde.height = 500;
oppBilde.style.marginBottom = "1rem";
oppBilde.style.borderRadius = "4px";
document.querySelector(".oppsummering h3").after(oppBilde);

// ---------- 3. HJELPEFUNKSJONER ----------

function finnEvent(id) {
  return events.find(function (event) {
    return event.id === id;
  });
}

function formaterPris(belop) {
  return belop.toLocaleString("nb-NO") + " kr";
}

function formaterDato(isoDato) {
  // T12:00 for å unngå at tidssoner flytter datoen
  const dato = new Date(isoDato + "T12:00:00");
  const tekst = dato.toLocaleDateString("nb-NO", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  });
  return tekst.charAt(0).toUpperCase() + tekst.slice(1);
}

function erGyldigAntall(antall) {
  return Number.isInteger(antall) && antall >= 1 && antall <= MAKS_BILLETTER;
}

function erGyldigEpost(epost) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(epost);
}

// Regner ut totalprisen for bookingen. Gir 0 hvis noe mangler.
function beregnTotal() {
  const event = finnEvent(booking.eventId);
  if (event && erGyldigAntall(booking.antall)) {
    return event.pris * booking.antall;
  } else {
    return 0;
  }
}

// ---------- 4. OPPDATERE SIDEN (DOM) ----------

function oppdaterOppsummering() {
  const event = finnEvent(booking.eventId);

  if (!event) {
    oppsummeringTom.hidden = false;
    oppsummeringInnhold.hidden = true;
    oppBilde.hidden = true;
    return;
  }

  oppsummeringTom.hidden = true;
  oppsummeringInnhold.hidden = false;

  oppBilde.src = event.bilde;
  oppBilde.alt = "Bilde for " + event.navn;
  oppBilde.hidden = false;

  oppEvent.textContent = event.navn;
  oppDato.textContent = formaterDato(event.dato) + ", kl. " + event.tid;
  oppSted.textContent = event.sted;
  oppPris.textContent = formaterPris(event.pris);

  if (erGyldigAntall(booking.antall)) {
    oppAntall.textContent = booking.antall;
    oppTotal.textContent = formaterPris(beregnTotal());
  } else {
    oppAntall.textContent = "–";
    oppTotal.textContent = "–";
  }
}

// Markerer det valgte kortet og bytter knappetekst
function oppdaterKort() {
  kort.forEach(function (k) {
    const erValgt = k.dataset.id === booking.eventId;
    k.classList.toggle("valgt", erValgt);

    const knapp = k.querySelector(".velg-knapp");
    if (!knapp.disabled) {
      knapp.textContent = erValgt ? "Valgt kveld" : "Velg denne kvelden";
    }
  });
}

function visFeil(felt, melding) {
  const gruppe = felt.closest(".felt");
  const feilTekst = gruppe.querySelector(".feil");
  feilTekst.textContent = melding;
  gruppe.classList.toggle("har-feil", melding !== "");
}

function fjernAlleFeil() {
  [eventValg, antallFelt, navnFelt, epostFelt].forEach(function (felt) {
    visFeil(felt, "");
  });
}

// ---------- 5. HANDLINGER ----------

function velgEvent(id) {
  const event = finnEvent(id);

  if (event && !event.tilgjengelig) {
    return; // billettene er ikke lagt ut ennå
  }

  booking.eventId = event ? id : "";
  eventValg.value = booking.eventId;

  if (booking.eventId) {
    visFeil(eventValg, "");
  }

  oppdaterKort();
  oppdaterOppsummering();
}

function validerSkjema() {
  let alleOk = true;
  let forsteFeil = null;

  function feil(felt, melding) {
    visFeil(felt, melding);
    alleOk = false;
    if (!forsteFeil) {
      forsteFeil = felt;
    }
  }

  fjernAlleFeil();

  if (booking.eventId === "") {
    feil(eventValg, "Velg hvilken kveld du vil se.");
  }

  if (antallFelt.value.trim() === "") {
    feil(antallFelt, "Skriv inn antall billetter.");
  } else if (!erGyldigAntall(booking.antall)) {
    feil(antallFelt, "Antall må være et helt tall mellom 1 og " + MAKS_BILLETTER + ".");
  }

  if (booking.navn.trim() === "") {
    feil(navnFelt, "Skriv inn fullt navn.");
  } else if (!booking.navn.trim().includes(" ")) {
    feil(navnFelt, "Skriv inn både fornavn og etternavn.");
  }

  if (booking.epost.trim() === "") {
    feil(epostFelt, "Skriv inn e-postadressen din.");
  } else if (!erGyldigEpost(booking.epost.trim())) {
    feil(epostFelt, "E-postadressen ser ikke riktig ut.");
  }

  if (forsteFeil) {
    forsteFeil.focus();
  }

  return alleOk;
}

function visBekreftelse() {
  const event = finnEvent(booking.eventId);
  const antall = booking.antall;
  const billettTekst = antall === 1 ? "1 billett" : antall + " billetter";
  const referanse = "SKAM-" + Math.floor(1000 + Math.random() * 9000);

  bekreftelseTekst.textContent =
    "Takk, " + booking.navn.trim() + "! Du har bestilt " + billettTekst +
    " til " + event.navn + " (" + formaterDato(event.dato) + ", kl. " + event.tid + "). " +
    "Totalt: " + formaterPris(beregnTotal()) + ". " +
    "En bekreftelse er sendt til " + booking.epost.trim() + ". " +
    "Referanse: " + referanse + ".";

  bookingInnhold.hidden = true;
  bekreftelse.hidden = false;
  bekreftelse.scrollIntoView({ behavior: "smooth", block: "center" });
}

function startNyBooking() {
  booking = { eventId: "", antall: 1, navn: "", epost: "" };

  skjema.reset();
  antallFelt.value = 1;
  fjernAlleFeil();

  bekreftelse.hidden = true;
  bookingInnhold.hidden = false;

  oppdaterKort();
  oppdaterOppsummering();
  document.querySelector("#eventer").scrollIntoView({ behavior: "smooth" });
}

// ---------- 6. EVENT LISTENERS ----------

// Klikk på "Velg denne kvelden" i et event-kort
velgKnapper.forEach(function (knapp) {
  knapp.addEventListener("click", function () {
    velgEvent(knapp.dataset.id);
    document.querySelector("#booking").scrollIntoView({ behavior: "smooth" });
  });
});

// Valg i nedtrekksmenyen
eventValg.addEventListener("change", function () {
  velgEvent(eventValg.value);
});

// Endring av antall billetter (oppdaterer totalprisen mens man skriver)
antallFelt.addEventListener("input", function () {
  booking.antall = Number(antallFelt.value);
  if (erGyldigAntall(booking.antall)) {
    visFeil(antallFelt, "");
  }
  oppdaterOppsummering();
});

navnFelt.addEventListener("input", function () {
  booking.navn = navnFelt.value;
  if (booking.navn.trim() !== "") {
    visFeil(navnFelt, "");
  }
});

epostFelt.addEventListener("input", function () {
  booking.epost = epostFelt.value;
  if (booking.epost.trim() !== "") {
    visFeil(epostFelt, "");
  }
});

// Innsending av skjemaet
skjema.addEventListener("submit", function (hendelse) {
  hendelse.preventDefault(); // hindrer at siden lastes på nytt

  if (validerSkjema()) {
    visBekreftelse();
  }
});

nyBookingKnapp.addEventListener("click", startNyBooking);

// ---------- 7. OPPSTART ----------
oppdaterKort();
oppdaterOppsummering();
