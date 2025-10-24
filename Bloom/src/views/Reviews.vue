<template>
  <Layout title="Deja tu Reseña" :showButton="false" :showSidebar="true" :showBackground="true">
    
    <div class="max-w-xl mx-auto text-center">     
      <p class="text-zinc-300">Tu opinión nos ayuda a mejorar.</p>
      <p class="mb-4 text-zinc-300">Comparte cómo te fue con nuestro servicio.</p>
    </div>

    <form @submit.prevent="submitReview" class="max-w-xl mx-auto space-y-6">
      <div class="flex flex-col items-center justify-center">
        <label class="block mb-3 text-lg font-medium text-white">Tu valoración</label>
        <div class="flex items-center gap-2 text-3xl">
          <button
            v-for="star in 5"
            :key="star"
            type="button"
            @click="rating = star"
            @mouseover="hoverRating = star"
            @mouseleave="hoverRating = 0"
            class="transition-transform duration-200 hover:scale-125"
          >
            <Icon
              icon="mdi:star"
              :class="[(hoverRating || rating) >= star ? 'text-[#40ffaa]' : 'text-zinc-600', 'transition-colors']"
            />
          </button>
        </div>
      </div>
      
      <div class="flex flex-col items-center justify-center">
        <label for="reviewText" class="block mb-3 text-lg font-medium text-white">Tu reseña</label>
        <div class="rounded-lg p-[2px] bg-zinc-600 focus-within:bg-gradient-to-r from-[#4079ff] to-[#40ffaa] transition-colors duration-300">
          <textarea 
            id="reviewText"
            v-model="reviewText"
            rows="4"
            class="w-full max-w-[500px] md:w-[700px] bg-zinc-700 border-none rounded-[6px] px-4 py-2 focus:ring-0 text-white placeholder-zinc-400"
            placeholder="Describe tu experiencia aquí..."
            required
          ></textarea>
        </div>
      </div>

      <div class="flex justify-center pt-2">
        <button 
          type="submit"
          :disabled="isSubmitting || isSent"
          class="gradient-button relative w-14 h-14 rounded-full flex items-center justify-center shadow-lg transform transition-transform duration-300"
        >
          <Transition name="fade-icon" mode="out-in">
            <Icon v-if="isSent" icon="mdi:check" class="w-8 h-8" />
            <Icon v-else-if="isSubmitting" icon="line-md:loading-twotone-loop" class="w-8 h-8" />
            <Icon v-else icon="mdi:plus" class="w-8 h-8 text-black" />
          </Transition>
        </button>
      </div>
    </form>
  </Layout>
</template>

<script>
import Layout from '../components/Layout.vue';
import { Icon } from '@iconify/vue';
import GradientText from '../components/GradientText.vue';
import apiClient from '../services/api';

export default {
  name: 'Reviews',
  components: {
    Layout,
    Icon,
    GradientText
  },
  data() {
    return {
      // Tus datos existentes
      rating: 0,
      hoverRating: 0,
      reviewText: '',
      isSubmitting: false,
      isSent: false,
      // 2. NUEVOS DATOS PARA MOSTRAR RESEÑAS
      reviews: [], // Array para guardar las reseñas de la API
      loading: true, // Para mostrar un mensaje de carga
    };
  },
  methods: {
    // 3. NUEVO MÉTODO PARA OBTENER LAS RESEÑAS
    async fetchReviews() {
      this.loading = true;
      try {
        const response = await apiClient.get('/reviews');
        this.reviews = response.data;
      } catch (error) {
        console.error('Error al obtener las reseñas:', error);
        alert('No se pudieron cargar las reseñas.');
      } finally {
        this.loading = false;
      }
    },
    // 4. MÉTODO DE ENVÍO ACTUALIZADO
    async submitReview() {
      if (this.rating === 0 || !this.reviewText) {
        alert('Por favor, completa la valoración y la reseña.');
        return;
      }
      
      this.isSubmitting = true;

      try {
        // Llamada POST a la API
        const response = await apiClient.post('/reviews', {
          rating: this.rating,
          text: this.reviewText,
        });

        // Añadir la nueva reseña al principio de la lista para verla al instante
        this.reviews.unshift(response.data);
        
        // Lógica de la animación del botón
        this.isSent = true;
        setTimeout(() => {
          this.isSent = false;
          // Resetear el formulario
          this.rating = 0;
          this.reviewText = '';
        }, 2000);

      } catch (error) {
        console.error('Error al enviar la reseña:', error);
        alert('No se pudo enviar la reseña.');
      } finally {
        this.isSubmitting = false;
      }
    }
  },
  // 5. LIFECYCLE HOOK PARA CARGAR DATOS AL INICIO
  mounted() {
    this.fetchReviews();
  }
}
</script>