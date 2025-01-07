

const BASE_URL =
    "https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies";

const dropdowns = document.querySelectorAll(".dropdown select");

for (let select of dropdowns) {
    for (currCode in countryList) {
        let newOption = document.createElement("option");
        newOption.value = currCode;
        newOption.innerText = currCode;

        if (select.name == "from" && currCode == "USD") {
            newOption.selected = "selected";
        } else if (select.name == "to" && currCode == "INR") {
            newOption.selected = "selected";
        }
        select.append(newOption);

    }
}

const 