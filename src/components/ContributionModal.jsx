import { useEffect, useRef, useState } from "react";
import { RECEIVER_ADDRESS } from "../config.js";
import { generateBeldexQrDataUrl, verifyTxTimestamp } from "../lib/beldex.js";

const PRESET_AMOUNTS = [50, 100, 200, 500];
const SCAN_DESCRIPTION = "Scan the QR with the Beldex wallet and make the BDX transaction";

export default function ContributionModal({ isOpen, onClose }) {
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState(null);
  const [amountError, setAmountError] = useState(false);

  const [qrDataUrl, setQrDataUrl] = useState(null);
  const [qrError, setQrError] = useState(false);
  const [addressCopied, setAddressCopied] = useState(false);

  const [txHash, setTxHash] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState(null);
  const [verifiedViaNetwork, setVerifiedViaNetwork] = useState(true);

  const firstOptionRef = useRef(null);
  const lastFocusedElement = useRef(null);

  // Reset everything and manage focus/scroll whenever the modal opens or closes.
  useEffect(() => {
    if (isOpen) {
      lastFocusedElement.current = document.activeElement;
      setStep(1);
      setAmount(null);
      setAmountError(false);
      setQrDataUrl(null);
      setQrError(false);
      setAddressCopied(false);
      setTxHash("");
      setIsVerifying(false);
      setVerifyError(null);
      setVerifiedViaNetwork(true);
      document.body.style.overflow = "hidden";
      setTimeout(() => firstOptionRef.current?.focus(), 0);
    } else {
      document.body.style.overflow = "";
      lastFocusedElement.current?.focus();
    }
  }, [isOpen]);

  // Close on Escape.
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape" && isOpen) onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Generate the QR code as soon as step 2 opens with a confirmed amount.
  useEffect(() => {
    if (step !== 2 || !amount) return;
    let cancelled = false;
    setQrDataUrl(null);
    setQrError(false);

    generateBeldexQrDataUrl(RECEIVER_ADDRESS, amount, SCAN_DESCRIPTION)
      .then((dataUrl) => {
        if (!cancelled) setQrDataUrl(dataUrl);
      })
      .catch(() => {
        if (!cancelled) setQrError(true);
      });

    return () => {
      cancelled = true;
    };
  }, [step, amount]);

  if (!isOpen) return null;

  function selectAmount(value) {
    setAmount(value);
    setAmountError(false);
  }

  function handleChooseAmount() {
    if (!amount || amount <= 0) {
      setAmountError(true);
      return;
    }
    setStep(2);
  }

  //done
  function handleCopyAddress() {
    navigator.clipboard
      .writeText(RECEIVER_ADDRESS)
      .then(() => {
        setAddressCopied(true);
        setTimeout(() => setAddressCopied(false), 2000);
      })
      .catch(() => {
        // Clipboard API can be blocked (e.g. insecure context); fail quietly.
      });
  }

  async function handleVerify() {
    if (!txHash.trim()) return;
    setIsVerifying(true);
    setVerifyError(null);

    const result = await verifyTxTimestamp(txHash.trim());
    setIsVerifying(false);

    if (result.ok) {
      setVerifiedViaNetwork(true);
      setStep(3);
      return;
    }

    if (result.reason === "network") {
      // We couldn't even reach the explorer (most likely a browser CORS
      // block, since explorer.beldex.io isn't set up for cross-origin
      // browser requests). That's an infrastructure limitation, not proof
      // the hash is wrong, so we let the contributor through and flag it
      // for manual confirmation rather than dead-ending them.
      setVerifiedViaNetwork(false);
      setStep(3);
      return;
    }

    setVerifyError(
      "We couldn't verify this transaction on the explorer. Please double-check the hash and try again."
    );
  }

  function handleOverlayClick(event) {
    if (event.target === event.currentTarget) onClose();
  }

  const formattedAmount = amount ? amount.toLocaleString("en-IN") : "0";

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <button className="modal-close" type="button" onClick={onClose} aria-label="Close">
          &times;
        </button>

        <div className="modal-progress" aria-hidden="true">
          <span className={`progress-dot ${step === 1 ? "is-active" : "is-done"}`} />
          <span className={`progress-dot ${step === 2 ? "is-active" : step > 2 ? "is-done" : ""}`} />
          <span className={`progress-dot ${step === 3 ? "is-active" : ""}`} />
        </div>

        {step === 1 && (
          <section className="modal-step">
            <h2 id="modal-title">Choose your contribution</h2>
            <p className="modal-sub">Select a BDX amount to continue.</p>

            <div className="amount-grid" role="group" aria-label="BDX amounts">
              {PRESET_AMOUNTS.map((value, index) => (
                <button
                  key={value}
                  ref={index === 0 ? firstOptionRef : null}
                  type="button"
                  className={`amount-option ${amount === value ? "is-selected" : ""}`}
                  onClick={() => selectAmount(value)}
                >
                  {value} BDX
                </button>
              ))}
            </div>

            {amountError && (
              <p className="field-error">Please choose an amount to continue.</p>
            )}

            <div className="modal-actions">
              <button type="button" className="btn btn-primary" onClick={handleChooseAmount}>
                Make your contribution
              </button>
            </div>
          </section>
        )}

        {step === 2 && (
          <section className="modal-step">
            <h2 id="modal-title">Scan &amp; pay with Beldex</h2>
            <p className="modal-sub">
              Sending <strong>{formattedAmount}</strong> BDX. Scan the QR with the Beldex
              wallet and make the BDX transaction, or copy the address below.
            </p>

            <div className="qr-box">
              {qrDataUrl && <img src={qrDataUrl} alt="Beldex payment QR code" width="200" height="200" />}
              {!qrDataUrl && !qrError && <div className="qr-placeholder">Generating QR code…</div>}
              {qrError && (
                <p className="field-error">
                  Couldn't generate the QR code. You can still pay using the address below.
                </p>
              )}
            </div>

            <label className="field" htmlFor="receiver-address">
              Receiver address
              <div className="address-row">
                <input id="receiver-address" type="text" readOnly value={RECEIVER_ADDRESS} />
                <button type="button" className="btn btn-small" onClick={handleCopyAddress}>
                  {addressCopied ? "Copied" : "Copy"}
                </button>
              </div>
            </label>

            <label className="field" htmlFor="tx-hash">
              Paste the transaction hash of your payment
              <input
                id="tx-hash"
                type="text"
                placeholder="e.g. 644a564d22ad0de3e29715a77dd0b17fb079a3ddd..."
                value={txHash}
                onChange={(event) => {
                  setTxHash(event.target.value);
                  setVerifyError(null);
                }}
              />
            </label>

            {verifyError && <p className="field-error">{verifyError}</p>}

            <div className="modal-actions modal-actions-split">
              <button type="button" className="btn btn-ghost" onClick={() => setStep(1)}>
                Back
              </button>
              <button
                type="button"
                className="btn btn-primary"
                disabled={!txHash.trim() || isVerifying}
                onClick={handleVerify}
              >
                {isVerifying ? "Verifying…" : "Next"}
              </button>
            </div>
          </section>
        )}

        {step === 3 && (
          <section className="modal-step">
            <div className="success-mark" aria-hidden="true">
              <svg viewBox="0 0 40 40" width="44" height="44">
                <path
                  d="M20 33 C 8 25, 3 17, 8 11 C 12 6, 18 7, 20 13 C 22 7, 28 6, 32 11 C 37 17, 32 25, 20 33 Z"
                  fill="var(--rose)"
                />
              </svg>
            </div>
            <h2>Thank you.</h2>
            <p className="modal-sub">
              You've contributed <strong>{formattedAmount}</strong> BDX to Second Heart — and
              helped someone live even longer.
            </p>
            {amount > 100 && (
              <p className="modal-sub">
                Since your contribution is over 100 BDX, your name and contribution will be
                permanently registered on the blockchain.
              </p>
            )}
            {!verifiedViaNetwork && (
              <p className="modal-sub">
                We couldn't automatically confirm your transaction from the browser just now —
                Balamurugan will verify it manually and follow up with you.
              </p>
            )}
            {/* <p className="modal-sub">Questions in the meantime? Reach out directly:</p>
            <ul className="contact-list contact-list-modal">
              <li>
                <span className="contact-label">Phone</span>{" "}
                <a href="tel:+919150800518">+91 91508 00518</a>
              </li>
              <li>
                <span className="contact-label">Email</span>{" "}
                <a href="mailto:balamurugannagarajan.vm@gmail.com">
                  balamurugannagarajan.vm@gmail.com
                </a>
              </li>
            </ul> */}
            <div className="modal-actions">
              <button type="button" className="btn btn-primary" onClick={onClose}>
                Done
              </button>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
