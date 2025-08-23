// Service to send LaTeX code to a backend API and get a PDF Blob
// Usage: await latexToPdfApi(latexCode)

export async function latexToPdfApi(latexCode) {
  // Use CloudCompiler Free Tier API for LaTeX-to-PDF conversion
  const response = await fetch('https://api.cloudcompiler.app/compile', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      compiler: 'pdflatex',
      code: latexCode,
      output: 'pdf'
    })
  });
  if (!response.ok) throw new Error('Failed to generate PDF from LaTeX');
  const result = await response.json();
  if (!result.success || !result.output) throw new Error('CloudCompiler failed: ' + (result.error || 'Unknown error'));
  // The output is a base64-encoded PDF
  const pdfBlob = await (await fetch(`data:application/pdf;base64,${result.output}`)).blob();
  return pdfBlob;
}
