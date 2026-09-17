const steps = [
  {
    title: "Select the contribution amount",
    body: "Pick a BDX amount — 50, 100, 200, or 500 — that feels right for you."
  },
  {
    title: "Scan the QR and pay",
    body: "Scan the QR with your Beldex wallet, or copy the address, and send the BDX."
  },
  {
    title: "Paste your transaction hash",
    body:
      "Paste the tx hash so we can verify it. Contributions over 100 BDX are permanently registered on the blockchain."
  }
];

export default function HowItWorks({ onOpenModal }) {
  return (
    <section className="how" id="how">
      <div className="wrap">
        <h2>How your contribution works</h2>
        <ol className="steps">
          {steps.map((step, index) => (
            <li className="step" key={step.title}>
              <span className="step-num">{index + 1}</span>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </li>
          ))}
        </ol>
        <div className="how-cta">
          <button className="btn btn-primary" onClick={onOpenModal}>
            Start helping with BDX
          </button>
        </div>
      </div>
    </section>
  );
}
