# Second Heart (React + Vite)

A crowdfunding campaign site for helping heart patients, contributed to in
BDX via a Beldex wallet payment, with QR code generation and transaction
hash verification.

## Structure

```
second-heart-react/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx
    ├── App.jsx                    Wires the page together + modal open state
    ├── config.js                  Receiver wallet address
    ├── index.css                  Styling (mobile responsive)
    ├── lib/
    │   └── beldex.js              QR generation + tx hash verification helpers
    └── components/
        ├── Header.jsx, Hero.jsx, About.jsx, HowItWorks.jsx, Footer.jsx
        └── ContributionModal.jsx  The 3-step contribution flow
```

## Run it locally

Requires **Node.js** (18+ recommended).

```bash
cd second-heart-react
npm install
npm run dev
```

Vite prints a local URL, usually `http://localhost:5173`. Open it on your
phone (same Wi-Fi, use the "Network" URL Vite also prints) to check the
mobile layout.

Other commands:
```bash
npm run build     # production build, output in dist/
npm run preview   # serve the production build locally
```

## The contribution flow

1. **Choose amount** — 50, 100, 200 or 500 BDX (no custom amount, per the
   latest spec).
2. **Scan & pay** — a QR code is generated for
   `beldex:<address>?tx_amount=<amount>&tx_description=...` using the
   `qrcode` package (`src/lib/beldex.js` → `generateBeldexQrDataUrl`). The
   receiver address is also shown as text with a **Copy** button. The
   contributor pastes the resulting transaction hash; **Next** only enables
   once something is typed in that field.
3. **Verify & thank you** — clicking Next calls `verifyTxTimestamp(txHash)`,
   which fetches `https://explorer.beldex.io/tx/<hash>`, reads the
   `Unix timestamp:` value out of the page, and checks it's recent. If it
   checks out, the contributor sees a thank-you screen (with a note about
   permanent blockchain registration for contributions over 100 BDX).

### About the verification step — one important caveat

The reference script used **Node.js** with `jsdom` to fetch and parse the
explorer page server-side. This app runs entirely in the browser, so
`src/lib/beldex.js` ports that logic using the browser's native
`fetch` + `DOMParser` instead of `jsdom` — same parsing logic, no extra
dependency.

The catch: `explorer.beldex.io` doesn't send CORS headers for browser
requests, so the `fetch()` call may be **blocked by the browser itself**
before it reaches the network, regardless of whether the transaction hash
is real. The code tells these two cases apart:

- **Hash checked, and it's invalid/too old** → the contributor sees an
  error and can correct the hash and try again.
- **Couldn't even reach the explorer** (CORS/network) → rather than
  dead-ending a genuine contributor because of a browser restriction that
  has nothing to do with them, they're let through to the thank-you screen
  with a note that Balamurugan will confirm the transaction manually.

**For production**, move `verifyTxTimestamp` to a small backend endpoint
(no CORS restriction between servers) and have the React app call that
endpoint instead of `explorer.beldex.io` directly. The parsing logic in
`src/lib/beldex.js` can be reused almost as-is on a Node server.

## Notes

- The receiver wallet address lives in `src/config.js` — update it there.
- Contributions aren't stored anywhere yet beyond the browser session; wire
  up a real backend if you need a persistent record of who has confirmed a
  transaction hash.
