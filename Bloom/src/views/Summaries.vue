<template>
  <Layout title="Resumen de Reseñas" :showButton="false" :showSidebar="true" :showBackground="true">
    
    <div class="mb-8 flex items-center justify-center gap-4">
      <button
        v-for="filter in filters"
        :key="filter.value"
        @click="currentFilter = filter.value"
        :class="[
          'px-5 py-2 rounded-full font-semibold transition-all duration-300',
          currentFilter === filter.value
            ? 'gradient-button'
            : 'border border-zinc-600 bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:border-zinc-500'
        ]"
      >
        {{ filter.label }}
      </button>
    </div>

    <div v-if="loading" class="text-center py-10 text-zinc-400">
      Cargando reseñas...
    </div>
    
    <div v-else-if="filteredReviews.length > 0" class="space-y-4">
      <div 
        v-for="review in filteredReviews" 
        :key="review.id"
        class="w-full rounded-2xl bg-gradient-to-r from-[#4079ff] to-[#40ffaa] p-[2px] shadow-lg"
      >
        <div class="bg-zinc-800 rounded-[14px] p-5">
          <div class="flex items-start justify-between mb-2">
            <div class="flex items-center text-xl mt-1">
              <Icon
                v-for="star in 5"
                :key="star"
                icon="mdi:star"
                :class="[star <= review.rating ? 'text-yellow-400' : 'text-zinc-600']"
              />
            </div>
            <span class="text-sm text-zinc-400">{{ new Date(review.createdAt).toLocaleDateString() }}</span>
          </div>
          <p class="text-zinc-300">
            {{ review.text }}
          </p>
        </div>
      </div>
    </div>
    
    <div v-else class="text-center py-10">
      <p class="text-zinc-400">No hay reseñas que coincidan con este filtro.</p>
    </div>
  </Layout>
</template>

<script>
import Layout from '../components/Layout.vue';
import { Icon } from '@iconify/vue';
import apiClient from '../services/api'; // 1. Importar nuestro servicio de API

export default {
  name: 'Summaries',
  components: {
    Layout,
    Icon
  },
  data() {
    return {
      currentFilter: 'all',
      filters: [
        { label: 'Todas', value: 'all' },
        { label: 'Positivas', value: 'positive' },
        { label: 'Negativas', value: 'negative' },
      ],
      reviews: [],     // 2. Empezamos con un array vacío
      loading: true,   // 3. Añadimos un estado de carga
    };
  },
  computed: {
    // Esta lógica de filtros no cambia, ¡funcionará con los datos de la API!
    filteredReviews() {
      if (this.currentFilter === 'positive') {
        return this.reviews.filter(review => review.rating >= 4);
      }
      if (this.currentFilter === 'negative') {
        return this.reviews.filter(review => review.rating <= 2);
      }
      return this.reviews;
    }
  },
  // 4. Se ejecuta cuando el componente se carga
  async mounted() {
    try {
      const response = await apiClient.get('/reviews');
      this.reviews = response.data; // Guardamos los datos reales del backend
    } catch (error) {
      console.error('Error al cargar las reseñas:', error);
      alert('Hubo un problema al cargar las reseñas. Intenta iniciar sesión de nuevo.');
    } finally {
      this.loading = false; // Ocultamos el mensaje de "Cargando..."
    }
  }
}
</script>

<style>
/* Aquí va el estilo de .gradient-button que ya tienes */
.gradient-button {
  position: relative;
  z-index: 1;
  background: linear-gradient(to right, #4079ff, #40ffaa);
  color: white;
  transition: all 0.3s ease-in-out;
}
.gradient-button:hover {
  background: white;
  color: #18181b;
}
.gradient-button::before {
  content: '';
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background: linear-gradient(to right, #4079ff, #40ffaa);
  border-radius: inherit;
  z-index: -1;
  padding: 2px;
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
}
.gradient-button:hover::before {
  opacity: 1;
}
</style>