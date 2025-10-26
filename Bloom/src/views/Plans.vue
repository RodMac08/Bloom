<template>
      <Layout title="Planes" :showButton="false" :showSidebar="true" :showBackground="true">
        <div class="flex h-full w-full justify-center items-center gap-10 p-2">
        <SpotlightCard 
            class-name="custom-spotlight-card"
            spotlight-color="rgba(64, 255, 170, 0.5)"
            backgroundColor="bg-zinc-800"
        >
        <div class="flex flex-col h-[400px] justify-around items-center gap-4">
            <GradientText
                text="Bloom"
                :colors="['#4079ff', '#40ffaa', '#4079ff']"
                :animation-speed="5"
                class-name="text-3xl font-bold text-center p-4"
                />      
            <p class="text-white font-bold text-2xl mb-2 text-center">
                Funcionalidades:
            </p>  
            <p class="text-zinc-400 mb-2 text-xl text-center">
                Análisis de reseñas, generación de resúmenes y recomendaciones de inventario.
            </p> 
            <p class="text-zinc-400 mb-2 text-xl text-center">
                Visión por computadora para reconocimiento de productos.
            </p>
            <p class="text-zinc-400 mb-2 text-xl text-center">
                Permite a la empresa a conectar con el cliente mediante las reseñas y mejorar su experiencia.
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