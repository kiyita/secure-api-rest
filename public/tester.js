const output = document.getElementById("output");
const baseUrl = window.location.origin;
document.getElementById("baseUrl").textContent = baseUrl;

const emailEl = document.getElementById("email");
const passwordEl = document.getElementById("password");
const tokenEl = document.getElementById("token");
const noteTitleEl = document.getElementById("noteTitle");
const noteContentEl = document.getElementById("noteContent");
const noteIdEl = document.getElementById("noteId");

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

function getAuthHeaders(includeJson = false) {
    const headers = {};
    if (tokenEl.value) {
        headers.Authorization = `Bearer ${tokenEl.value}`;
    }
    if (includeJson) {
        headers["Content-Type"] = "application/json";
    }
    return headers;
}

function ensureToken(label) {
    if (!tokenEl.value) {
        printResult(label, 401, { message: "Pas de token. Connecte-toi d'abord." });
        return false;
    }
    return true;
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
    if (!ensureToken("Me")) {
        return;
    }
    
    await callApi("Me", `${baseUrl}/api/auth/me`, {
        method: "GET",
        headers: getAuthHeaders(),
    });
});

document.getElementById("createNoteBtn").addEventListener("click", async () => {
    if (!ensureToken("Create Note")) {
        return;
    }

    const result = await callApi("Create Note", `${baseUrl}/api/notes/notes`, {
        method: "POST",
        headers: getAuthHeaders(true),
        body: JSON.stringify({
            title: noteTitleEl.value,
            content: noteContentEl.value,
        }),
    });

    if (result.ok && result.data?.note?.id) {
        noteIdEl.value = result.data.note.id;
    }
});

document.getElementById("getNotesBtn").addEventListener("click", async () => {
    if (!ensureToken("Get Notes")) {
        return;
    }

    const result = await callApi("Get Notes", `${baseUrl}/api/notes/notes`, {
        method: "GET",
        headers: getAuthHeaders(),
    });

    const firstNoteId = result.data?.notes?.[0]?._id || result.data?.notes?.[0]?.id;
    if (result.ok && firstNoteId && !noteIdEl.value) {
        noteIdEl.value = firstNoteId;
    }
});

document.getElementById("getNoteByIdBtn").addEventListener("click", async () => {
    if (!ensureToken("Get Note By Id")) {
        return;
    }

    if (!noteIdEl.value) {
        printResult("Get Note By Id", 400, { message: "Renseigne un noteId." });
        return;
    }

    await callApi("Get Note By Id", `${baseUrl}/api/notes/notes/${noteIdEl.value}`, {
        method: "GET",
        headers: getAuthHeaders(),
    });
});

document.getElementById("updateNoteBtn").addEventListener("click", async () => {
    if (!ensureToken("Update Note")) {
        return;
    }

    if (!noteIdEl.value) {
        printResult("Update Note", 400, { message: "Renseigne un noteId." });
        return;
    }

    await callApi("Update Note", `${baseUrl}/api/notes/notes/${noteIdEl.value}`, {
        method: "PUT",
        headers: getAuthHeaders(true),
        body: JSON.stringify({
            title: noteTitleEl.value,
            content: noteContentEl.value,
        }),
    });
});

document.getElementById("deleteNoteBtn").addEventListener("click", async () => {
    if (!ensureToken("Delete Note")) {
        return;
    }

    if (!noteIdEl.value) {
        printResult("Delete Note", 400, { message: "Renseigne un noteId." });
        return;
    }

    const result = await callApi("Delete Note", `${baseUrl}/api/notes/notes/${noteIdEl.value}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
    });

    if (result.ok) {
        noteIdEl.value = "";
    }
});