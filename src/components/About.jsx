export default function About() {
  return (
    <section className="about" id="about">
      <div className="wrap about-grid">
        <div className="about-visual" aria-hidden="true">
          <svg viewBox="0 0 320 320" width="100%" height="100%">
            <path
              d="M160 260 C 70 200, 30 140, 60 90 C 85 48, 140 55, 160 100 C 180 55, 235 48, 260 90 C 290 140, 250 200, 160 260 Z"
              fill="none"
              stroke="var(--rose)"
              strokeWidth="3"
            />
            <path
              d="M60 150 L 120 150 L 140 110 L 165 190 L 185 130 L 205 150 L 260 150"
              fill="none"
              stroke="var(--ink)"
              strokeWidth="2.5"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <div className="about-copy">
          <h2>About this campaign</h2>
          <p>
            Second Heart is a community fundraiser built for one purpose: helping heart
            patients get the treatment they need, when they need it. Cardiac care is
            expensive and often urgent, and many families are left choosing between
            a procedure and their savings.
          </p>
          <p>
            Every contribution to this campaign is made in <strong>BDX</strong>, the medium
            we use to collect and route support directly toward patient care — surgeries,
            medication, hospital stays, and recovery. No amount is too small, and every
            BDX shared moves a patient closer to treatment.
          </p>
          <p>
            Contributions of more than 100 BDX are permanently registered on the
            blockchain, so your name and your contribution stay recorded as part of
            this campaign's story — for good.
          </p>
          {/* <p>
            This campaign is run personally by Balamurugan Nagarajan, who verifies each
            case and keeps contributors updated on where their support goes.
          </p> */}
        </div>
      </div>
    </section>
  );
}
