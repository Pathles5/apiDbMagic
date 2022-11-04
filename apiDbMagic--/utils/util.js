const promiseTimeOut = (ms, promise) => {
  const timeout = new Promise((resolve, reject) => {
    const id = setTimeout(() => {
      //clearTimeout(id);
      reject(` ❌ **ERROR** ❌ ⏳ Provider timeout after: ${ms}`);
    }, ms);
  });
};

module.exports = {
  promiseTimeOut,
};
