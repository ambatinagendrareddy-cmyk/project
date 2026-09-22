/* =====================================================
   WORLD CURRENCY EXCHANGE
   Main JavaScript
===================================================== */


const CURRENCIES = {

    USD: {
        name: "US Dollar",
        country: "us",
        flag: "🇺🇸",
        symbol: "$"
    },

    INR: {
        name: "Indian Rupee",
        country: "in",
        flag: "🇮🇳",
        symbol: "₹"
    },

    EUR: {
        name: "Euro",
        country: "eu",
        flag: "🇪🇺",
        symbol: "€"
    },

    GBP: {
        name: "British Pound",
        country: "gb",
        flag: "🇬🇧",
        symbol: "£"
    },

    JPY: {
        name: "Japanese Yen",
        country: "jp",
        flag: "🇯🇵",
        symbol: "¥"
    },

    KWD: {
        name: "Kuwaiti Dinar",
        country: "kw",
        flag: "🇰🇼",
        symbol: "د.ك"
    },

    CNY: {
        name: "Chinese Yuan",
        country: "cn",
        flag: "🇨🇳",
        symbol: "¥"
    },

    CAD: {
        name: "Canadian Dollar",
        country: "ca",
        flag: "🇨🇦",
        symbol: "C$"
    },

    AUD: {
        name: "Australian Dollar",
        country: "au",
        flag: "🇦🇺",
        symbol: "A$"
    },

    CHF: {
        name: "Swiss Franc",
        country: "ch",
        flag: "🇨🇭",
        symbol: "CHF"
    },

    BHD: {
        name: "Bahraini Dinar",
        country: "bh",
        flag: "🇧🇭",
        symbol: "د.ب"
    },

    AED: {
        name: "UAE Dirham",
        country: "ae",
        flag: "🇦🇪",
        symbol: "د.إ"
    },

    SGD: {
        name: "Singapore Dollar",
        country: "sg",
        flag: "🇸🇬",
        symbol: "S$"
    },

    DZD: {
        name: "Algerian Dinar",
        country: "dz",
        flag: "🇩🇿",
        symbol: "دج"
    }

};

function getCountryCode(currencyCode) {
    const curr = CURRENCIES[currencyCode];
    if (curr && curr.country) return curr.country.toLowerCase();
    return (currencyCode || "us").slice(0, 2).toLowerCase();
}

function getFlagImgHtml(currencyCode, size = "md", extraClass = "") {
    const curr = CURRENCIES[currencyCode] || {};
    const country = getCountryCode(currencyCode);
    const flagEmoji = curr.flag || "";
    const name = curr.name || currencyCode;

    let width = 20;
    let height = 14;
    if (size === "sm") {
        width = 18;
        height = 12;
    } else if (size === "badge" || size === "table") {
        width = 22;
        height = 15;
    } else if (size === "xs") {
        width = 15;
        height = 10;
    }

    return `<img src="https://flagcdn.com/w40/${country}.png" ` +
           `srcset="https://flagcdn.com/w40/${country}.png 1x, https://flagcdn.com/w80/${country}.png 2x" ` +
           `width="${width}" height="${height}" ` +
           `alt="${flagEmoji} ${name} flag" ` +
           `class="currency-flag-img ${extraClass}" ` +
           `loading="lazy" ` +
           `onerror="this.onerror=null;this.replaceWith(document.createTextNode('${flagEmoji} '));">`;
}


const API_URL =
    "https://api.frankfurter.dev/v1/latest";

const FALLBACK_API_URL =
    "https://open.er-api.com/v6/latest";


const USERS_KEY =
    "worldCurrencyUsers";


const SESSION_KEY =
    "worldCurrencySession";


/* =====================================================
   THEME CONTROLLER (LIGHT / DARK MODE)
===================================================== */

const THEME_KEY = "worldCurrencyTheme";

function getStoredTheme() {
    try {
        return localStorage.getItem(THEME_KEY) || "light";
    } catch {
        return "light";
    }
}

function setStoredTheme(theme) {
    try {
        localStorage.setItem(THEME_KEY, theme);
    } catch {
        // Storage disabled or blocked
    }
}

function isAuthPage() {
    return (
        document.body.classList.contains("auth-page") ||
        document.getElementById("loginForm") !== null ||
        document.getElementById("registerForm") !== null ||
        document.getElementById("forgotForm") !== null ||
        window.location.pathname.endsWith("login.html") ||
        window.location.pathname.endsWith("register.html") ||
        window.location.pathname.endsWith("forgot-password.html")
    );
}

