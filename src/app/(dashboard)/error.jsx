"use client";

export default function error({ error, reset }) {
  return (
    <section className="error-section">
      <h2 className="text-4xl">Oh No!</h2>
      <p>{error.message}</p>
      <button onClick={reset} className="error-btn">
        Maybe try again?
      </button>
    </section>
  );
}
