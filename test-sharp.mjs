import sharp from 'sharp';
const extractTextFromImage = async () => {
    try {
        await sharp('upload/image.png')
        .resize(1000) // perbesar (jika resolusi rendah)
        .grayscale() // ubah jadi abu-abu
        .toFile('upload/ktp_Image_cleaned.png');
  
    } catch (error) {
      console.error('❌ OCR Error:', error);
    }
  };

extractTextFromImage();