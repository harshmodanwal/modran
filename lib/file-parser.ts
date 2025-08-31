import { PDFExtract } from 'pdf.js-extract';
import mammoth from 'mammoth';

export async function extractTextFromFile(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const uint8Array = new Uint8Array(buffer);

  if (file.type === 'application/pdf') {
    return await extractTextFromPDF(uint8Array);
  } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    return await extractTextFromDOCX(uint8Array);
  } else {
    throw new Error('Unsupported file type');
  }
}

async function extractTextFromPDF(buffer: Uint8Array): Promise<string> {
  try {
    const pdfExtract = new PDFExtract();
    const data = await pdfExtract.extractBuffer(buffer);
    
    let text = '';
    data.pages.forEach(page => {
      page.content.forEach(item => {
        text += item.str + ' ';
      });
    });
    
    return text.trim();
  } catch (error) {
    throw new Error('Failed to extract text from PDF');
  }
}

async function extractTextFromDOCX(buffer: Uint8Array): Promise<string> {
  try {
    const result = await mammoth.extractRawText({ buffer });
    return result.value.trim();
  } catch (error) {
    throw new Error('Failed to extract text from DOCX');
  }
}