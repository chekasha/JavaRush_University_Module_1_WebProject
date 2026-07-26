
// HEADER

const siteHeader = document.getElementById("site-header");
let isFixed = false;

window.addEventListener("scroll", function () {
    if (window.scrollY > 20 && !isFixed) {
        isFixed = true;
        siteHeader.classList.add("site-header--fixed");
    }

    if (window.scrollY <= 20 && isFixed) {
        isFixed = false;
        siteHeader.classList.remove("site-header--fixed");
    }
});


// MOB MENU

const openMobMenuBtn = document.getElementById("header-burger");
const closeMobMenuBtn = document.getElementById("modal-close");
const mobileNavMenu = document.getElementById("modal-menu");
const mobileNavLinks = document.getElementsByClassName("modal-menu-list__link");
const bodyEl = document.getElementById("bodyEl");

openMobMenuBtn.addEventListener("click", function() {
    bodyEl.classList.add("disable-scroll");
    openMobMenuBtn.classList.add("header-burger-menu--hidden");
    mobileNavMenu.classList.add("modal-menu--active");
});

closeMobMenuBtn.addEventListener("click", function() {
    bodyEl.classList.remove("disable-scroll");
    openMobMenuBtn.classList.remove("header-burger-menu--hidden");
    mobileNavMenu.classList.remove("modal-menu--active");
});

for (const link of mobileNavLinks) {
    link.addEventListener("click", function() {
        bodyEl.classList.remove("disable-scroll");
        openMobMenuBtn.classList.remove("header-burger-menu--hidden");
        mobileNavMenu.classList.remove("modal-menu--active");
    });
}

// SIGN UP

const departureDateInput = document.getElementById("departure-date-input");
const returnDateInput = document.getElementById("return-date-input");
const signupBtn = document.getElementById("signup-btn");

// TRIP OPTIONS

const roundTripBtn = document.getElementById("hero-round-trip-btn");
const oneWayBtn = document.getElementById("hero-one-way-btn");
const increaseTravelersBtn = document.getElementById("hero-increase-btn");
const decreaseTravelersBtn = document.getElementById("hero-decrease-btn");
const travelersCountInput = document.getElementById("hero-travelers-input");

// Toggle active state between round trip and one way buttons
roundTripBtn.addEventListener("click", function() {
    roundTripBtn.classList.add("hero-trip-options__bullet--active");
    oneWayBtn.classList.remove("hero-trip-options__bullet--active");
    returnDateInput.removeAttribute("disabled"); // Enable return date for round trip
    validateForm();
});

oneWayBtn.addEventListener("click", function() {
    oneWayBtn.classList.add("hero-trip-options__bullet--active");
    roundTripBtn.classList.remove("hero-trip-options__bullet--active");
    returnDateInput.setAttribute("disabled", "true"); // Disable return date for one way
    validateForm();
});

// Limit travelers count between 1 and 12
increaseTravelersBtn.addEventListener("click", function() {
    let currentValue = parseInt(travelersCountInput.value);
    if (currentValue < 12) {
        travelersCountInput.value = currentValue + 1;
    }
    validateForm();
});

decreaseTravelersBtn.addEventListener("click", function() {
    let currentValue = parseInt(travelersCountInput.value);
    if (currentValue > 1) {
        travelersCountInput.value = currentValue - 1;
    }
    validateForm();
});

// STATIONS

const departureStationInput = document.getElementById("departure-station-input");
const arrivalStationInput = document.getElementById("arrival-station-input");
const departureStationList = document.getElementById("departure-station-list");
const arrivalStationList = document.getElementById("arrival-station-list");

