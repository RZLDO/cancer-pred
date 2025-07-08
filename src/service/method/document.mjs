import fs from 'fs';
import path from 'path';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';

export function generateDocx(data) {
  const templatePath = path.resolve('template/template.docx');
  const content = fs.readFileSync(templatePath, 'binary');

  const zip = new PizZip(content);
  const doc = new Docxtemplater(zip);
  doc.setData(data);

  try {
    doc.render();

    const timestamp = Date.now();
    const filename = `hasil-${timestamp}.docx`;
    const outputDir = path.resolve('document');
    const outputPath = path.join(outputDir, filename);

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }

    const buffer = doc.getZip().generate({ type: 'nodebuffer' });
    fs.writeFileSync(outputPath, buffer);

    console.log(`✅ File berhasil disimpan di: document/${filename}`);
    return path.join('document', filename); // --> document/hasil-1234567890.docx

  } catch (error) {
    console.error('❌ Gagal generate dokumen:', error);
    return null;
  }
}
