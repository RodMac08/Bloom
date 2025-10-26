// backend/services/aiService.js
const { VertexAI } = require('@google-cloud/vertexai');
require('dotenv').config();
const { ElevenLabsClient } = require("elevenlabs");

const vertex_ai = new VertexAI({
  project: 'bloom-475315', 
  location: 'us-central1',
});
const generativeModel = vertex_ai.getGenerativeModel({ model: 'gemini-2.0-flash-lite' });
const imageModel = vertex_ai.getGenerativeModel({ model: 'imagegeneration@005' });
const elevenlabs = new ElevenLabsClient({ apiKey: process.env.ELEVENLABS_API_KEY });
// Uso de la api de Gemini para generar recomendaciones de inventario, challenge
async function generateInventoryRecommendations(snackRatings) {
  let ratingDataString = "Datos de valoración promedio de snacks (escala 1-5 estrellas):\n";
  for (const snackName in snackRatings) {
    ratingDataString += `- ${snackName}: ${snackRatings[snackName]} estrellas\n`;
  }
  const prompt = `
Eres un asistente de optimización de inventario para gategroup...
${ratingDataString}
Basándote en las valoraciones promedio...
Devuelve tu recomendación ÚNICAMENTE como un objeto JSON...`;

  try {
    const resp = await generativeModel.generateContent(prompt);
    let rawResponse = resp.response.candidates[0].content.parts[0].text;
    const jsonMatch = rawResponse.match(/```json\s*([\s\S]*?)\s*```/);
    let jsonString;
    if (jsonMatch && jsonMatch[1]) {
      jsonString = jsonMatch[1].trim();
    } else {
      jsonString = rawResponse.trim();
    }
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Error al generar recomendación de inventario (Gemini):", error);
    if (typeof resp !== 'undefined' && resp?.response?.candidates?.[0]?.content?.parts?.[0]?.text) {
       console.error("Respuesta cruda de la IA:", resp.response.candidates[0].content.parts[0].text);
    }
    throw new Error("No se pudo generar la recomendación de inventario.");
  }
}
// funcion para el Challenge ElevenLabs
async function generateReviewAudio(text, rating) {
  const voiceId = "21m00Tcm4TlvDq8ikWAM";
  let stability = 0.5, similarity_boost = 0.75, style_exaggeration = 0.0;
  if (rating >= 4) { stability = 0.3; style_exaggeration = 0.7; }
  else if (rating <= 2) { stability = 0.59; style_exaggeration = 0.1; }

  try {
    console.log(`   Generando audio para reseña (Rating: ${rating})...`);
    const audio = await elevenlabs.generate({ /* ... config ... */ });
    const chunks = [];
    for await (const chunk of audio) { chunks.push(chunk); }
    const content = Buffer.concat(chunks);
    console.log("   Audio generado exitosamente.");
    return content;
  } catch (error) {
    console.error("Error al generar audio (ElevenLabs):", error);
    throw new Error("No se pudo generar el audio de la reseña.");
  }
}

async function generateMarketingTextIdea(reviewsText, productName) {
  const prompt = `Analiza estas reseñas POSITIVAS de clientes sobre "${productName}": "${reviewsText}".
  Genera UNA idea concisa para una publicación en redes sociales (Instagram/Facebook).
  Devuelve SOLAMENTE un objeto JSON con este formato exacto: {"title": "Título Atractivo", "content": "Texto corto y llamativo para la publicación.", "product_name": "${productName}"}.
  NO incluyas explicaciones ni markdown.`;

  let resp; 
  try {
    resp = await generativeModel.generateContent(prompt);
    let rawResponse = resp.response.candidates[0].content.parts[0].text;

    const jsonMatch = rawResponse.match(/```json\s*([\s\S]*?)\s*```/);
    let jsonString;
    if (jsonMatch && jsonMatch[1]) {
      jsonString = jsonMatch[1].trim();
    } else {
      jsonString = rawResponse.trim();
       if (jsonString.startsWith('```')) jsonString = jsonString.slice(3).trim();
       if (jsonString.endsWith('```')) jsonString = jsonString.slice(0, -3).trim();
    }

    return JSON.parse(jsonString);

  } catch (error) {
    console.error("Error al generar idea de marketing (Gemini):", error);
    if (typeof resp !== 'undefined' && resp?.response?.candidates?.[0]?.content?.parts?.[0]?.text) {
       console.error("Respuesta cruda de la IA:", resp.response.candidates[0].content.parts[0].text);
    }
    throw new Error("No se pudo generar o parsear la idea de marketing.");
  }
}

module.exports = {
  generateInventoryRecommendations,
  generateReviewAudio,
  generateMarketingTextIdea,
};