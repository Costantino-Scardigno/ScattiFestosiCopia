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
        `http://localhost:8080/api/events/${selectedAlbum.id}/share`,
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

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div
        className="modal-content bg-light-custom"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header bg-secondary-custom rounded-top-4">
          <h5 className="modal-title text-primary-custom">Condividi Album</h5>
          <button
            type="button"
            className="btn-close"
            onClick={onClose}
            aria-label="Chiudi"
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
          <button className="btn btn-secondary-custom" onClick={onClose}>
            Chiudi
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareAlbumModal;
