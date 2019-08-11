// Polyfill fetch()
const self =
  typeof window !== "undefined" // For the browser and Jest
    ? window
    : typeof global !== "undefined" // For Node.js
    ? global
    : {}; // Failback
if (!self.fetch) {
  try {
    self.fetch = require("node-fetch");
  } catch (error) {
    throw new Error(
      "fetch() is not available, please install node-fetch or polyfill fetch()"
    );
  }
}

// Find the Google Drive data
const getKeys = row => Object.keys(row).filter(key => /^gsx\$/.test(key));
const parseRow = row => {
  return getKeys(row).reduce((obj, key) => {
    obj[key.slice(4)] = row[key].$t;
    return obj;
  }, {});
};

const retrieve = async ({ sheet, tab }) => {
  // Call request() with the right url but keep `this` as `drive`
  const res = await fetch(
    `https://spreadsheets.google.com/feeds/list/${sheet}/${tab}/public/values?alt=json`
  );
  if (!res.ok) {
    throw new Error(`Error ${res.status} retrieving the spreadsheet ${sheet}`);
  }
  const full = await res.json();
  return full.feed.entry.map(parseRow);
};

const memo = (cb, map = {}) => async (options, timeout) => {
  const key = JSON.stringify(options);
  const time = new Date();
  if (map[key] && time - map[key].time < timeout) {
    return map[key].value;
  }
  map[key] = { value: cb(options), time };
  return map[key].value;
};

// By default, cache it 1hour
const getSheet = memo(retrieve);

export default async options => {
  const {
    sheet = "",
    tab = "default", // od6
    cache = 3600,
    onload = d => d
  } = typeof options === "object" ? options : { sheet: options };

  // To update the data we need to make sure we're working with an id
  if (!sheet) throw new Error("Need a Google Drive sheet id to load");

  return onload(getSheet({ sheet, tab }, cache));
};