function updateThemeToggleUI(theme) {
    const toggleButtons = document.querySelectorAll(".theme-toggle, #themeToggle");
    toggleButtons.forEach(button => {
        if (theme === "dark") {
            button.innerHTML = '<i class="fa-solid fa-sun" style="color: #fbbf24;"></i> <span class="theme-toggle-text">Light Mode</span>';
            button.setAttribute("title", "Switch to Light Mode");
            button.setAttribute("aria-label", "Switch to Light Mode");
        } else {
            button.innerHTML = '<i class="fa-solid fa-moon" style="color: #6366f1;"></i> <span class="theme-toggle-text">Dark Mode</span>';
            button.setAttribute("title", "Switch to Dark Mode");
            button.setAttribute("aria-label", "Switch to Dark Mode");
        }
    });
}

function applyTheme(theme, persist = false) {
    const validTheme = theme === "dark" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", validTheme);
    updateThemeToggleUI(validTheme);
    if (persist) {
        setStoredTheme(validTheme);
    }
}

function initTheme() {
    // Rule: The Login page must always open in the default LIGHT/WHITE appearance.
    // It should not automatically become dark just because the rest of the website is currently in Dark Mode.
    if (isAuthPage()) {
        applyTheme("light", false);
    } else {
        const savedTheme = getStoredTheme();
        applyTheme(savedTheme, false);
    }

    const toggleButtons = document.querySelectorAll(".theme-toggle, #themeToggle");
    toggleButtons.forEach(button => {
        button.addEventListener("click", () => {
            const currentTheme = document.documentElement.getAttribute("data-theme") || "light";
            const newTheme = currentTheme === "dark" ? "light" : "dark";
            applyTheme(newTheme, true);
        });
    });
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initTheme);
} else {
    initTheme();
}


/* =====================================================
   COMMON FUNCTIONS
===================================================== */


function getElement(id) {

    return document.getElementById(id);

}


function getUsers() {
    try {
        const data = localStorage.getItem(USERS_KEY) || localStorage.getItem("wce_users");
        return data ? JSON.parse(data) : [];
    } catch {
        return [];
    }
}


function saveUsers(users) {
    try {
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
        localStorage.setItem("wce_users", JSON.stringify(users));
    } catch {}
}


function getSession() {
    try {
        const session = localStorage.getItem(SESSION_KEY) || sessionStorage.getItem(SESSION_KEY);
        if (session) return session;

        const wceUser = sessionStorage.getItem("wce_currentUser") || localStorage.getItem("wce_currentUser");
        if (wceUser) {
            try {
                const parsed = JSON.parse(wceUser);
                return parsed.email || parsed.name || wceUser;
            } catch {
                return wceUser;
            }
        }
        return null;
    } catch {
        return null;
    }
}


function setSession(email) {
    try {
        localStorage.setItem(SESSION_KEY, email);
        sessionStorage.setItem(SESSION_KEY, email);
        sessionStorage.setItem("wce_currentUser", JSON.stringify({ email: email }));
    } catch {}
}


function clearSession() {
    try {
        localStorage.removeItem(SESSION_KEY);
        sessionStorage.removeItem(SESSION_KEY);
        sessionStorage.removeItem("wce_currentUser");
        localStorage.removeItem("wce_currentUser");
    } catch {}
}


function validEmail(email) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        .test(email);

}


function showMessage(
    element,
    message,
    type = "error"
) {

    if (!element) return;

    element.textContent = message;

    element.className =
        `form-message ${type}`;

}


function showToast(
    message,
    type = "success"
) {

    const container =
        getElement("toastContainer");

    if (!container) return;

    const toast =
        document.createElement("div");

    toast.className =
        `toast ${type}`;

    toast.textContent =
        message;

    container.appendChild(toast);

    setTimeout(() => {

        toast.remove();

    }, 3000);

}



/* =====================================================
   PASSWORD VISIBILITY
===================================================== */


document
    .querySelectorAll(".password-toggle")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const input =
                    getElement(
                        button.dataset.target
                    );

                if (!input) return;

                if (
                    input.type === "password"
                ) {

                    input.type = "text";

                    button.innerHTML =
                        '<i class="fa-regular fa-eye-slash"></i>';

                } else {

                    input.type = "password";

                    button.innerHTML =
                        '<i class="fa-regular fa-eye"></i>';

                }

            }
        );

    });



/* =====================================================
   PAGE PROTECTION
===================================================== */


if (
    document.body.dataset.protected === "true"
) {

    if (!getSession()) {

        window.location.href =
            "login.html";

    }

}



/* =====================================================
   LOGIN
===================================================== */


const loginForm =
    getElement("loginForm");


