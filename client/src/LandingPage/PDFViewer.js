/* eslint-disable jsx-a11y/iframe-has-title */
import React from "react";
import "../styles/PDFViewer.css"; // Asegúrate de agregar estilos

const PDFViewer = () => {
    const pdfUrl = "https://drive.google.com/file/d/1NXxiiY7XqHLU9YjeZ0I29vsanwG6_xXq/preview";
    return (
        <div className="pdf-viewer-container">
            <iframe
                src={pdfUrl}
                className="pdf-iframe"
                title="Visor de PDF"
            ></iframe>
        </div>
    );
};

export default PDFViewer;
