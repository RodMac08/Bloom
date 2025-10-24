// backend/services/aiService.js
const { VertexAI } = require('@google-cloud/vertexai');

// INICIALIZACIÓN
const vertex_ai = new VertexAI({
  project: 'bloom-475315', // Tu ID de proyecto
  location: 'us-central1',
});

// Modelo de Texto (usando el modelo que encontraste)
const generativeModel = vertex_ai.getGenerativeModel({
  model: 'gemini-2.0-flash-lite-001',
});

// Modelo de Imagen (Imagen 2)
const imageModel = vertex_ai.getGenerativeModel({
  model: 'imagegeneration@005',
});

// FUNCIÓN 1: Genera la oferta con Gemini (MODIFICADA)
async function generatePromoIdea(reviewsText, productName) {
  // Se añaden instrucciones más explícitas para evitar el formato Markdown
  const prompt = `Analiza estas reseñas positivas de clientes sobre "${productName}": "${reviewsText}".
  Genera una idea para una promoción semanal simple.
  Devuélveme SOLAMENTE el objeto JSON con este formato exacto: {"promo_name": "Nombre Creativo", "offer_text": "Texto de la Oferta", "day": "Día de la Semana"}. NO incluyas ninguna explicación ni formato markdown.`;

  try {
    const resp = await generativeModel.generateContent(prompt);
    const rawResponse = resp.response.candidates[0].content.parts[0].text;

    // --- LÓGICA PARA EXTRAER EL JSON DE FORMA SEGURA ---
    // Busca el inicio y el fin del bloque JSON dentro de ```json ... ```
    const jsonMatch = rawResponse.match(/```json\s*([\s\S]*?)\s*```/);
    let jsonString;

    if (jsonMatch && jsonMatch[1]) {
      // Si encuentra el bloque Markdown, extrae solo el contenido
      jsonString = jsonMatch[1].trim();
    } else {
      // Si no hay bloque Markdown, intenta limpiar la respuesta directamente
      jsonString = rawResponse.trim();
    }
    // ----------------------------------------------------

    return JSON.parse(jsonString); // Ahora parsea la cadena limpia

  } catch (error) {
    console.error("Error al generar o parsear la idea (Gemini):", error);
    // Loguea la respuesta cruda si falla el parseo para facilitar la depuración
    if (resp) {
       console.error("Respuesta cruda de la IA que causó el error:", resp.response.candidates[0].content.parts[0].text);
    }
    throw new Error("No se pudo generar o parsear la idea de promoción.");
  }
}

// FUNCIÓN 2: Genera la imagen con Imagen 2 (sin cambios)
async function generatePromoImage(promoDetails, productName) {
  const prompt = `Crea un gráfico publicitario para redes sociales, estilo moderno y limpio. La imagen principal debe ser un "${productName}" delicioso.
  Superpón este texto grande: "${promoDetails.offer_text}".
  Debajo, más pequeño, añade: "${promoDetails.day}".`;

  try {
    const resp = await imageModel.generateContent({
      prompt: prompt,
      number_of_images_to_generate: 1
    });

    const imageData = resp.response.predictions[0];
    // Devolvemos la imagen en formato base64
    return `data:image/png;base64,${imageData.bytesBase64Encoded}`;
  } catch (error) {
    console.error("Error al generar imagen (Imagen 2):", error);
    throw error;
  }
}

module.exports = { generatePromoIdea, generatePromoImage };