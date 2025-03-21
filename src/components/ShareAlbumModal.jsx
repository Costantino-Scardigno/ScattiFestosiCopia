import React, { useState, useEffect } from "react";
import { X, Copy, Check, QrCode } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import "./ShareAlbumModal.css";

const ShareAlbumModal = ({
  isOpen,
  onClose,
  selectedAlbum,
  onShareSuccess,
}) => {
  const [shareLink, setShareLink] = useState("");
  const [qrVisible, setQrVisible] = useState(false);
  const [copyStatus, setCopyStatus] = useState("idle");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isClosing, setIsClosing] = useState(false);

  // Reset isClosing quando il modale viene aperto
  useEffect(() => {
    if (isOpen) {
      setIsClosing(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && selectedAlbum) {
      generateShareLink();
    }
  }, [isOpen, selectedAlbum]);

  const generateShareLink = async () => {
    if (!selectedAlbum || !selectedAlbum.id) return;

    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        `https://dominant-aubine-costantino-127b0ac1.koyeb.app/api/events/${selectedAlbum.id}/share`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Errore nella generazione del link di condivisione");
      }

      const data = await response.json();
      // Crea un URL completo con il nome di dominio
      const fullShareUrl = `${window.location.origin}/album/share/${data.shareCode}`;
      setShareLink(fullShareUrl);

      // Notifica il successo
      if (onShareSuccess) {
        onShareSuccess();
      }
    } catch (error) {
      console.error("Errore:", error);
      setError(
        "Si è verificato un errore nella generazione del link di condivisione"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareLink).then(
      () => {
        setCopyStatus("copied");
        setTimeout(() => setCopyStatus("idle"), 2000);
      },
      () => {
        setError("Impossibile copiare negli appunti");
      }
    );
  };

  const toggleQrCode = () => {
    setQrVisible(!qrVisible);
  };

  // Gestione della chiusura con animazione
  const handleClose = () => {
    if (isClosing) return;

    setIsClosing(true);

    // Aggiungi le classi per l'animazione di chiusura
    const modale = document.getElementById("share-album-modale");
    const modaleBackDrop = document.getElementById("share-album-backdrop");

    if (modale && modaleBackDrop) {
      modale.classList.remove("animation");
      modale.classList.add("animation-close");
      modaleBackDrop.classList.remove("animation");
      modaleBackDrop.classList.add("animation-close");

      // Attendi che l'animazione finisca prima di chiudere effettivamente il modale
      setTimeout(() => {
        onClose();
      }, 1000); // Durata dell'animazione (1 secondo)
    } else {
      // Fallback in caso gli elementi non vengano trovati
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Modale */}
      <div
        id="share-album-modale"
        className="modal animation"
        style={{ display: "block" }}
        tabIndex="-1"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content bg-light-custom">
            <div className="modal-header bg-secondary-custom rounded-top-4">
              <h5 className="modal-title text-primary-custom">
                Condividi Album
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={handleClose}
                aria-label="Chiudi"
                disabled={isClosing}
              ></button>
            </div>
            <div className="modal-body p-4">
              {isLoading ? (
                <div className="text-center py-4">
                  <div
                    className="spinner-border text-secondary-custom"
                    role="status"
                  >
                    <span className="visually-hidden">Caricamento...</span>
                  </div>
                  <p className="mt-2 text-primary-custom">
                    Generazione del link di condivisione...
                  </p>
                </div>
              ) : error ? (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              ) : (
                <>
                  <p className="mb-3 text-primary-custom">
                    Condividi l'album "{selectedAlbum?.name}" con i tuoi amici
                    utilizzando il link sottostante:
                  </p>
                  <div className="input-group mb-3">
                    <input
                      type="text"
                      className="form-control border-custom"
                      value={shareLink}
                      readOnly
                    />
                    <button
                      className="btn btn-secondary-custom d-flex align-items-center"
                      type="button"
                      onClick={copyToClipboard}
                      disabled={isClosing}
                    >
                      {copyStatus === "copied" ? (
                        <>
                          <Check size={18} className="me-1" />
                          <span>Copiato</span>
                        </>
                      ) : (
                        <>
                          <Copy size={18} className="me-1" />
                          <span>Copia</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="d-flex justify-content-center mt-4">
                    <button
                      className="btn btn-outline-custom d-flex align-items-center"
                      onClick={toggleQrCode}
                      disabled={isClosing}
                    >
                      <QrCode size={18} className="me-2" />
                      {qrVisible ? "Nascondi QR Code" : "Mostra QR Code"}
                    </button>
                  </div>

                  {qrVisible && (
                    <div className="text-center mt-4">
                      <div className="d-inline-block p-3 bg-white-custom rounded shadow-sm">
                        <QRCodeSVG value={shareLink} size={200} />
                      </div>
                      <p className="mt-2 text-muted-custom">
                        Scansiona questo QR code per aprire l'album
                      </p>
                    </div>
                  )}

                  <div className="alert alert-info mt-4" role="alert">
                    <strong>Nota:</strong> Chiunque abbia accesso a questo link
                    potrà visualizzare l'album e le relative foto.
                  </div>
                </>
              )}
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-secondary-custom"
                onClick={handleClose}
                disabled={isClosing}
              >
                Chiudi
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Backdrop del modale */}
      <div
        id="share-album-backdrop"
        className="modal-backdrop bg-modal animation"
        style={{ backgroundColor: "rgba(53, 34, 8, 0.5)" }}
      ></div>
    </>
  );
};

export default ShareAlbumModal;
