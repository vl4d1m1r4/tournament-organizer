import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "Basketball Tournament App" },
    { name: "description", content: "View and manage basketball tournaments" },
  ];
};

export default function Index() {
  return (
    <div>
      <h1>Basketball Tournament App</h1>
      <p>
        Welcome to the Basketball Tournament App. View ongoing tournaments and
        results.
      </p>
      <p>Current date: {new Date().toLocaleDateString()}</p>
      <div className="cta-buttons">
        <a href="/tournaments" className="btn btn-primary">
          View Tournaments
        </a>
      </div>
    </div>
  );
}