if (loginForm) {

    loginForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const email =
                getElement("loginEmail")
                    .value
                    .trim()
                    .toLowerCase();


            const password =
                getElement("loginPassword")
                    .value;


            const message =
                getElement("loginMessage");


            if (!validEmail(email)) {

                showMessage(
                    message,
                    "Please enter a valid email address."
                );

                return;

            }


            if (!password) {

                showMessage(
                    message,
                    "Please enter your password."
                );

                return;

            }


            const users =
                getUsers();


            const user =
                users.find(
                    item =>
                        item.email === email &&
                        item.password === password
                );


            if (!user) {

                showMessage(
                    message,
                    "Invalid email or password."
                );

                return;

            }


            setSession(email);


            showMessage(
                message,
                "Login successful. Redirecting...",
                "success"
            );


            setTimeout(() => {

                window.location.href =
                    "index.html";

            }, 700);

        }
    );

}



/* =====================================================
   REGISTRATION
===================================================== */


const registerForm =
    getElement("registerForm");


if (registerForm) {

    registerForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const name =
                getElement("regName")
                    .value
                    .trim();


            const email =
                getElement("regEmail")
                    .value
                    .trim()
                    .toLowerCase();


            const phone =
                getElement("regPhone")
                    .value
                    .trim();


            const country =
                getElement("regCountry")
                    .value;


            const password =
                getElement("regPassword")
                    .value;


            const confirm =
                getElement("regConfirm")
                    .value;


            const terms =
                getElement("regTerms")
                    .checked;


            const message =
                getElement("registerMessage");


            if (name.length < 2) {

                showMessage(
                    message,
                    "Please enter your full name."
                );

                return;

            }


            if (
                !/^[0-9+\-\s()]{7,20}$/
                    .test(phone)
            ) {

                showMessage(
                    message,
                    "Please enter a valid phone number."
                );

                return;

            }


            if (!validEmail(email)) {

                showMessage(
                    message,
                    "Please enter a valid email address."
                );

                return;

            }


            if (!country) {

                showMessage(
                    message,
                    "Please select your country."
                );

                return;

            }


            if (password.length < 6) {

                showMessage(
                    message,
                    "Password must contain at least 6 characters."
                );

                return;

            }


            if (password !== confirm) {

                showMessage(
                    message,
                    "Passwords do not match."
                );

                return;

            }


            if (!terms) {

                showMessage(
                    message,
                    "Please accept the terms and conditions."
                );

                return;

            }


            const users =
                getUsers();


            if (
                users.some(
                    user =>
                        user.email === email
                )
            ) {

                showMessage(
                    message,
                    "An account with this email already exists."
                );

                return;

            }


            users.push({

                name,
                email,
                phone,
                country,
                password

            });


            saveUsers(users);


            showMessage(
                message,
                "Account created successfully!",
                "success"
            );


            setTimeout(() => {

                window.location.href =
                    "login.html";

            }, 1000);

        }
    );

}



/* =====================================================
   FORGOT PASSWORD
===================================================== */


const forgotForm =
    getElement("forgotForm");


if (forgotForm) {

    forgotForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const email =
                getElement("forgotEmail")
                    .value
                    .trim()
                    .toLowerCase();


            const password =
                getElement("newPassword")
                    .value;


            const confirm =
                getElement("confirmNewPassword")
                    .value;


            const message =
                getElement("forgotMessage");


            if (!validEmail(email)) {

                showMessage(
                    message,
                    "Please enter a valid email."
                );

                return;

            }


            if (password.length < 6) {

                showMessage(
                    message,
                    "Password must contain at least 6 characters."
                );

                return;

            }


            if (password !== confirm) {

                showMessage(
                    message,
                    "Passwords do not match."
                );

                return;

            }


            const users =
                getUsers();


            const index =
                users.findIndex(
                    user =>
                        user.email === email
                );


            if (index === -1) {

                showMessage(
                    message,
                    "No account found for this email."
                );

                return;

            }


            users[index].password =
                password;


            saveUsers(users);


            showMessage(
                message,
                "Password updated successfully!",
                "success"
            );


            setTimeout(() => {

                window.location.href =
                    "login.html";

            }, 1000);

        }
    );

}



/* =====================================================
   LOGOUT
===================================================== */


const logoutButton =
    getElement("logoutButton");


if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        function() {

            clearSession();

            showToast(
                "Logged out successfully."
            );


            setTimeout(() => {

                window.location.href =
                    "login.html";

            }, 500);

        }
    );

}



/* =====================================================
   MOBILE MENU
===================================================== */


const menuButton =
    getElement("menuButton");


const navigation =
    getElement("navigation");


