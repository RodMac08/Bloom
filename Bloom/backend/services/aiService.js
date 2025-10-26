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
  const voiceId = "21m00Tcm4TlvDq8ikWAM"; // Rachel

  // --- 👇 VALIDACIÓN DEL TEXTO 👇 ---
  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    console.warn("   Texto de reseña vacío o inválido. Omitiendo generación de audio.");
    // Devolvemos null o lanzamos un error manejable para que la tarea continúe
    return null; 
    // Opcional: throw new Error("Texto de reseña vacío o inválido."); 
  }
  // ---------------------------------

  let stability = 0.5;
  let similarity_boost = 0.75;
  let style_exaggeration = 0.0;
  
  if (rating >= 4) { stability = 0.3; style_exaggeration = 0.7; } 
  else if (rating <= 2) { stability = 0.59; style_exaggeration = 0.1; }

  // --- 👇 LOG ANTES DE LA LLAMADA 👇 ---
  const requestPayload = {
      voice: voiceId,
      text: text.substring(0, 500), // Loguea solo los primeros 500 caracteres
      model_id: "eleven_multilingual_v2", 
       voice_settings: {
         stability: stability,
         similarity_boost: similarity_boost,
         style_exaggeration: style_exaggeration,
         use_speaker_boost: true,
       },
    };
  console.log(`   Enviando a ElevenLabs (Rating: ${rating}):`, JSON.stringify(requestPayload, null, 2));
  // ------------------------------------

  try {
    // Usamos el payload completo en la llamada real
    const audio = await elevenlabs.generate({
        voice: voiceId,
        text: text, // Texto completo aquí
        model_id: "eleven_multilingual_v2",
        voice_settings: requestPayload.voice_settings
    });
    // ... (recolectar chunks) ...
    const chunks = [];
    for await (const chunk of audio) { chunks.push(chunk); }
    const content = Buffer.concat(chunks);
    console.log("   Audio generado exitosamente.");
    return content; 

  } catch (error) {
    console.error("Error al generar audio (ElevenLabs):", error);
    if (error.statusCode === 422) {
       console.error("   >>> Error 422: Verifica el texto enviado (longitud, caracteres) o los límites de tu cuenta ElevenLabs.");
    }
    throw new Error("No se pudo generar el audio de la reseña.");
  }
}

async function generateAggregatedSummary(reviewsArray, sentimentType) {
  const reviewTexts = reviewsArray.map(r => r.text).join('\n - ');
  const prompt = `Analiza el siguiente grupo de reseñas ${sentimentType} de clientes:
---
 - ${reviewTexts}
---
Genera un resumen conciso (máximo 2-3 frases) destacando los temas o puntos clave mencionados repetidamente en este grupo de reseñas ${sentimentType}.`;

  try {
    console.log(`   Generando resumen agregado para reseñas ${sentimentType}...`);
    const resp = await generativeModel.generateContent(prompt);
    const summaryText = resp.response.candidates[0].content.parts[0].text;
    console.log(`   Resumen agregado generado.`);
    return summaryText.trim();
  } catch (error) {
    console.error(`Error al generar resumen agregado (${sentimentType}):`, error);
    throw new Error(`No se pudo generar el resumen agregado ${sentimentType}.`);
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
  generateAggregatedSummary,
};