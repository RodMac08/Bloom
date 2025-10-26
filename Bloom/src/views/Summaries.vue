<template>
  <Layout title="Resumen y recomendaciones" :showButton="false" :showSidebar="true" :showBackground="true">
    <div class="p-4 md:p-8 space-y-10">

      <div class="p-4 bg-zinc-800 rounded-lg border border-zinc-700 flex flex-col sm:flex-row justify-between items-center gap-4">
        <h3 class="text-lg font-semibold text-white text-center sm:text-left">Resúmenes de reseñas en audio:</h3>
        <div v-if="loadingAudioSummaries" class="text-sm text-zinc-500">Cargando audios...</div>
        <div v-else-if="!positiveAudioUrl && !negativeAudioUrl" class="text-sm text-zinc-500">Aún no disponibles.</div>
        <div v-else class="flex gap-4">
          <button v-if="positiveAudioUrl" @click="playAudio(positiveAudioUrl)" title="Escuchar resumen positivo" class="p-2 rounded-full bg-green-600 hover:bg-green-500 transition-colors focus:outline-none focus:ring-2 focus:ring-green-400">
             <Icon icon="mdi:thumb-up-outline" class="w-5 h-5 text-white" />
          </button>
          <button v-if="negativeAudioUrl" @click="playAudio(negativeAudioUrl)" title="Escuchar resumen negativo" class="p-2 rounded-full bg-red-600 hover:bg-red-500 transition-colors focus:outline-none focus:ring-2 focus:ring-red-400">
             <Icon icon="mdi:thumb-down-outline" class="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      <div class="p-6 bg-zinc-800 rounded-2xl border border-zinc-700">
        <h2 class="text-2xl font-bold text-white text-center mb-4">📈 Recomendaciones de inventario</h2>
        <div v-if="loadingRecommendations" class="text-center text-zinc-400 py-4">Cargando recomendaciones...</div>
        <div v-else-if="recommendations" class="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div>
            <h3 class="font-semibold text-green-400 mb-2">✅ Priorizar compra (>= 4.0 ★)</h3>
            <ul v-if="recommendations.prioritize_purchase?.length > 0" class="list-none p-0 text-zinc-300 text-sm space-y-1">
              <li v-for="snack in recommendations.prioritize_purchase" :key="snack + '-prio'">{{ snack }}</li>
            </ul>
            <p v-else class="text-zinc-500 text-sm">Ninguno esta semana.</p>
          </div>
          <div>
            <h3 class="font-semibold text-yellow-400 mb-2">🤔 Revisar Stock (3.0-3.9 ★)</h3>
            <ul v-if="recommendations.review_stocking?.length > 0" class="list-none p-0 text-zinc-300 text-sm space-y-1">
              <li v-for="snack in recommendations.review_stocking" :key="snack + '-rev'">{{ snack }}</li>
            </ul>
            <p v-else class="text-zinc-500 text-sm">Ninguno esta semana.</p>
          </div>
          <div>
            <h3 class="font-semibold text-red-400 mb-2">❌ Considerar reemplazo (< 3.0 ★)</h3>
            <ul v-if="recommendations.consider_replacement?.length > 0" class="list-none p-0 text-zinc-300 text-sm space-y-1">
              <li v-for="snack in recommendations.consider_replacement" :key="snack + '-repl'">{{ snack }}</li>
            </ul>
            <p v-else class="text-zinc-500 text-sm">Ninguno esta semana.</p>
          </div>
        </div>
        <div v-else class="text-center text-zinc-400 py-4">No hay recomendaciones disponibles o aún no se han generado.</div>
      </div>

      <div>
        <h2 class="text-2xl font-bold text-white text-center mb-4">Historial de reseñas</h2>
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

        <div v-if="loadingReviews" class="text-center py-10 text-zinc-400">
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
                    :key="star + '-review-' + review.id"
                    icon="mdi:star"
                    :class="[star <= review.rating ? 'text-yellow-400' : 'text-zinc-600']"
                  />
                </div>
                <span class="text-sm text-zinc-400">{{ new Date(review.createdAt).toLocaleDateString() }}</span>
              </div>
              <p class="text-zinc-300">
                {{ review.text }}
              </p>

              <div v-if="review.audio_url" class="mt-3 text-right">
                <button
                  @click="playAudio(review.audio_url)"
                  class="p-2 rounded-full bg-zinc-700 hover:bg-zinc-600 transition-colors focus:outline-none focus:ring-2 focus:ring-[#40ffaa]"
                  aria-label="Escuchar reseña"
                >
                  <Icon icon="mdi:play" class="w-5 h-5 text-[#40ffaa]" />
                </button>
              </div>

            </div>
          </div>
        </div>
        <div v-else class="text-center py-10">
          <p class="text-zinc-400">No hay reseñas que coincidan con este filtro.</p>
        </div>
      </div>

    </div>
  </Layout>