if (menuButton && navigation) {

    menuButton.addEventListener(
        "click",
        function() {

            navigation.classList.toggle(
                "open"
            );

        }
    );


    navigation
        .querySelectorAll("a")
        .forEach(link => {

            link.addEventListener(
                "click",
                () => {

                    navigation.classList.remove(
                        "open"
                    );

                }
            );

        });

}



/* =====================================================
   SHOW CURRENT USER & NAV AUTH STATE
===================================================== */

function updateNavAuthState() {
    const sessionEmail = getSession();
    const userProfileBadge = getElement("userProfileBadge") || document.querySelector(".user-profile");
    const logoutBtn = getElement("logoutButton");
    const loginLink = getElement("navLoginLink");
    const userSpan = getElement("userName");

    if (sessionEmail) {
        const users = getUsers();
        const user = users.find(item => item.email === sessionEmail);
        if (user && userSpan) {
            userSpan.textContent = user.name;
        }
        if (userProfileBadge) userProfileBadge.style.display = "inline-flex";
        if (logoutBtn) logoutBtn.style.display = "inline-flex";
        if (loginLink) loginLink.style.display = "none";
    } else {
        if (userProfileBadge) userProfileBadge.style.display = "none";
        if (logoutBtn) logoutBtn.style.display = "none";
        if (loginLink) loginLink.style.display = "inline-flex";
    }
}

updateNavAuthState();



/* =====================================================
   CURRENCY DROPDOWNS
===================================================== */


const fromCurrency =
    getElement("fromCurrency");


const toCurrency =
    getElement("toCurrency");


function updateSelectedFlags() {
    const fromFlag = getElement("fromCurrencyFlag");
    const toFlag = getElement("toCurrencyFlag");
    if (fromFlag && fromCurrency && fromCurrency.value) {
        fromFlag.innerHTML = getFlagImgHtml(fromCurrency.value, "badge");
    }
    if (toFlag && toCurrency && toCurrency.value) {
        toFlag.innerHTML = getFlagImgHtml(toCurrency.value, "badge");
    }
}


function populateCurrencies() {

    if (!fromCurrency || !toCurrency)
        return;

    fromCurrency.innerHTML = "";
    toCurrency.innerHTML = "";

    Object.entries(CURRENCIES)
        .forEach(
            ([code, currency]) => {

                // Required format: 🇺🇸 USD — US Dollar
                const label =
                    `${currency.flag} ${code} — ${currency.name}`;


                fromCurrency.add(
                    new Option(
                        label,
                        code
                    )
                );


                toCurrency.add(
                    new Option(
                        label,
                        code
                    )
                );

            }
        );


    fromCurrency.value = "USD";

    toCurrency.value = "INR";


    updateAmountSymbol();
    updateSelectedFlags();

}


function updateAmountSymbol() {

    const symbol =
        getElement("amountSymbol");


    if (
        symbol &&
        fromCurrency &&
        CURRENCIES[fromCurrency.value]
    ) {

        symbol.textContent =
            CURRENCIES[
                fromCurrency.value
            ].symbol;

    }

}


populateCurrencies();



/* =====================================================
   LIVE CURRENCY API & RATE CACHING
===================================================== */

const rateCache = {};

async function getExchangeRates(baseCurrency, targetCurrency = null) {
    const base = (baseCurrency || "USD").toUpperCase();
    const target = targetCurrency ? targetCurrency.toUpperCase() : null;

    // Check memory cache (fresh within 10 minutes)
    const cached = rateCache[base];
    if (cached && (Date.now() - cached.timestamp < 10 * 60 * 1000)) {
        if (target && typeof cached.rates[target] === "number") {
            return cached;
        }
        if (!target && Object.keys(cached.rates).length > 5) {
            return cached;
        }
    }

    let result = null;

    // Primary: Frankfurter API (Official European Central Bank Reference Rates)
    try {
        // Fetch full rate map for the base currency
        const url = `${API_URL}?from=${base}`;
        const response = await fetch(url);
        if (response.ok) {
            const data = await response.json();
            if (data && data.rates) {
                result = {
                    base: data.base || base,
                    date: data.date,
                    rates: data.rates,
                    source: "Frankfurter API"
                };
            }
        }
    } catch (err) {
        console.warn("[Frankfurter API Warning]", err);
    }

    // Secondary: Free open exchange rate fallback (supports 160+ currencies)
    if (!result || (target && typeof result.rates[target] !== "number")) {
        try {
            const fallbackUrl = `${FALLBACK_API_URL}/${base}`;
            const response = await fetch(fallbackUrl);
            if (response.ok) {
                const data = await response.json();
                if (data && data.rates) {
                    const fallbackDate = data.time_last_update_utc
                        ? new Date(data.time_last_update_utc).toISOString().split('T')[0]
                        : new Date().toISOString().split('T')[0];

                    result = {
                        base: data.base_code || base,
                        date: fallbackDate,
                        rates: data.rates,
                        source: "Open Exchange API"
                    };
                }
            }
        } catch (err) {
            console.error("[Fallback Exchange API Error]", err);
        }
    }

    if (!result || !result.rates) {
        throw new Error(`Unable to retrieve exchange rates for ${base}.`);
    }

    // Cache the result
    rateCache[base] = {
        ...result,
        timestamp: Date.now()
    };

    return result;
}


