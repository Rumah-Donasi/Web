const express = require("express");
const {
    searchPilihan,
    searchQuery
} = require("../controllers/searchController");

const router = express.Router();

router.get("/Campaign-Pilihan", searchPilihan);
router.get("/", searchQuery);

module.exports = router;