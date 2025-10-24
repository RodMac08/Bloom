<template>
      <Layout title="Planes" :showButton="false" :showSidebar="true" :showBackground="true">
        <div class="grid grid-cols-3 h-full w-full justify-center items-center gap-10 p-2">
        <SpotlightCard 
            class-name="custom-spotlight-card"
            spotlight-color="rgba(64, 255, 170, 0.5)"
            backgroundColor="bg-zinc-800"
        >
        <div class="flex flex-col h-[400px] justify-around items-center gap-4">
            <GradientText
                text="Bloom seed"
                :colors="['#4079ff', '#40ffaa', '#4079ff']"
                :animation-speed="5"
                class-name="text-3xl font-bold text-center p-4"
                />      
            <p class="text-white font-bold text-xl mb-4 text-center">
                Funcionalidades:
            </p>  
            <p class="text-zinc-400 mb-4 text-center">
                Análisis limitado: Un número de reseñas que pueden procesar al mes.
            </p> 
            <p class="text-zinc-400 mb-4 text-center">
                Resumen básico: Solo genera el resumen de puntos fuertes y débiles.
            </p>
            <p class="text-zinc-400 mb-4 text-center">
                Funcionalidad principal: Permite a los negocios probar la herramienta y ver el valor de transformar una reseña en un dato útil.
            </p>
        </div>
        </SpotlightCard>

        <SpotlightCard 
            class-name="custom-spotlight-card"
            spotlight-color="rgba(64, 255, 170, 0.5)"
            backgroundColor="bg-zinc-800"
        >
        <div class="flex flex-col h-[400px] justify-around items-center gap-4">
            <GradientText
                text="Bloom flourish"
                :colors="['#4079ff', '#40ffaa', '#4079ff']"
                :animation-speed="5"
                class-name="text-3xl font-bold text-center p-4"
                /> 
                <p class="text-white font-bold text-xl mb-4 text-center">
                Funcionalidades:
            </p>  
            <p class="text-zinc-400 mb-4 text-center">
                Análisis ilimitado: Permite analizar cientos o miles de reseñas al mes.            
            </p> 
            <p class="text-zinc-400 mb-4 text-center">
                Generación de ideas: Habilita la función central de generar ideas de marketing y sugerencias de mejora.
            </p>
            <p class="text-zinc-400 mb-4 text-center">
                Historial de análisis: Almacena los análisis anteriores para que el negocio pueda ver su progreso.
            </p>
        </div>
        </SpotlightCard>

        <SpotlightCard 
            class-name="custom-spotlight-card"
            spotlight-color="rgba(64, 255, 170, 0.5)"
            backgroundColor="bg-zinc-800"
        >
        <div class="flex flex-col h-[400px] justify-around items-center">
            <GradientText
                text="Bloom orchard"
                :colors="['#4079ff', '#40ffaa', '#4079ff']"
                :animation-speed="5"
                class-name="text-3xl font-bold text-center p-4"
                /> 
            <p class="text-white font-bold text-xl mb-4 text-center">
                Funcionalidades:
            </p>  
            <p class="text-zinc-400 mb-4 text-center">
                Incluye todas las funcionalidades del nivel flourish.
            </p> 
            <p class="text-zinc-400 mb-4 text-center">
                Usuarios múltiples: Permite a varios miembros del equipo del negocio acceder a la cuenta.
            </p>
            <p class="text-zinc-400 mb-4 text-center">
                Reportes más detallados: Ofrece reportes más extensos y personalizados.
            </p>
        </div>
        </SpotlightCard>

        </div>
      </Layout>
</template>

<script>
import GradientText from '../components/GradientText.vue';
import Layout from '../components/Layout.vue';
import SpotlightCard from '../components/SpotlightCard.vue';

export default {
  name: "Plans",
  components: {
    Layout,
    SpotlightCard,
    GradientText
  }
};
</script>