/* =====================================================
   CONVERTER
===================================================== */

async function convertCurrency() {
    const amountInput = getElement("amount");
    const message = getElement("converterMessage");
    const result = getElement("conversionResult");
    const apiStatus = getElement("apiStatus");
    const lastUpdated = getElement("lastUpdated");

    if (!amountInput || !fromCurrency || !toCurrency || !result) return;

    const rawAmount = amountInput.value.trim();
    if (!rawAmount) {
        result.classList.add("hidden");
        if (message) message.textContent = "Enter an amount to calculate a conversion.";
        return;
    }

    const amount = Number(rawAmount);
    if (!Number.isFinite(amount) || amount <= 0) {
        result.classList.add("hidden");
        if (message) message.textContent = "Please enter an amount greater than 0.";
        return;
    }

    const from = fromCurrency.value;
    const to = toCurrency.value;

    const fromMeta = CURRENCIES[from] || { name: from, symbol: from, flag: "" };
    const toMeta = CURRENCIES[to] || { name: to, symbol: to, flag: "" };

    if (from === to) {
        result.classList.remove("hidden");
        result.innerHTML = `
            <div class="result-row">
                <span class="result-part">${getFlagImgHtml(from, "badge")} ${fromMeta.symbol}${amount.toLocaleString(undefined, { maximumFractionDigits: 2 })} ${from}</span>
                <span class="result-equal">=</span>
                <span class="result-part">${getFlagImgHtml(to, "badge")} ${toMeta.symbol}${amount.toLocaleString(undefined, { maximumFractionDigits: 2 })} ${to}</span>
            </div>
            <small>Same currency selected (1 : 1 ratio).</small>
        `;
        if (message) message.textContent = "";
        return;
    }

    try {
        if (apiStatus) apiStatus.textContent = "● Loading...";
        if (message) message.textContent = "Retrieving live exchange rate...";

        const data = await getExchangeRates(from, to);
        let rate = data.rates[to];

        if (typeof rate !== "number") {
            // If cross-rate is needed, calculate via USD
            if (data.rates["USD"] && rateCache["USD"]?.rates[to]) {
                rate = (1 / data.rates["USD"]) * rateCache["USD"].rates[to];
            } else {
                throw new Error(`Rate from ${from} to ${to} is unavailable.`);
            }
        }

        const converted = amount * rate;

        result.classList.remove("hidden");
        result.innerHTML = `
            <div class="result-row">
                <span class="result-part">${getFlagImgHtml(from, "badge")} ${fromMeta.symbol}${amount.toLocaleString(undefined, { maximumFractionDigits: 2 })} ${from}</span>
                <span class="result-equal">=</span>
                <span class="result-part">${getFlagImgHtml(to, "badge")} ${toMeta.symbol}${converted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })} ${to}</span>
            </div>
            <small>
                ${getFlagImgHtml(from, "xs")} 1 ${from} = ${rate.toLocaleString(undefined, { maximumFractionDigits: 6 })} ${to}
                • ${data.date || "Latest"} (${data.source || "Frankfurter API"})
            </small>
        `;

        if (message) message.textContent = "";
        if (apiStatus) apiStatus.textContent = "● Ready";
        if (lastUpdated) lastUpdated.textContent = data.date || "Today";
    } catch (error) {
        console.error("[Converter Error]", error);
        if (apiStatus) apiStatus.textContent = "● API Error";
        if (message) message.textContent = `Unable to retrieve live exchange rate: ${error.message}`;
    }
}

const convertButton = getElement("convertButton");
if (convertButton) {
    convertButton.addEventListener("click", function(event) {
        event.preventDefault();
        convertCurrency();
    });
}

const amountInput = getElement("amount");
if (amountInput) {
    let debounceTimer;
    amountInput.addEventListener("input", function() {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            if (amountInput.value.trim() && Number(amountInput.value) > 0) {
                convertCurrency();
            }
        }, 250);
    });
}


