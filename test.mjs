import fs from 'fs';
import path from 'path';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';

function generateDocx(data) {
  const content = fs.readFileSync(path.resolve('template.docx'), 'binary');
  const zip = new PizZip(content);
  const doc = new Docxtemplater(zip);

  doc.setData(data);

  try {
    doc.render();
    const buf = doc.getZip().generate({ type: 'nodebuffer' });
    fs.writeFileSync(path.resolve('./output.docx'), buf);
    console.log('✅ Berhasil generate file: output.docx');
  } catch (error) {
    console.error('❌ Error saat render dokumen:', error);
  }
}

// Contoh data input
generateDocx({
  nama: 'Mira Setiawan'
});
