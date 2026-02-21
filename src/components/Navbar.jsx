import Link from "next/link";
import LogoutButton from "./LogoutButton";

export default function Navbar({ user }) {
  return (
    <nav>
      <h1>GTA V</h1>
      {user && (
        <span className="welcome-msg">
          Hello, <strong>{user.email.split("@")[0]}</strong>
        </span>
      )}
      <LogoutButton />
    </nav>
  );
}
