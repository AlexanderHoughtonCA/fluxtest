require("dotenv").config();

let BLACK_FOREST_API_KEY = process.env.BLACK_FOREST_API_KEY;
let BLACK_FOREST_API_URL = process.env.BLACK_FOREST_API_URL;

let REDIS_HOST = process.env.REDIS_HOST || "127.0.0.1";
let REDIS_PORT = process.env.REDIS_PORT || 6379;
let REDIS_PASSWORD = process.env.REDIS_PASSWORD || "";

module.exports = {
    BLACK_FOREST_API_KEY,
    BLACK_FOREST_API_URL,
    REDIS_HOST,
    REDIS_PORT,
    REDIS_PASSWORD
};

