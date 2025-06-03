const express = require("express");
const {
    searchPilihan,
    searchMendesak,
    searchQuery
} = require("../controllers/searchController");
const router = express.Router();

router.get("/Campaign-Pilihan", searchPilihan);
router.get("/Kebutuhan-Mendesak", searchMendesak);
router.get("/", searchQuery);

module.exports = router;