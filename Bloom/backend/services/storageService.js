// backend/services/storageService.js
const { Storage } = require('@google-cloud/storage');
require('dotenv').config();

const storage = new Storage({
  // projectId y credentials se toman automáticamente si usaste
  // 'gcloud auth application-default login'
});

const bucketName = 'bloom-user-avatars-proyecto';
const bucket = storage.bucket(bucketName);

/**
 * Sube un archivo a Google Cloud Storage.
 * @param {Buffer} buffer El contenido del archivo.
 * @param {string} destination Nombre del archivo en el bucket (ej. 'avatars/user_123.jpg').
 * @returns {Promise<string>} La URL pública del archivo subido.
 */
async function uploadFileToGCS(buffer, destination) {
  const blob = bucket.file(destination);
  const blobStream = blob.createWriteStream({
    resumable: false,
    contentType: 'image/jpeg', // O detecta el tipo mime del archivo original
  });

  return new Promise((resolve, reject) => {
    blobStream.on('error', (err) => reject(err));
    blobStream.on('finish', async () => {
      try {
        const publicUrl = `https://storage.googleapis.com/${bucketName}/${destination}`;
        resolve(publicUrl);
      } catch (error) {
        reject(error);
      }
    });
    blobStream.end(buffer);
  });
}

module.exports = { uploadFileToGCS };