/* =====================================================
   SWAP CURRENCIES
===================================================== */

const swapButton = getElement("swapButton");

if (swapButton) {
    swapButton.addEventListener("click", function(event) {
        event.preventDefault();
        if (!fromCurrency || !toCurrency) return;

        const oldFrom = fromCurrency.value;
        fromCurrency.value = toCurrency.value;
        toCurrency.value = oldFrom;

        updateAmountSymbol();
        updateSelectedFlags();

        if (amountInput && amountInput.value.trim() && Number(amountInput.value) > 0) {
            convertCurrency();
        }
    });
}

if (fromCurrency) {
    fromCurrency.addEventListener("change", function() {
        updateAmountSymbol();
        updateSelectedFlags();
        if (amountInput && amountInput.value.trim() && Number(amountInput.value) > 0) {
            convertCurrency();
        }
    });
}

if (toCurrency) {
    toCurrency.addEventListener("change", function() {
        updateSelectedFlags();
        if (amountInput && amountInput.value.trim() && Number(amountInput.value) > 0) {
            convertCurrency();
        }
    });
}


/* =====================================================
   EXCHANGE RATE TABLE
===================================================== */

let rateRows = [];

async function loadRates() {
    const body = getElement("ratesBody");
    const statusText = getElement("ratesStatus");
    const refreshBtn = getElement("refreshRates");

    if (!body) return;

    body.innerHTML = `
        <tr>
            <td colspan="5" style="text-align: center; padding: 24px;">
                <i class="fa-solid fa-spinner fa-spin" style="margin-right: 8px;"></i> Loading live exchange rates...
            </td>
        </tr>
    `;

    if (statusText) statusText.textContent = "Loading...";
    if (refreshBtn) refreshBtn.classList.add("loading");

    try {
        // Fetch rates using USD base (universally available)
        const data = await getExchangeRates("USD");
        const inrRate = data.rates["INR"] || 95.82;

        // Enrich any currencies missing from Frankfurter (e.g. KWD, AED, BHD, DZD)
        const missingCodes = Object.keys(CURRENCIES).filter(c => c !== "INR" && c !== "USD" && !data.rates[c]);
        if (missingCodes.length > 0) {
            try {
                const fallbackRes = await fetch(`${FALLBACK_API_URL}/USD`);
                if (fallbackRes.ok) {
                    const fallbackJson = await fallbackRes.json();
                    if (fallbackJson && fallbackJson.rates) {
                        missingCodes.forEach(c => {
                            if (fallbackJson.rates[c]) {
                                data.rates[c] = fallbackJson.rates[c];
                            }
                        });
                    }
                }
            } catch (fallbackErr) {
                console.warn("[Rate Table Enrichment Warning]", fallbackErr);
            }
        }

        rateRows = Object.entries(CURRENCIES).map(([code, currency]) => {
            let rateVsInr;

            if (code === "INR") {
                rateVsInr = 1;
            } else if (code === "USD") {
                rateVsInr = inrRate;
            } else if (typeof data.rates[code] === "number" && data.rates[code] > 0) {
                // 1 unit of foreign currency = (inrRate / data.rates[code]) INR
                rateVsInr = inrRate / data.rates[code];
            } else {
                rateVsInr = null;
            }

            return {
                code,
                name: currency.name,
                flag: currency.flag,
                symbol: currency.symbol,
                rate: rateVsInr
            };
        }).filter(item => typeof item.rate === "number" && !isNaN(item.rate));

        renderRates();

        if (statusText) {
            statusText.textContent = `Updated ${data.date || "Live"} • Source: ${data.source || "Frankfurter API"}`;
        }
    } catch (error) {
        console.error("[Load Rates Error]", error);
        body.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center; padding: 24px; color: var(--danger);">
                    Unable to retrieve live exchange rates.
                    <button id="retryRatesBtn" class="secondary-button" style="margin-left: 10px; padding: 4px 10px; font-size: 12px; display: inline-block;">
                        Retry
                    </button>
                </td>
            </tr>
        `;
        const retryBtn = getElement("retryRatesBtn");
        if (retryBtn) retryBtn.addEventListener("click", loadRates);
        if (statusText) statusText.textContent = "API unavailable";
    } finally {
        if (refreshBtn) refreshBtn.classList.remove("loading");
    }
}

function renderRates() {
    const body = getElement("ratesBody");
    if (!body) return;

    const searchInput = getElement("rateSearch");
    const search = (searchInput?.value || "").trim().toLowerCase();

    const filtered = rateRows.filter(item =>
        `${item.name} ${item.code}`.toLowerCase().includes(search)
    );

    if (!filtered.length) {
        body.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center; padding: 24px;">
                    No currency found matching "${search}".
                </td>
            </tr>
        `;
        return;
    }

    body.innerHTML = filtered.map(item => `
        <tr>
            <td>
                <div class="currency-table-cell">
                    ${getFlagImgHtml(item.code, "table")}
                    <span class="currency-cell-name">${item.name}</span>
                </div>
            </td>
            <td>
                <code>${item.code}</code>
            </td>
            <td>
                <strong>₹${item.rate.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}</strong>
            </td>
            <td>
                <span style="color: var(--success); font-weight: 600; font-size: 12px;">● Live</span>
            </td>
            <td>
                Latest Available
            </td>
        </tr>
    `).join("");
}

