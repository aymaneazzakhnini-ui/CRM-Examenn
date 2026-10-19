const API = "/api/clients";
const form = document.getElementById("client-form");
const clientsBody = document.getElementById("clients");
const status = document.getElementById("status");

async function request(url, options) {
  const response = await fetch(url, options);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.erreur || "Erreur serveur");
  }

  return data;
}

async function loadClients() {
  try {
    const clients = await request(API);
    clientsBody.replaceChildren();

    for (const client of clients) {
      const row = document.createElement("tr");
      for (const value of [client.nom, client.email, client.telephone || ""]) {
        const cell = document.createElement("td");
        cell.textContent = value;
        row.appendChild(cell);
      }

      const actions = document.createElement("td");
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = "Supprimer";
      button.addEventListener("click", () => deleteClient(client._id));
      actions.appendChild(button);
      row.appendChild(actions);
      clientsBody.appendChild(row);
    }

    status.textContent = "";
  } catch (error) {
    status.textContent = error.message;
  }
}

async function deleteClient(id) {
  try {
    await request(`${API}/${id}`, { method: "DELETE" });
    await loadClients();
  } catch (error) {
    status.textContent = error.message;
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  try {
    await request(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nom: form.elements.nom.value,
        email: form.elements.email.value,
        telephone: form.elements.telephone.value,
      }),
    });
    form.reset();
    await loadClients();
  } catch (error) {
    status.textContent = error.message;
  }
});

loadClients();
