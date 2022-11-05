module.exports = {
  ok: (data) => ({ data, error: null }),
  error: (errorMessagge, error, code) => ({
    data: null, error, errorMessagge, ...(code && { code }),
  }),
};
