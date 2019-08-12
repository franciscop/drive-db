// Find the Google Drive data
const getKeys = row => Object.keys(row).filter(key => /^gsx\$/.test(key));
const parseRow = row => {
  return getKeys(row).reduce((obj, key) => {
    obj[key.slice(4)] = row[key].$t;
    return obj;
  }, {});
};

const get = async url => {
  if (typeof fetch !== "undefined") {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Error ${res.status} retrieving ${url}`);
    return res.json();
  }
  if (typeof require === "undefined") {
    throw new Error("fetch() is not available, please polyfill it");
  }
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
};

const retrieve = async ({ sheet, tab }) => {
  // Call request() with the right url but keep `this` as `drive`

  const data = await get(
    `https://spreadsheets.google.com/feeds/list/${sheet}/${tab}/public/values?alt=json`
  );
  return data.feed.entry.map(parseRow);
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
