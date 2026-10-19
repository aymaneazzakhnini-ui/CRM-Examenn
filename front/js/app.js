const API = "/api/clients";

const tbody = document.getElementById("clients");
const form = document.getElementById("client-form");
const statusEl = document.getElementById("status");

async function request(url, options = {}) {
  const res = await fetch(url, options);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.erreur || "Erreur serveur");
  return data;
}

async function loadClients() {
  try {
    const clients = await request(API);
    tbody.innerHTML = "";

    for (const client of clients) {
      const tr = document.createElement("tr");

      const values = [client.nom, client.email, client.telephone || ""];
      for (const value of values) {
        const td = document.createElement("td");
        td.textContent = value;
        tr.appendChild(td);
      }

      const td = document.createElement("td");
      const btn = document.createElement("button");
      btn.textContent = "Supprimer";
      btn.className = "danger";
      btn.addEventListener("click", () => deleteClient(client._id));
      td.appendChild(btn);
      tr.appendChild(td);

      tbody.appendChild(tr);
    }

    statusEl.textContent = "";
  } catch (err) {
    statusEl.textContent = err.message;
  }
}

async function deleteClient(id) {
  try {
    await request(`${API}/${id}`, { method: "DELETE" });
    await loadClients();
  } catch (err) {
    statusEl.textContent = err.message;
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  try {
    await request(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nom: form.nom.value,
        email: form.email.value,
        telephone: form.telephone.value,
      }),
    });

    form.reset();
    await loadClients();
  } catch (err) {
    statusEl.textContent = err.message;
  }
});

async function loadTestMessage() {
  const el = document.getElementById("test-message");
  try {
    const data = await request("/api/test");
    el.textContent = data.message;
  } catch (err) {
    el.textContent = "Erreur : " + err.message;
  }
}

loadClients();
loadTestMessage();
