import React from "react";
import { AlertTriangle, Loader, Trash2, User } from "lucide-react";

const DeleteCommentModal = ({
  isOpen,
  onClose,
  onConfirm,
  comment,
  isDeleting,
  error,
}) => {
  if (!isOpen || !comment) return null;

  // Funzione per formattare la data
  const formatDate = (timestamp) => {
    if (!timestamp) return "";

    const date = new Date(timestamp);
    return date.toLocaleDateString("it-IT", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div
      className="modal fade show d-block"
      style={{ backgroundColor: "rgba(53, 34, 8, 0.5)" }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content bg-light-custom border-custom rounded-4">
          <div className="modal-header bg-secondary-custom border-bottom border-custom rounded-top-4">
            <h5 className="modal-title text-primary-custom">
              Conferma eliminazione commento
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              disabled={isDeleting}
            ></button>
          </div>
          <div className="modal-body">
            <div className="d-flex align-items-center mb-3">
              <div className="me-3 text-danger">
                <AlertTriangle size={32} />
              </div>
              <div>
                <p className="mb-0 text-primary-custom">
                  Sei sicuro di voler eliminare questo commento?
                </p>
                <p className="small text-muted-custom mb-0">
                  Questa azione non può essere annullata.
                </p>
              </div>
            </div>

            {error && (
              <div className="alert alert-danger mt-3" role="alert">
                {error}
              </div>
            )}

            <div className="mt-3 p-3 border border-custom rounded-3 bg-white-custom">
              <div className="d-flex align-items-start">
                <div
                  className="rounded-circle bg-secondary-custom d-flex align-items-center justify-content-center me-2"
                  style={{ width: "32px", height: "32px" }}
                >
                  <User size={16} className="text-primary-custom" />
                </div>
                <div>
                  <div>
                    <span className="small fw-medium text-primary-custom">
                      {comment.username || comment.user}
                    </span>
                    <span
                      className="ms-2 text-muted-custom"
                      style={{ fontSize: "0.75rem" }}
                    >
                      {formatDate(comment.createdAt) || comment.time}
                    </span>
                  </div>
                  <p className="mb-0 small text-primary-custom">
                    {comment.content || comment.text}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer border-top border-custom">
            <button
              type="button"
              className="btn btn-outline-custom"
              onClick={onClose}
              disabled={isDeleting}
            >
              Annulla
            </button>
            <button
              type="button"
              className="btn btn-danger d-flex align-items-center"
              onClick={onConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader size={16} className="me-2 animate-spin" />
                  <span>Eliminazione...</span>
                </>
              ) : (
                <>
                  <Trash2 size={16} className="me-2" />
                  <span>Elimina commento</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteCommentModal;
