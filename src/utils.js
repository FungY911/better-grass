const isProduction = () => {
  return process.env.NODE_ENV === "production";
};

const prettifyHeaderKey = (headerKey) => {
  const HEADER_KEY_EXCEPTIONS = [
    "CH",
    "CT",
    "DNS",
    "DNT",
    "DPR",
    "ECT",
    "ETag",
    "GPC",
    "NEL",
    "RTT",
    "SourceMap",
    "TE",
    "UA",
    "WWW",
    "WebSocket",
    "XSS",
  ];

  const result = [];
  const parts = headerKey.split("-");
  for (const part of parts) {
    const nameException = HEADER_KEY_EXCEPTIONS.find(
      (el) => el.toLowerCase() === part.toLowerCase()
    );
    if (nameException !== undefined) {
      result.push(nameException);
    } else {
      // capitalize the first letter
      result.push(part.charAt(0).toUpperCase() + part.slice(1));
    }
  }

  return result.join("-");
};

module.exports = {
  isProduction,
  prettifyHeaderKey,
};
