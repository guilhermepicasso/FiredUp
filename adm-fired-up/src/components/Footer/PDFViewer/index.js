import React from 'react';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

const PDFViewer = () => {
    const defaultLayout = defaultLayoutPlugin();
    return (
      <div style={{ height: '100vh' }}>
        <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}>
          <Viewer fileUrl="/Assets/images/TERMO_DE_USO_FIREDUP.pdf"
          plugins={[defaultLayout]}/>
        </Worker>
      </div>
    );
  };

export default PDFViewer;