document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");
    const amountInput = form.querySelector("input");
    const fromSelect = form.querySelector("select[name='from']");
    const toSelect = form.querySelector("select[name='to']");
    const msgDiv = document.querySelector(".msg");
    const fromFlag = document.querySelector(".from img");
    const toFlag = document.querySelector(".to img");

    // Populate dropdowns with currency options from `countryList`
    const populateDropdowns = () => {
        const options = Object.keys(countryList)
            .map((code) => `<option value="${code}">${code}</option>`)
            .join("");
        fromSelect.innerHTML = options;
        toSelect.innerHTML = options;

        // Set initial selections
        fromSelect.value = "USD";
        toSelect.value = "INR";
        updateFlag(fromSelect, fromFlag);
        updateFlag(toSelect, toFlag);
    };

    const updateFlag = (selectElement, flagElement) => {
        const currencyCode = selectElement.value;
        const countryCode = countryList[currencyCode];
        if (countryCode) {
            flagElement.src = `https://flagsapi.com/${countryCode}/flat/64.png`;
        } else {
            flagElement.src = ""; // Default if no valid flag
        }
    };

    const getExchangeRate = (fromCurrency, toCurrency) => {
        const url = `https://api.exchangerate-api.com/v4/latest/${fromCurrency}`;
        return fetch(url)
            .then((response) => {
                if (!response.ok) throw new Error("Failed to fetch exchange rates.");
                return response.json();
            })
            .then((data) => {
                if (!data.rates[toCurrency]) {
                    throw new Error(`Exchange rate for ${toCurrency} not found.`);
                }
                return data.rates[toCurrency];
            });
    };

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const amount = parseFloat(amountInput.value);
        const fromCurrency = fromSelect.value;
        const toCurrency = toSelect.value;

        if (isNaN(amount) || amount <= 0) {
            msgDiv.textContent = "Please enter a valid amount.";
            return;
        }

        getExchangeRate(fromCurrency, toCurrency)
            .then((rate) => {
                const convertedAmount = (amount * rate).toFixed(2);
                msgDiv.textContent = `${amount} ${fromCurrency} = ${convertedAmount} ${toCurrency}`;
            })
            .catch((error) => {
                console.error(error);
                msgDiv.textContent = "Error fetching exchange rate. Try again.";
            });
    });

    fromSelect.addEventListener("change", () => updateFlag(fromSelect, fromFlag));
    toSelect.addEventListener("change", () => updateFlag(toSelect, toFlag));

    // Initialize
    populateDropdowns();
});
