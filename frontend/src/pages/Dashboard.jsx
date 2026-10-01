import { useState } from "react";
import { Link } from "react-router-dom";

import AddBook from "./AddBook";
import Books from "./Books";

function Dashboard() {
  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const [refresh, setRefresh] = useState(0);

  const refreshBooks = () => {
    setRefresh((prev) => prev + 1);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "/login";
  };

  return (
    <div className="container">
      <div className="card">
        <div className="dashboard-header">
          <div>
            <h2>User Dashboard</h2>

            {user && (
              <div className="user-info">
                <p>
                  Welcome, <strong>{user.name}</strong>
                </p>

                <p>{user.email}</p>

                <span className="badge">
                  {user.role}
                </span>
              </div>
            )}
          </div>

          <div className="nav-buttons">
            <Link to="/ai">
              <button className="ai-btn">
                AI Assistant
              </button>
            </Link>

            <button
              className="secondary-btn"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="card">
        <AddBook
          onBookAdded={refreshBooks}
        />
      </div>

      <div className="card">
        <Books refresh={refresh} />
      </div>
    </div>
  );
}

export default Dashboard;