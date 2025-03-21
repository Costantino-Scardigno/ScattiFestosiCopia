// DashboardHeader.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, User, LogOut } from "lucide-react";
import { Button, InputGroup } from "react-bootstrap";

const DashboardHeader = ({ onSearch, searchQuery, setSearchQuery }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleLogout = () => {
    // Rimuovi il token di autenticazione
    localStorage.removeItem("authToken");
    // Reindirizza alla home page
    navigate("/");
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    if (onSearch) {
      onSearch(e.target.value);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("authToken");

        if (!token) {
          console.error("Token non trovato");
          navigate("/"); // Reindirizza al login se il token non esiste
          return;
        }

        const tokenParts = token.split(".");
        if (tokenParts.length !== 3) {
          throw new Error("Token non valido");
        }

        const payload = JSON.parse(atob(tokenParts[1]));
        const username = payload.sub || payload.username;

        if (!username) {
          throw new Error("Impossibile recuperare le informazioni utente");
        }

        const response = await fetch(
          `https://dominant-aubine-costantino-127b0ac1.koyeb.app/api/users/${username}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          console.error("Errore API:", response.status);
          if (response.status === 401) {
            // Gestione specifica per errori di autenticazione
            localStorage.removeItem("authToken");
            navigate("/");
            return;
          }
          throw new Error("Errore nel recupero delle informazioni utente");
        }

        const userData = await response.json();
        setUser(userData);
      } catch (error) {
        console.error("Errore nel recupero dati utente:", error);
        // Gestione degli errori più robusta
        setUser(null);
      }
    };

    fetchUserData();
  }, [navigate]); // Aggiungi navigate come dipendenza

  return (
    <nav className="px-0 py-2 bg-dashboard">
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center">
        <Link className="text-decoration-none fs-2 text-primary-custom" to="/">
          ScattiFestosi
        </Link>
        <div className="d-flex align-items-center my-3">
          <div className="me-3">
            <form onSubmit={handleSearchSubmit}>
              <InputGroup className="d-flex align-items-center">
                <Button variant="outline-daek" className="btn-primary-custom">
                  <Search className="text-muted-custom " size={18} />
                </Button>
                <input
                  type="text"
                  placeholder="Cerca album o foto..."
                  className="form-control ps-4"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
              </InputGroup>
            </form>
          </div>
          <div className="position-relative">
            <div
              className="rounded-circle bg-secondary-custom d-flex align-items-center justify-content-center cursor-pointer"
              style={{ width: "40px", height: "40px", cursor: "pointer" }}
              onClick={toggleDropdown}
            >
              {user && user.profileImage ? (
                <img
                  src={user.profileImage}
                  alt="immagine di profilo"
                  className="w-100 h-100 rounded-circle object-fit-cover"
                />
              ) : (
                <User size={24} className="text-white-custom" />
              )}
            </div>

            {showDropdown && (
              <div
                className="position-absolute end-0 mt-2 py-2 bg-white-custom rounded shadow-sm"
                style={{ width: "150px", zIndex: 1000 }}
              >
                <button
                  className="dropdown-item d-flex align-items-center px-3 py-2 text-primary-custom"
                  onClick={handleLogout}
                >
                  <LogOut size={16} className="me-2" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default DashboardHeader;