if (getElement("ratesBody")) {
    loadRates();
}

const refreshRates = getElement("refreshRates");
if (refreshRates) {
    refreshRates.addEventListener("click", function(event) {
        event.preventDefault();
        loadRates();
    });
}

const rateSearch = getElement("rateSearch");
if (rateSearch) {
    rateSearch.addEventListener("input", renderRates);
}

// Automatically populate default amount and run initial conversion on page load
if (fromCurrency && toCurrency && amountInput) {
    if (!amountInput.value) {
        amountInput.value = "1";
    }
    convertCurrency();
}



/* =====================================================
   CONTACT FORM & EMAIL DELIVERY
===================================================== */

const CONTACT_CONFIG = {
    // Recipient email where all messages are delivered
    recipientEmail: "ambatinagendrareddy@gmail.com",

    // Website URL
    websiteUrl: "https://ambatinagendrareddy-cmyk.github.io/currency-rates/",

    // Form name identifier
    formName: "Contact Us Form",

    // Web3Forms API endpoint (both keys defined to prevent property mismatch)
    serviceUrl: "https://api.web3forms.com/submit",
    web3formsUrl: "https://api.web3forms.com/submit",

    // Web3Forms Public Access Key
    accessKey: "bb8f665c-4c91-4eeb-a53b-552bf1afd443"
};


const contactForm =
    getElement("contactForm");


