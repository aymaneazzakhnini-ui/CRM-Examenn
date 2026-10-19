const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema(
  {
    nom: { type: String, required: true },
    email: { type: String, required: true },
    telephone: { type: String, default: "" },
  },
  { timestamps: true }
);

const Client = mongoose.model("Client", clientSchema);

router.get("/", async (req, res) => {
  try {
    const clients = await Client.find().sort({ createdAt: -1 });
    res.json(clients);
  } catch (err) {
    res.status(500).json({ erreur: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { nom, email, telephone } = req.body;
    if (!nom || !email) {
      return res.status(400).json({ erreur: "Nom et email requis" });
    }

    const client = new Client({ nom, email, telephone: telephone || "" });
    await client.save();
    res.status(201).json(client);
  } catch (err) {
    res.status(500).json({ erreur: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ erreur: "Identifiant invalide" });
    }

    const deleted = await Client.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ erreur: "Client introuvable" });
    }

    res.json({ message: "Client supprimé" });
  } catch (err) {
    res.status(500).json({ erreur: err.message });
  }
});

module.exports = router;
