const passwordField = document.getElementById("password");
const generateBtn = document.getElementById("generateBtn");
const copyBtn = document.getElementById("copyBtn");

const lengthInput = document.getElementById("length");
const lengthValue = document.getElementById("lengthValue");

const uppercase = document.getElementById("uppercase");
const lowercase = document.getElementById("lowercase");
const numbers = document.getElementById("numbers");
const symbols = document.getElementById("symbols");

const strengthIndicator = document.getElementById("strengthIndicator");
const strengthText = document.getElementById("strengthText");

lengthInput.addEventListener("input", () => {
    lengthValue.textContent = lengthInput.value;
});

function secureRandom(max) {
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    return array[0] % max;
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = secureRandom(i + 1);
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function generatePassword() {
    const chars = {
        upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
        lower: "abcdefghijklmnopqrstuvwxyz",
        number: "0123456789",
        symbol: "!@#$%^&*()_-+=[]{}<>?/|"
    };

    let selectedSets = [];
    let password = [];

    if (uppercase.checked) selectedSets.push(chars.upper);
    if (lowercase.checked) selectedSets.push(chars.lower);
    if (numbers.checked) selectedSets.push(chars.number);
    if (symbols.checked) selectedSets.push(chars.symbol);

    if (selectedSets.length === 0) {
        alert("Selecione pelo menos uma opção.");
        return;
    }

    const length = parseInt(lengthInput.value);

    selectedSets.forEach(set => {
        password.push(set[secureRandom(set.length)]);
    });

    const allChars = selectedSets.join("");

    while (password.length < length) {
        password.push(
            allChars[secureRandom(allChars.length)]
        );
    }

    password = shuffle(password);

    const result = password.join("").slice(0, length);

    passwordField.value = result;

    evaluateStrength(result);
}

function evaluateStrength(password) {

    let score = 0;

    if (password.length >= 12) score++;
    if (password.length >= 16) score++;

    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 2) {
        strengthIndicator.style.width = "30%";
        strengthIndicator.style.background = "#ef4444";
        strengthText.textContent = "Fraca";
    } else if (score <= 4) {
        strengthIndicator.style.width = "65%";
        strengthIndicator.style.background = "#f59e0b";
        strengthText.textContent = "Média";
    } else {
        strengthIndicator.style.width = "100%";
        strengthIndicator.style.background = "#22c55e";
        strengthText.textContent = "Forte";
    }
}

copyBtn.addEventListener("click", async () => {

    if (!passwordField.value) return;

    try {
        await navigator.clipboard.writeText(passwordField.value);

        copyBtn.textContent = "Copiado!";

        setTimeout(() => {
            copyBtn.textContent = "Copiar";
        }, 2000);

    } catch {
        alert("Não foi possível copiar.");
    }
});

generateBtn.addEventListener("click", generatePassword);

generatePassword();