// Alpine stations grouped by country
const stations = {
    "Switzerland": [
        "Zermatt Bus Terminal",
        "Interlaken Ost Bus Station",
        "Grindelwald Bus Terminal",
        "Lauterbrunnen Bahnhof",
        "Lucerne Bahnhofquai",
        "Geneva Bus Station",
        "Bern PostAuto Terminal",
        "Gstaad Bus Station",
        "St. Moritz Bahnhof PostAuto",
        "Verbier Village",
        "Davos Platz Postautohaltestelle",
        "Andermatt Gotthardpass",
        "Täsch Bahnhof (Shuttle to Zermatt)",
        "Flims Dorf Post"
    ],
    "France": [
        "Chamonix-Mont-Blanc Sud",
        "Chamonix Sud Bus Station",
        "Annecy Gare Routière",
        "Grenoble Gare Routière",
        "Nice Airport (Bus to Alps)",
        "Bourg-Saint-Maurice Gare Routière",
        "Morzine Gare Routière",
        "Les Gets Gare Routière",
        "Val d'Isère Centre",
        "Courchevel 1850",
        "Megève Place du Village"
    ],
    "Italy": [
        "Aosta Autostazione",
        "Bolzano Autostazione",
        "Trento Autostazione",
        "Cortina d'Ampezzo Autostazione",
        "Bormio Bus Station",
        "Livigno Centro",
        "Merano Autostazione",
        "Sestriere Bus Stop",
        "Ortisei (St. Ulrich) Autostazione",
        "Canazei Piazza Marconi"
    ],
    "Austria": [
        "Innsbruck Hauptbahnhof Bus Terminal",
        "Salzburg Süd Busbahnhof",
        "Mayrhofen Bahnhof",
        "Lech am Arlberg Postamt",
        "Kitzbühel Hahnenkammbahn",
        "Ischgl Seilbahn",
        "Zell am See Postplatz",
        "Bad Gastein Bahnhof",
        "St. Anton am Arlberg Bahnhof",
        "Sölden Postamt"
    ],
    "Germany": [
        "Garmisch-Partenkirchen Bahnhof (Bus Station)",
        "Berchtesgaden Busbahnhof",
        "Oberstdorf Busbahnhof",
        "Füssen Bahnhof (Bus Station)",
        "Mittenwald Bahnhof (Bus Station)"
    ],
    "Slovenia": [
        "Bled Bus Station",
        "Bohinj Jezero",
        "Kranjska Gora Avtobusna Postaja"
    ]
};

// Build and display autocomplete dropdown with filtered stations
function showStationList(listElement, query = "", excludeStation = "") {
    let html = "";
    const lowerQuery = query.toLowerCase();

    Object.keys(stations).forEach(country => {
        const filteredStations = stations[country].filter(station => {
            const stationWithCountry = `${station}, ${country}`;
            const matchesQuery = query.length >= 2
                ? station.toLowerCase().includes(lowerQuery) // Filter only if 2+ chars entered
                : true;
            const notExcluded = stationWithCountry !== excludeStation; // Prevent selecting same station twice
            return matchesQuery && notExcluded;
        });

        // Group stations by country in dropdown
        if (filteredStations.length > 0) {
            html += `<div class="autocomplete-station-list__group-title">${country}</div>`;
            html += filteredStations.map(station =>
                `<div class="autocomplete-station-list__item" data-value="${station}, ${country}">${station}</div>`
            ).join("");
        }
    });

    listElement.innerHTML = html;
    listElement.classList.add("active");
}

// Show dropdown on input, click, or focus events
departureStationInput.addEventListener("input", (e) => {
    showStationList(departureStationList, e.target.value, arrivalStationInput.value);
    validateForm();
});

departureStationInput.addEventListener("click", () => {
    showStationList(departureStationList, departureStationInput.value, arrivalStationInput.value);
});

departureStationInput.addEventListener("focus", () => {
    showStationList(departureStationList, departureStationInput.value, arrivalStationInput.value);
});

arrivalStationInput.addEventListener("input", (e) => {
    showStationList(arrivalStationList, e.target.value, departureStationInput.value);
    validateForm();
});

arrivalStationInput.addEventListener("click", () => {
    showStationList(arrivalStationList, arrivalStationInput.value, departureStationInput.value);
});

arrivalStationInput.addEventListener("focus", () => {
    showStationList(arrivalStationList, arrivalStationInput.value, departureStationInput.value);
});

// Select station from dropdown and populate input
departureStationList.addEventListener("click", (e) => {
    if (e.target.classList.contains("autocomplete-station-list__item")) {
        departureStationInput.value = e.target.dataset.value;
        departureStationList.classList.remove("active");
        validateForm();
    }
});

arrivalStationList.addEventListener("click", (e) => {
    if (e.target.classList.contains("autocomplete-station-list__item")) {
        arrivalStationInput.value = e.target.dataset.value;
        arrivalStationList.classList.remove("active");
        validateForm();
    }
});

// Close dropdowns when clicking outside
document.addEventListener("click", (e) => {
    const clickedElement = e.target;

    if (!clickedElement.closest("#departure-station-input") && !clickedElement.closest("#departure-station-list")) {
        departureStationList.classList.remove("active");
    }

    if (!clickedElement.closest("#arrival-station-input") && !clickedElement.closest("#arrival-station-list")) {
        arrivalStationList.classList.remove("active");
    }
});

// DATES

// Convert Date object to YYYY-MM-DD string format for date input
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // padStart adds leading zero if month is single digit (e.g., "5" becomes "05")
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

function addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

