import React, { useState, useEffect, useRef } from "react";
import {
  Settings,
  User,
  Mail,
  Key,
  Save,
  AlertCircle,
  Camera,
} from "lucide-react";

const SettingsTab = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Form states
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Validation errors
  const [passwordError, setPasswordError] = useState("");

  // File input ref
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      const token = localStorage.getItem("authToken");

      if (!token) {
        setError("Sessione scaduta, effettua nuovamente il login");
        setLoading(false);
        return;
      }

      try {
        // Decodifica token per prendere l'username
        const tokenParts = token.split(".");
        if (tokenParts.length !== 3) {
          throw new Error("Token non valido");
        }

        const payload = JSON.parse(atob(tokenParts[1]));
        const username = payload.sub || payload.username;

        if (!username) {
          throw new Error("Impossibile recuperare le informazioni utente");
        }

        // Fetch user data
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
          throw new Error("Errore nel recupero delle informazioni utente");
        }

        const userData = await response.json();
        setUser(userData);
        setUsername(userData.username || "");
        setEmail(userData.email || "");
        setProfileImage(userData.profileImage || null);
      } catch (error) {
        console.error("Errore:", error);
        setError(error.message || "Si è verificato un errore");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError("La dimensione dell'immagine non deve superare 10MB");
      return;
    }

    // Check file type
    const validTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!validTypes.includes(file.type)) {
      setError("Formato immagine non supportato. Usa JPEG, PNG o GIF");
      return;
    }

    // Crea un URL temporaneo per la preview
    const previewUrl = URL.createObjectURL(file);
    setProfileImage(previewUrl);
    setImageFile(file);
    setError(null);
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const validateForm = () => {
    // Reset errors
    setPasswordError("");

    // Validate password if user wants to change it
    if (newPassword || confirmPassword) {
      if (!currentPassword) {
        setPasswordError(
          "Inserisci la password attuale per confermare le modifiche"
        );
        return false;
      }

      if (newPassword.length < 6) {
        setPasswordError("La nuova password deve contenere almeno 6 caratteri");
        return false;
      }

      if (newPassword !== confirmPassword) {
        setPasswordError("Le password non corrispondono");
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setFormSubmitting(true);
    setSuccessMessage(null);
    setError(null);

    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("Sessione scaduta, effettua nuovamente il login");
      setFormSubmitting(false);
      return;
    }

    try {
      // Crea un oggetto FormData per inviare sia i dati JSON che i file
      const formData = new FormData();

      // Crea oggetto con i dati utente
      const userData = {
        email,
      };

      // Aggiungi i campi della password se necessario
      if (newPassword) {
        userData.currentPassword = currentPassword;
        userData.newPassword = newPassword;
      }

      // Aggiungi l'oggetto userData come parte multipart
      formData.append(
        "userData",
        new Blob([JSON.stringify(userData)], {
          type: "application/json",
        })
      );

      // Aggiungi l'immagine se è stata cambiata
      if (imageFile) {
        formData.append("profileImage", imageFile);
      }

      // Aggiorna l'utente
      const response = await fetch(
        `https://dominant-aubine-costantino-127b0ac1.koyeb.app/api/users/${user.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        let errorMessage;
        try {
          const errorData = await response.json();
          errorMessage =
            errorData.message || "Errore durante l'aggiornamento del profilo";
        } catch (e) {
          errorMessage = "Errore durante l'aggiornamento del profilo";
        }
        throw new Error(errorMessage);
      }

      // Update user state with response
      const updatedUser = await response.json();
      setUser(updatedUser);

      // Aggiorna l'URL dell'immagine con quello permanente da Cloudinary
      if (updatedUser.profileImage) {
        setProfileImage(updatedUser.profileImage);
      }

      // Resetta lo stato dell'immagine del file
      setImageFile(null);

      // Pulisci i campi della password
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setSuccessMessage("Profilo aggiornato con successo");
    } catch (error) {
      console.error("Errore:", error);
      setError(
        error.message || "Si è verificato un errore durante l'aggiornamento"
      );
    } finally {
      setFormSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-secondary-custom" role="status">
          <span className="visually-hidden">Caricamento...</span>
        </div>
        <p className="mt-3 text-primary-custom">Caricamento impostazioni...</p>
      </div>
    );
  }

  return (
    <div className="container-fluid py-3">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <div className="card bg-white-custom shadow-sm border-custom">
            <div className="card-header bg-secondary-custom border-custom">
              <div className="d-flex align-items-center">
                <Settings size={20} className="me-2 text-primary-custom" />
                <h3 className="h5 mb-0 text-primary-custom">
                  Impostazioni account
                </h3>
              </div>
            </div>
            <div className="card-body p-4">
              {error && (
                <div
                  className="alert alert-danger d-flex align-items-center"
                  role="alert"
                >
                  <AlertCircle size={18} className="me-2" />
                  <div>{error}</div>
                </div>
              )}

              {successMessage && (
                <div className="alert alert-success" role="alert">
                  {successMessage}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {/* Profile Image Section */}
                <div className="mb-4 text-center">
                  <h4 className="h6 text-primary-custom border-bottom pb-2 mb-3">
                    Immagine di profilo
                  </h4>

                  {/* Profile Image Container */}
                  <div className="d-flex flex-column align-items-center mb-3">
                    <div
                      className="rounded-circle mb-3 position-relative"
                      style={{
                        width: "150px",
                        height: "150px",
                        overflow: "hidden",
                        border: "3px solid var(--secondary-custom)",
                      }}
                    >
                      {profileImage ? (
                        <img
                          src={profileImage}
                          alt="Immagine profilo"
                          className="w-100 h-100 object-fit-cover"
                        />
                      ) : (
                        <div
                          className="w-100 h-100 d-flex align-items-center justify-content-center"
                          style={{ backgroundColor: "var(--light-custom)" }}
                        >
                          <User size={80} className="text-secondary-custom" />
                        </div>
                      )}
                    </div>

                    {/* Hidden File Input */}
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageChange}
                      accept="image/jpeg,image/png,image/gif"
                      className="d-none"
                    />

                    {/* Upload Button */}
                    <button
                      type="button"
                      className="btn btn-secondary-custom d-flex align-items-center"
                      onClick={triggerFileInput}
                    >
                      <Camera size={16} className="me-2" />
                      <span>Seleziona immagine</span>
                    </button>

                    {imageFile && (
                      <p className="small text-muted-custom mt-2">
                        Immagine selezionata: {imageFile.name}
                      </p>
                    )}
                  </div>
                </div>

                {/* Personal Information Section */}
                <div className="mb-4">
                  <h4 className="h6 text-primary-custom border-bottom pb-2 mb-3">
                    Informazioni personali
                  </h4>

                  <div className="mb-3">
                    <label
                      htmlFor="username"
                      className="form-label d-flex align-items-center"
                    >
                      <User size={16} className="me-2 text-secondary-custom" />
                      <span>Username</span>
                    </label>
                    <input
                      type="text"
                      className="form-control border-custom"
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      readOnly
                    />
                    <small className="text-muted-custom">
                      Lo username non può essere modificato
                    </small>
                  </div>

                  <div className="mb-3">
                    <label
                      htmlFor="email"
                      className="form-label d-flex align-items-center"
                    >
                      <Mail size={16} className="me-2 text-secondary-custom" />
                      <span>Email</span>
                    </label>
                    <input
                      type="email"
                      className="form-control border-custom"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                {/* Password Change Section */}
                <div className="mb-4">
                  <h4 className="h6 text-primary-custom border-bottom pb-2 mb-3">
                    Modifica password
                  </h4>

                  {passwordError && (
                    <div className="alert alert-danger py-2" role="alert">
                      {passwordError}
                    </div>
                  )}

                  <div className="mb-3">
                    <label
                      htmlFor="currentPassword"
                      className="form-label d-flex align-items-center"
                    >
                      <Key size={16} className="me-2 text-secondary-custom" />
                      <span>Password attuale</span>
                    </label>
                    <input
                      type="password"
                      className="form-control border-custom"
                      id="currentPassword"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="newPassword" className="form-label">
                      Nuova password
                    </label>
                    <input
                      type="password"
                      className="form-control border-custom"
                      id="newPassword"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <small className="text-muted-custom">
                      Minimo 6 caratteri
                    </small>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="confirmPassword" className="form-label">
                      Conferma nuova password
                    </label>
                    <input
                      type="password"
                      className="form-control border-custom"
                      id="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="d-flex justify-content-end">
                  <button
                    type="submit"
                    className="btn btn-secondary-custom d-flex align-items-center"
                    disabled={formSubmitting}
                  >
                    {formSubmitting ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        <span>Salvataggio...</span>
                      </>
                    ) : (
                      <>
                        <Save size={16} className="me-2" />
                        <span>Salva modifiche</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsTab;
