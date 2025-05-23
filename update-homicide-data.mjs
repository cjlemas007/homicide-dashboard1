import fs from 'fs';
import fetch from './node-fetch.mjs'; // 👈 Now using a local version

const API_URL = "https://homicide-test.netlify.app/.netlify/functions/getHomicideData?key=4a8d9c7f98@secure_key_2024";
const OUTPUT_PATH = "./public/data/homicide.json";

const res = await fetch(API_URL);
const json = await res.json();
fs.writeFileSync(OUTPUT_PATH, JSON.stringify(json, null, 2));
console.log("✅ Homicide data updated.");
