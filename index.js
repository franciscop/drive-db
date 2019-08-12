// Find the Google Drive data
const getKeys = row => Object.keys(row).filter(key => /^gsx\$/.test(key));
const parseRow = row => {
  return getKeys(row).reduce((obj, key) => {
    obj[key.slice(4)] = row[key].$t;
    return obj;
  }, {});
};

// Make a GET HTTP response and parse the JSON response
const get = async url => {
  // Try first with fetch() - browser, worker, polyfilled, etc
  if (typeof fetch !== "undefined") {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Error ${res.status} retrieving ${url}`);
    return res.json();
  }

  // Now try with Node.js, which needs to be promisified
  if (typeof require !== "undefined") {
    return new Promise((resolve, reject) => {
      const handler = res => {
        res.setEncoding("utf8");
        if (res.statusCode < 200 || res.statusCode >= 300) {
          return reject(new Error(`Error ${res.statusCode} retrieving ${url}`));
        }
        let data = "";
        res.on("data", chunk => (data += chunk));
        res.on("end", () => resolve(JSON.parse(data)));
      };
      require("https")
        .get(url, handler)
        .on("error", reject);
    });
  }

  // No supported method was found, display the warning
  throw new Error("fetch() is not available, please polyfill it");
};

const retrieve = async ({ sheet, tab }) => {
  const data = await get(
    `https://spreadsheets.google.com/feeds/list/${sheet}/${tab}/public/values?alt=json`
  );
  return data.feed.entry.map(parseRow);
};

// Memoize a callback similar to React
const memo = (cb, map = {}) => async (options, timeout) => {
  const key = JSON.stringify(options);
  const time = new Date();
  if (map[key] && time - map[key].time < timeout) {
    return map[key].value;
  }
  map[key] = { value: cb(options), time };
  return map[key].value;
};

// It should be memoized here, since we memoize the whole *request* and *parse*
const getSheet = memo(retrieve);

// The main drive() function
export default async options => {
  const {
    sheet = "",
    tab = "default", // Or "od6"
    cache = 3600,
    onload = d => d
  } = typeof options === "object" ? options : { sheet: options };

  // To update the data we need to make sure we're working with an id
  if (!sheet) throw new Error("Need a Google Drive sheet id to load");

  return onload(getSheet({ sheet, tab }, cache));
};
