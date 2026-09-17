import QRCode from "qrcode";

/**
 * Builds a beldex: payment URI for a given address, amount and description.
 * Mirrors the reference `generateBeldexQR` script, but returns the URI
 * instead of printing a terminal QR code (the browser needs an <img>, not
 * a terminal string).
 */
export function buildBeldexUri(address, amount, description = "") {
  let uri = `beldex:${address}?tx_amount=${amount}`;
  if (description) {
    uri += `&tx_description=${encodeURIComponent(description)}`;
  }
  return uri;
}

/**
 * Generates a QR code for a Beldex payment as a data URL, ready to drop
 * straight into an <img src="...">.
 */
export async function generateBeldexQrDataUrl(address, amount, description = "") {
  const uri = buildBeldexUri(address, amount, description);
  return QRCode.toDataURL(uri, { margin: 1, width: 260 });
}

/**
 * Checks whether a Beldex transaction hash shows up on the public explorer
 * with a timestamp close to "now".
 *
 * This is a browser port of the reference Node script: the original used
 * `jsdom` to parse the explorer's HTML server-side. In the browser we
 * already have a DOM parser (`DOMParser`), so we use that instead — no
 * extra dependency needed.
 *
 * IMPORTANT: explorer.beldex.io does not send CORS headers for browser
 * fetches, so this call may be blocked by the browser itself before it
 * even reaches the network. That failure mode is reported back as
 * { ok: false, reason: "network" } so the caller can tell the difference
 * between "couldn't check" and "checked, and it's invalid". In production
 * this lookup should run on a backend/server (no CORS restrictions there),
 * with the same parsing logic.
 *
 * @param {string} txHash
 * @param {number} maxDiffSeconds
 * @returns {Promise<{ ok: boolean, reason: string|null }>}
 */
export async function verifyTxTimestamp(txHash, maxDiffSeconds = 500) {
  try {
    const explorerUrl = `https://explorer.beldex.io/tx/${txHash}`;
    const response = await fetch(explorerUrl);

    if (!response.ok) {
      return { ok: false, reason: "not-found" };
    }

    const htmlText = await response.text();
    const doc = new DOMParser().parseFromString(htmlText, "text/html");

    const spanElement = doc.querySelector('span[title^="Unix timestamp:"]');
    if (!spanElement) {
      return { ok: false, reason: "not-found" };
    }

    const titleAttr = spanElement.getAttribute("title");
    const txUnixTime = parseInt(titleAttr.replace("Unix timestamp:", "").trim(), 10);
    const currentUnixTime = Math.floor(Date.now() / 1000);
    const timeDiff = Math.abs(currentUnixTime - txUnixTime);

    return { ok: timeDiff <= maxDiffSeconds, reason: timeDiff <= maxDiffSeconds ? null : "too-old" };
  } catch (err) {
    // Most likely a CORS block or offline network — not proof the hash is invalid.
    return { ok: false, reason: "network" };
  }
}
