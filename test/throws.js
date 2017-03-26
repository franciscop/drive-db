
module.exports = cb => async () => {
  try {
    const res = await cb();
  } catch(err) {
    return Promise.resolve();
  }
  throw new Error('No error was thrown');
};
