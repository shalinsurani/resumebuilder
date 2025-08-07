// Service to send LaTeX code to a backend API and get a PDF Blob
// Usage: await latexToPdfApi(latexCode)

export async function latexToPdfApi(latexCode) {
  // Replace with your backend API endpoint
  const endpoint = 'https://your-backend-api/latex-to-pdf';
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ latex: latexCode })
  });
  if (!response.ok) throw new Error('Failed to generate PDF from LaTeX');
  return await response.blob(); // PDF Blob
}
