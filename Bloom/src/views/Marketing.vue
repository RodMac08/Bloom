<template>
  <Layout title="Propuestas de marketing" :showButton="false" :showSidebar="true" :showBackground="true">
    <div class="p-4 md:p-8">

      <div v-if="loading" class="text-center py-20">
        <Icon icon="line-md:loading-twotone-loop" class="w-12 h-12 text-zinc-400" />
        <p class="text-zinc-400 mt-4">Generando inspiración...</p>
      </div>

      <div v-else-if="ideas.length === 0" class="justify-center items-center flex flex-col py-20 text-center">
        <Icon icon="line-md:compass-twotone-loop" class="w-12 h-12 text-zinc-400" />
        <p class="text-zinc-400 mt-4">
          Aún no hay propuestas de marketing.<br />
          El sistema generará nuevas ideas basadas en las reseñas de la semana.
        </p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        <SpotlightCard 
          v-for="idea in ideas"
          :key="idea.id"
          class-name="custom-spotlight-card"
          spotlight-color="rgba(64, 255, 170, 0.5)"
          backgroundColor="bg-zinc-800"
          class="overflow-hidden" 
        >
          <div class="flex flex-col w-full h-full justify-between font-bold text-white">
            
            <img :src="idea.image_url" alt="Propuesta de marketing" class="w-full h-48 object-cover">
            
            <div class="p-5 flex flex-col flex-1">
              <div class="flex flex-col gap-2 justify-center items-center text-center mb-4">
                <span class="text-2xl">{{ idea.title }}</span>
              </div>
              
              <div class="flex flex-col gap-2 justify-center items-center text-xl font-normal text-zinc-300 flex-1 mb-4">
                <div class="text-center">{{ idea.content }}</div>
              </div>
              
              <div class="flex flex-col gap-2 justify-center items-center text-center mt-auto">
                <span class="text-xs font-semibold text-[#40ffaa] uppercase tracking-wider">{{ idea.product_name }}</span>
              </div>
            </div>
          </div>   
        </SpotlightCard>

      </div>
    </div>
  </Layout>
</template>

<script>
import Layout from '../components/Layout.vue';
import { Icon } from '@iconify/vue';
import SpotlightCard from '../components/SpotlightCard.vue';
import apiClient from '../services/api'; // 1. Importar nuestro servicio de API

export default {
  name: 'Marketing',
  components: {
    Layout,
    Icon,
    SpotlightCard
  },
  // 2. Añadir 'data' para el estado
  data() {
    return {
      ideas: [], // Array para guardar las ideas de la API
      loading: true, // Estado de carga
    };
  },
  // 3. Hook 'mounted' para llamar a la API al cargar
  async mounted() {
    try {
      const response = await apiClient.get('/marketing');
      this.ideas = response.data; // Guardamos los datos
    } catch (error) {
      console.error('Error al obtener las ideas de marketing:', error);
      alert('No se pudieron cargar las propuestas.');
    } finally {
      this.loading = false; // Ocultamos el mensaje de carga
    }
  }
}
</script>