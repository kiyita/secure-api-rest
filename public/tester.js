const output = document.getElementById("output");
const baseUrl = window.location.origin;
document.getElementById("baseUrl").textContent = baseUrl;

const emailEl = document.getElementById("email");
const passwordEl = document.getElementById("password");
const tokenEl = document.getElementById("token");

function printResult(label, status, data) {
    output.textContent = `${label} - HTTP ${status}\n\n${JSON.stringify(data, null, 2)}`;
}

async function callApi(label, url, options = {}) {
    try {
        const response = await fetch(url, options);
        const text = await response.text();
        let data;
        try {
            data = text ? JSON.parse(text) : {};
        } catch {
            data = { raw: text };
        }
        printResult(label, response.status, data);
        return { ok: response.ok, data };
    } catch (error) {
        printResult(label, 0, { message: error.message });
        return { ok: false, data: { message: error.message } };
    }
}

document.getElementById("registerBtn").addEventListener("click", async () => {
    await callApi("Register", `${baseUrl}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            email: emailEl.value,
            password: passwordEl.value,
        }),
    });
});

document.getElementById("loginBtn").addEventListener("click", async () => {
    const result = await callApi("Login", `${baseUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            email: emailEl.value,
            password: passwordEl.value,
        }),
    });

    if (result.ok && result.data && result.data.accessToken) {
        tokenEl.value = result.data.accessToken;
    }
});

document.getElementById("copyBtn").addEventListener("click", () => {
    if (tokenEl.value) {
        navigator.clipboard.writeText(tokenEl.value);
        alert("Token copié ! 📋");
    } else {
        alert("Pas de token. Connecte-toi d'abord.");
    }
});

document.getElementById("meBtn").addEventListener("click", async () => {
    if (!tokenEl.value) {
        printResult("Me", 401, { message: "Pas de token. Connecte-toi d'abord." });
        return;
    }
    
    await callApi("Me", `${baseUrl}/api/auth/me`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${tokenEl.value}`,
        },
    });
});