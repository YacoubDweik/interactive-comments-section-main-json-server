import Link from "next/link";

export default function NotFound() {
  return (
    <section className="error-section">
      <h2 className="text-3xl">There was a problem.</h2>
      <p>We could not find the page you were looking for.</p>
      <p>
        Go back to the
        <Link className="error-btn" href="/">
          dashboard
        </Link>
      </p>
    </section>
  );
}
