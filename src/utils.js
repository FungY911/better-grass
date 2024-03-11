const isProduction = () => process.env.NODE_ENV === "production";

const prettifyHeaderKey = (headerKey) => {
  const HEADER_KEY_EXCEPTIONS = [
    "CH", "CT", "DNS", "DNT", "DPR", "ECT", "ETag", "GPC", "NEL", "RTT",
    "SourceMap", "TE", "UA", "WWW", "WebSocket", "XSS"
  ];

  return headerKey.split("-").map(part => {
    const nameException = HEADER_KEY_EXCEPTIONS.find(
      (el) => el.toLowerCase() === part.toLowerCase()
    );
    return nameException !== undefined ? nameException : part.charAt(0).toUpperCase() + part.slice(1);
  }).join("-");
};

module.exports = { isProduction, prettifyHeaderKey };