// Set departure date minimum to today
const today = new Date();
today.setHours(0, 0, 0, 0);
departureDateInput.setAttribute("min", formatDate(today));

// Keep return date at least 2 days after departure
function updateReturnMinDate() {
    if (departureDateInput.value) {
        const departureDate = new Date(departureDateInput.value + "T00:00:00"); // "T00:00:00" sets time to midnight, prevents timezone issues when comparing dates
        const minReturnDate = addDays(departureDate, 2);
        returnDateInput.setAttribute("min", formatDate(minReturnDate));

        // Clear return date if it becomes invalid after departure change
        if (returnDateInput.value) {
            const currentReturnDate = new Date(returnDateInput.value + "T00:00:00");
            if (currentReturnDate < minReturnDate) {
                returnDateInput.value = "";
                toggleHasValueClass(returnDateInput);
            }
        }
    } else {
        const minReturnDate = addDays(today, 2);
        returnDateInput.setAttribute("min", formatDate(minReturnDate));
    }
}

// Validate 2-day minimum gap between departure and return
function validateReturnDate() {
    if (departureDateInput.value && returnDateInput.value) {
        const departureDate = new Date(departureDateInput.value + "T00:00:00");
        const returnDate = new Date(returnDateInput.value + "T00:00:00");
        const minReturnDate = addDays(departureDate, 2);

        if (returnDate < minReturnDate) {
            returnDateInput.value = "";
            toggleHasValueClass(returnDateInput);
            alert("The return date must be at least 2 days after the departure date");
        }
    }
}

updateReturnMinDate();

// Visual indicator for date inputs with values
function toggleHasValueClass(input) {
    if (input.value) {
        input.classList.add("has-value");
    } else {
        input.classList.remove("has-value");
    }
}

departureDateInput.addEventListener("change", function() {
    toggleHasValueClass(this);
    updateReturnMinDate();
    validateForm();
});

departureDateInput.addEventListener("input", function() {
    toggleHasValueClass(this);
    updateReturnMinDate();
    validateForm();
});

returnDateInput.addEventListener("change", function() {
    toggleHasValueClass(this);
    validateReturnDate();
    validateForm();
});

returnDateInput.addEventListener("input", function() {
    toggleHasValueClass(this);
    validateReturnDate();
    validateForm();
});

toggleHasValueClass(departureDateInput);
toggleHasValueClass(returnDateInput);

// FORM VALIDATION

// Enable submit button only when all required fields are filled
function validateForm() {
    const isRoundTrip = roundTripBtn.classList.contains("hero-trip-options__bullet--active");
    const hasDepartureStation = departureStationInput.value.trim() !== "";
    const hasArrivalStation = arrivalStationInput.value.trim() !== "";
    const hasDepartureDate = departureDateInput.value !== "";
    const hasReturnDate = returnDateInput.value !== "";

    let isValid = false;

    // Round trip requires return date, one way doesn't
    if (isRoundTrip) {
        isValid = hasDepartureStation && hasArrivalStation && hasDepartureDate && hasReturnDate;
    } else {
        isValid = hasDepartureStation && hasArrivalStation && hasDepartureDate;
    }

    if (isValid) {
        signupBtn.classList.remove("button--disabled");
    } else {
        signupBtn.classList.add("button--disabled");
    }
}

// Collect and log form data on submit
signupBtn.addEventListener("click", function() {
    if (!signupBtn.classList.contains("button--disabled")) {
        const isRoundTrip = roundTripBtn.classList.contains("hero-trip-options__bullet--active");
        const activeBtn = isRoundTrip ? roundTripBtn : oneWayBtn;

        const formData = {
            travelType: activeBtn.getAttribute("data-value"),
            travelers: travelersCountInput.value,
            departureStation: departureStationInput.value,
            arrivalStation: arrivalStationInput.value,
            departureDate: departureDateInput.value
        };

        // Add return date only for round trips
        if (isRoundTrip) {
            formData.returnDate = returnDateInput.value;
        }

        console.log("Form Data:", formData);
        // Once again in JSON format
        console.log("JSON:", JSON.stringify(formData, null, 2));
    }
});

validateForm();

// FAQs

const faqItems = document.getElementsByClassName("faq-item__head");

for (const faqItem of faqItems) {
    faqItem.addEventListener("click", function () {
        faqItem.closest(".faq-item").classList.toggle("faq-item--open");
    });
}


// FOOTER

const date = new Date();
const footerCopy = document.getElementById("site-footer-copyright");

footerCopy.innerHTML = `English: © ${date.getFullYear()} Peak Passages.<br/>All Rights Reserved (Especially the Window Seats).`;