if (contactForm) {

    contactForm.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            // Honeypot spam check
            const botcheck =
                getElement("contactBotcheck");

            if (botcheck && botcheck.checked) {
                return;
            }


            const nameInput =
                getElement("contactName");

            const emailInput =
                getElement("contactEmail");

            const phoneInput =
                getElement("contactPhone");

            const subjectInput =
                getElement("contactSubject");

            const messageInput =
                getElement("contactMessage");

            const status =
                getElement("contactStatus");

            const submitBtn =
                getElement("contactSubmitBtn");

            const btnText =
                getElement("contactBtnText");

            const btnIcon =
                getElement("contactBtnIcon");


            const name =
                nameInput ? nameInput.value.trim() : "";

            const email =
                emailInput ? emailInput.value.trim() : "";

            const phone =
                phoneInput ? phoneInput.value.trim() : "";

            const subject =
                subjectInput ? subjectInput.value.trim() : "";

            const message =
                messageInput ? messageInput.value.trim() : "";


            // Field Validations
            if (name.length < 2) {

                showMessage(
                    status,
                    "Please enter your name."
                );

                if (nameInput) nameInput.focus();

                return;

            }


            if (!validEmail(email)) {

                showMessage(
                    status,
                    "Please enter a valid email."
                );

                if (emailInput) emailInput.focus();

                return;

            }


            if (
                !phone ||
                !/^[0-9+\-\s()]{7,20}$/.test(phone)
            ) {

                showMessage(
                    status,
                    "Please enter a valid phone number."
                );

                if (phoneInput) phoneInput.focus();

                return;

            }


            if (subject.length < 2) {

                showMessage(
                    status,
                    "Please enter a subject."
                );

                if (subjectInput) subjectInput.focus();

                return;

            }


            if (message.length < 5) {

                showMessage(
                    status,
                    "Please enter a message."
                );

                if (messageInput) messageInput.focus();

                return;

            }


            // Check if Access Key is configured
            const activeKey = (CONTACT_CONFIG.accessKey || "").trim();
            const isKeyMissing = !activeKey || activeKey === "YOUR_WEB3FORMS_ACCESS_KEY";

            if (isKeyMissing && !CONTACT_CONFIG.formspreeUrl) {
                console.error(
                    "[Web3Forms Integration Check]\n" +
                    "Status: Web3Forms Access Key is NOT configured yet.\n" +
                    "Current Value: " + (activeKey || "(empty)") + "\n" +
                    "Target Recipient: " + CONTACT_CONFIG.recipientEmail + "\n" +
                    "Action Required: Obtain your free Access Key from https://web3forms.com/#start and paste it in script.js (CONTACT_CONFIG.accessKey) or click the prompt button below."
                );

                showMessage(
                    status,
                    "Web3Forms Access Key is not configured yet. Please enter your Access Key to enable email delivery.",
                    "error"
                );

                let setupBtn = getElement("quickKeyBtn");
                if (!setupBtn && status && status.parentNode) {
                    setupBtn = document.createElement("button");
                    setupBtn.id = "quickKeyBtn";
                    setupBtn.type = "button";
                    setupBtn.textContent = "🔑 Enter Web3Forms Access Key";
                    setupBtn.className = "secondary-button";
                    setupBtn.style.cssText = "margin-top: 12px; font-size: 13px; padding: 7px 15px; width: 100%; display: block; text-align: center;";
                    setupBtn.onclick = function() {
                        const entered = prompt(
                            "Enter your Web3Forms Access Key (sent to " + CONTACT_CONFIG.recipientEmail + "):\nCheck your Gmail Spam/Junk folder if you just requested it.",
                            ""
                        );
                        if (entered && entered.trim()) {
                            const trimmed = entered.trim();
                            localStorage.setItem("web3forms_access_key", trimmed);
                            CONTACT_CONFIG.accessKey = trimmed;
                            showMessage(status, "Access Key saved successfully! Click 'SEND MESSAGE' now.", "success");
                            setupBtn.remove();
                        }
                    };
                    status.parentNode.insertBefore(setupBtn, status.nextSibling);
                }

                return;
            }

            // Disable button & show sending spinner
            if (submitBtn) {
                submitBtn.disabled = true;
                if (btnText) btnText.textContent = "SENDING...";
                if (btnIcon) btnIcon.className = "fa-solid fa-spinner fa-spin";
            }

            showMessage(
                status,
                "Sending message to " + CONTACT_CONFIG.recipientEmail + "...",
                "info"
            );

            const endpoint = CONTACT_CONFIG.formspreeUrl || CONTACT_CONFIG.serviceUrl || CONTACT_CONFIG.web3formsUrl;

            const payload = {
                access_key: CONTACT_CONFIG.accessKey,
                name: name,
                email: email,
                replyto: email,
                phone: phone,
                subject: subject,
                message: message,
                from_name: `${name} (${CONTACT_CONFIG.formName})`,
                website: CONTACT_CONFIG.websiteUrl,
                submission_date: new Date().toLocaleString()
            };

            console.log("[Web3Forms Request] Target endpoint:", endpoint);
            console.log("[Web3Forms Request] Headers:", {
                "Content-Type": "application/json",
                "Accept": "application/json"
            });
            console.log("[Web3Forms Request] Payload:", {
                ...payload,
                access_key: payload.access_key ? (payload.access_key.length > 8 ? payload.access_key.slice(0, 8) + "..." : payload.access_key) : "NONE"
            });

            try {
                const response = await fetch(
                    endpoint,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Accept": "application/json"
                        },
                        body: JSON.stringify(payload)
                    }
                );

                console.log("[Web3Forms Network Response] HTTP Status:", response.status, response.statusText);

                let result;
                try {
                    result = await response.json();
                } catch (jsonErr) {
                    throw new Error(`HTTP ${response.status} (${response.statusText}): Received non-JSON response from API server.`);
                }

                console.log("[Web3Forms Response JSON]:", result);

                if (response.ok && (result.success || result.ok)) {
                    showMessage(
                        status,
                        "Message sent successfully! Email delivered to " + CONTACT_CONFIG.recipientEmail + ".",
                        "success"
                    );

                    showToast("Message delivered successfully to " + CONTACT_CONFIG.recipientEmail + "!", "success");

                    contactForm.reset();
                } else {
                    console.error("[Web3Forms API Rejection]:", result);

                    // Show exact API error without masking
                    const errorDetail =
                        result.message ||
                        (result.errors && typeof result.errors === "object" ? JSON.stringify(result.errors) : "") ||
                        `HTTP ${response.status}: ${response.statusText}`;

                    showMessage(
                        status,
                        `Web3Forms Error: ${errorDetail}`,
                        "error"
                    );
                }
            }
            catch (error) {
                console.error("[Web3Forms Fetch / Network Error]:", error);

                // Show exact error reason, do not mask behind generic message
                showMessage(
                    status,
                    `Submission failed: ${error.message || error}`,
                    "error"
                );
            }
            finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    if (btnText) btnText.textContent = "SEND MESSAGE";
                    if (btnIcon) btnIcon.className = "fa-solid fa-paper-plane";
                }
            }

        }
    );

}