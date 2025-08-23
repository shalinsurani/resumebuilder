import React, { useEffect, useRef, useState } from 'react';
import { fillLatexTemplate } from '../../utils/fillLatexTemplate';
import { latexToPdfApi } from '../../services/latexToPdfApi';

const LatexTemplate = (props) => {
  const [pdfUrl, setPdfUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const iframeRef = useRef();

  useEffect(() => {
    const generatePdf = async () => {
      setLoading(true);
      setError(null);
      setPdfUrl(null);
      try {
        // 1. Fetch the LaTeX template file
        const templateResp = await fetch('/src/components/templates/LatexResumeTemplate.tex');
        const template = await templateResp.text();
        // 2. Fill the template with user data
        const latexCode = fillLatexTemplate(template, props);
        // 3. Send to backend API to get PDF
        const pdfBlob = await latexToPdfApi(latexCode);
        // 4. Create a blob URL for the PDF
        const url = URL.createObjectURL(pdfBlob);
        setPdfUrl(url);
      } catch (e) {
        setError(e?.message || 'Failed to generate PDF preview.');
      } finally {
        setLoading(false);
      }
    };
    generatePdf();
    // Cleanup blob URL on unmount
    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
    // eslint-disable-next-line
  }, [JSON.stringify(props)]);

  return (
    <div style={{ width: '100%', height: '80vh', background: '#f8f9fa', borderRadius: 8, boxShadow: '0 2px 8px #0001', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {loading && <div>Generating PDF preview...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {pdfUrl && (
        <iframe
          ref={iframeRef}
          src={pdfUrl}
          title="LaTeX PDF Preview"
          style={{ width: '100%', height: '100%', border: 'none', borderRadius: 8 }}
        />
      )}
    </div>
  );
};

export default LatexTemplate;
