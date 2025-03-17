import React, { useState } from "react";
import { Camera, X, Upload, Loader } from "lucide-react";

const UploadPhotoModal = ({
  isOpen,
  onClose,
  selectedAlbum,
  onUploadSuccess,
}) => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files).map((file) => ({
        name: file.name,
        size: (file.size / 1024).toFixed(2) + " KB",
        preview: URL.createObjectURL(file),
        file: file,
      }));
      setFiles([...files, ...filesArray]);
    }
  };

  const removeFile = (index) => {
    const newFiles = [...files];
    URL.revokeObjectURL(newFiles[index].preview);
    newFiles.splice(index, 1);
    setFiles(newFiles);
  };

  const uploadFiles = async () => {
    if (files.length === 0) return;
    if (!selectedAlbum || !selectedAlbum.id) {
      setError("Album selezionato non valido");
      return;
    }

    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("Sessione scaduta. Effettua nuovamente il login.");
      return;
    }

    setUploading(true);
    setError(null);
    setUploadProgress(0);

    const totalFiles = files.length;
    let uploadedCount = 0;
    let successCount = 0;

    try {
      for (const fileObj of files) {
        try {
          const formData = new FormData();
          formData.append("file", fileObj.file);
          formData.append("eventId", selectedAlbum.id);

          const response = await fetch(
            "http://localhost:8080/api/photos/upload",
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
              },
              body: formData,
            }
          );

          if (!response.ok) {
            throw new Error(`Errore durante il caricamento di ${fileObj.name}`);
          }

          successCount++;
        } catch (err) {
          console.error(
            `Errore durante il caricamento di ${fileObj.name}:`,
            err
          );
        }

        uploadedCount++;
        setUploadProgress(Math.round((uploadedCount / totalFiles) * 100));
      }

      if (successCount === totalFiles) {
        console.log("Tutti i file caricati con successo");
        setError(null);

        if (typeof onUploadSuccess === "function") {
          try {
            await onUploadSuccess();
          } catch (err) {
            console.error("Errore durante la callback di successo:", err);
          }
        }
        // Pulisci i file
        setFiles([]);
        // Chiudi il modale
        onClose();
      } else if (successCount > 0) {
        console.log(`Caricati ${successCount} su ${totalFiles} file`);
        setError(`Caricati ${successCount} su ${totalFiles} file`);
        // Notifica comunque il successo parziale
        if (typeof onUploadSuccess === "function") {
          try {
            await onUploadSuccess();
          } catch (err) {
            console.error("Errore durante la callback di successo:", err);
          }
        }
      } else {
        setError("Errore durante il caricamento di tutti i file");
      }
    } catch (error) {
      console.error("Errore durante il caricamento:", error);
      setError("Si è verificato un errore durante il caricamento");
    } finally {
      setUploading(false);
    }
  };

  // Reset dei file quando il modale viene chiuso
  const handleClose = () => {
    if (!uploading) {
      setFiles([]);
      setError(null);
      setUploadProgress(0);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="modal fade show d-block"
      style={{ backgroundColor: "rgba(53, 34, 8, 0.5)" }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content bg-light-custom">
          <div className="modal-header bg-secondary-custom">
            <h5 className="modal-title text-primary-custom">
              Carica foto in {selectedAlbum?.name || "album"}
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={handleClose}
              disabled={uploading}
            ></button>
          </div>

          <div className="modal-body">
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            <div
              className="border border-2 rounded p-4 text-center mb-4 border-custom"
              style={{ borderStyle: "dashed" }}
            >
              <div className="d-flex flex-column align-items-center">
                <Camera size={48} className="text-secondary-custom mb-3" />
                <p className="text-muted-custom mb-2">
                  Trascina qui le tue foto o
                </p>
                <label className="btn-animated-album btn btn-secondary-custom">
                  Sfoglia file
                  <input
                    type="file"
                    multiple
                    className="d-none"
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={uploading}
                  />
                </label>
                <p className="text-muted-custom small mt-2">
                  Supporta JPG, PNG e GIF fino a 10MB
                </p>
              </div>
            </div>

            {files.length > 0 && (
              <div>
                <h6 className="mb-3 text-primary-custom">
                  File selezionati ({files.length})
                </h6>
                <div className="row g-3">
                  {files.map((file, index) => (
                    <div key={index} className="col-md-3 col-sm-4 col-6">
                      <div className="position-relative">
                        <img
                          src={file.preview}
                          alt={file.name}
                          className="img-fluid rounded"
                          style={{ aspectRatio: "1", objectFit: "cover" }}
                        />
                        <button
                          className="btn btn-sm btn-danger position-absolute top-0 end-0 rounded-circle p-0 m-1"
                          style={{ width: "24px", height: "24px" }}
                          onClick={() => removeFile(index)}
                          disabled={uploading}
                        >
                          <X size={14} />
                        </button>
                        <div
                          className="small mt-1 text-truncate text-primary-custom"
                          style={{ maxWidth: "100%" }}
                        >
                          {file.name}
                        </div>
                        <div className="small text-muted-custom">
                          {file.size}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {uploading && (
              <div className="mt-4">
                <div className="d-flex align-items-center mb-2">
                  <span className="me-2 text-primary-custom">
                    Caricamento in corso...
                  </span>
                  <Loader
                    size={16}
                    className="animate-spin text-secondary-custom"
                  />
                </div>
                <div className="progress">
                  <div
                    className="progress-bar bg-secondary-custom text-primary-custom"
                    role="progressbar"
                    style={{ width: `${uploadProgress}%` }}
                    aria-valuenow={uploadProgress}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  >
                    {uploadProgress}%
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-outline-custom"
              onClick={handleClose}
              disabled={uploading}
            >
              Annulla
            </button>
            <button
              type="button"
              className="btn-animated-album btn btn-secondary-custom d-flex align-items-center"
              onClick={uploadFiles}
              disabled={files.length === 0 || uploading}
            >
              {uploading ? (
                <>
                  <Loader size={16} className="me-2 animate-spin" />
                  <span>Caricamento...</span>
                </>
              ) : (
                <>
                  <Upload size={16} className="me-2" />
                  <span>Carica foto</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadPhotoModal;