</template>

<script>
import Layout from '../components/Layout.vue';
import { Icon } from '@iconify/vue';
import apiClient from '../services/api';

export default {
  name: 'Summaries',
  components: {
    Layout,
    Icon
  },
  data() {
    return {
      // Estado para reseñas
      currentFilter: 'all',
      filters: [
        { label: 'Todas', value: 'all' },
        { label: 'Positivas', value: 'positive' },
        { label: 'Negativas', value: 'negative' },
      ],
      reviews: [],
      loadingReviews: true,
      // Estado para recomendaciones
      recommendations: null,
      loadingRecommendations: true,
      // Estado para audios de resumen
      positiveAudioUrl: null,
      negativeAudioUrl: null,
      loadingAudioSummaries: true,
      // Estado para controlar audio actual
      currentAudio: null,
    };
  },
  computed: {
    // Lógica de filtro para reseñas
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
  async mounted() {
    // Llamar a todas las funciones al montar
    await this.fetchReviews();
    await this.fetchRecommendations();
    await this.fetchAudioSummaries();
  },
  methods: {
    // Obtener reseñas
    async fetchReviews() {
        this.loadingReviews = true;
        try {
            const response = await apiClient.get('/reviews');
            this.reviews = response.data;
        } catch (error) {
            console.error('Error al cargar las reseñas:', error);
            if (error.response?.status !== 401) {
              alert('Hubo un problema al cargar las reseñas.');
            }
        }
        finally { this.loadingReviews = false; }
    },
    async fetchRecommendations() {
        this.loadingRecommendations = true;
        try {
            const response = await apiClient.get('/inventory/recommendations/latest');
            this.recommendations = response.data;
        } catch (error) {
            if (error.response?.status === 404) {
                console.log("Aún no hay recomendaciones generadas.");
                this.recommendations = null;
            } else if (error.response?.status !== 401) {
                console.error('Error al cargar recomendaciones:', error);
                alert('Hubo un problema al cargar las recomendaciones.');
            }
        } finally {
            this.loadingRecommendations = false;
        }
    },
    async fetchAudioSummaries() {
        this.loadingAudioSummaries = true;
        try {
            const response = await apiClient.get('/business/me/summary-audio');
            this.positiveAudioUrl = response.data.positiveUrl;
            this.negativeAudioUrl = response.data.negativeUrl;
        } catch (error) {
           if (error.response?.status === 404) {
             console.log("No hay audios de resumen generados aún.");
           } else if (error.response?.status !== 401) {
             console.error('Error al cargar audios de resumen:', error);
           }
        } finally {
          this.loadingAudioSummaries = false;
        }
    },
    playAudio(audioUrl) {
      if (this.currentAudio) {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
      }
      const audio = new Audio(audioUrl);
      this.currentAudio = audio;
      audio.play().catch(e => {
          console.error("Error al reproducir audio:", e);
          alert("No se pudo reproducir el audio.");
          this.currentAudio = null;
      });
      audio.onended = () => {
        this.currentAudio = null;
      };
    }
  }
}
</script>
