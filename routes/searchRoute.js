const express = require("express");
const {
    searchPilihan,
    searchMendesak,
    searchQuery,
    searchTipe
} = require("../controllers/searchController");
const router = express.Router();

router.get("/campaign-pilihan", searchPilihan);
router.get("/kebutuhan-mendesak", searchMendesak);
router.get("/bencana-alam", searchMendesak);
router.get("/bencana-alam", searchTipe("Bencana Alam"));
router.get("/bantuan-sosial", searchTipe("Bantuan Sosial"));
router.get("/bantuan-medis", searchTipe("Bantuan Medis"));
router.get("/lingkungan", searchTipe("Lingkungan"));
router.get("/", searchQuery);

module.exports = router;