<template>
  <Layout title="Deja tu reseña" :showButton="false" :showSidebar="true" :showBackground="true">

    <div class="max-w-xl mx-auto text-center">
      <h1 class="text-3xl font-bold text-white mb-2">Comparte tu experiencia</h1>
      <p class="mb-8 text-zinc-400">Tu opinión general y sobre los snacks nos ayuda a mejorar.</p>
    </div>

    <form @submit.prevent="submitFullReview" class="max-w-xl mx-auto space-y-8">

      <fieldset class="space-y-4">
        <legend class="text-xl font-semibold text-white text-center mb-4">Valoración General</legend>
        
        <div class="flex flex-col items-center justify-center">
          <label class="block mb-3 text-lg font-medium text-white">Tu valoración general</label>
          <div class="flex items-center gap-2 text-3xl">
            <button
              v-for="star in 5"
              :key="'general-'+star" 
              type="button"
              @click="generalRating = star"
              @mouseover="generalHoverRating = star"
              @mouseleave="generalHoverRating = 0"
              class="transition-transform duration-200 hover:scale-125"
            >
              <Icon
                icon="mdi:star"
                :class="[(generalHoverRating || generalRating) >= star ? 'text-[#40ffaa]' : 'text-zinc-600', 'transition-colors']"
              />
            </button>
          </div>
        </div>

        <div class="flex flex-col items-center justify-center">
          <label for="reviewText" class="block mb-3 text-lg font-medium text-white">Tu reseña general</label>
          <div class="rounded-lg p-[2px] bg-zinc-600 focus-within:bg-gradient-to-r from-[#4079ff] to-[#40ffaa] transition-colors duration-300 w-full max-w-[500px] md:w-[700px]">
            <textarea
              id="reviewText"
              v-model="reviewText"
              rows="4"
              class="w-full bg-zinc-700 border-none rounded-[6px] px-4 py-2 focus:ring-0 text-white placeholder-zinc-400"
              placeholder="Describe tu experiencia general aquí..."
              required
            ></textarea>
          </div>
        </div>
      </fieldset>

      <hr class="border-zinc-700">

      <fieldset class="space-y-4">
        <legend class="text-xl font-semibold text-white text-center mb-4">Valorar un Snack Específico (Opcional)</legend>

        <div>
          <label for="snackSelect" class="block mb-3 text-lg font-medium text-white text-center">Selecciona el snack</label>
          <select
            id="snackSelect"
            v-model="selectedSnack"
            class="w-full bg-zinc-700 border border-zinc-600 text-white rounded-lg px-4 py-3 focus:ring-[#40ffaa] focus:border-[#40ffaa] text-center appearance-none"
          >
            <option value="">-- Ninguno --</option> <option v-for="snack in availableSnacks" :key="snack" :value="snack">
              {{ snack }}
            </option>
          </select>
        </div>

        <div v-if="selectedSnack" class="flex flex-col items-center justify-center">
          <label class="block mb-3 text-lg font-medium text-white">Valoración para "{{ selectedSnack }}"</label>
          <div class="flex items-center gap-2 text-3xl">
            <button
              v-for="star in 5"
              :key="'snack-'+star" 
              type="button"
              @click="snackRating = star"
              @mouseover="snackHoverRating = star"
              @mouseleave="snackHoverRating = 0"
              class="transition-transform duration-200 hover:scale-125"
            >
              <Icon
                icon="mdi:star"
                :class="[(snackHoverRating || snackRating) >= star ? 'text-[#40ffaa]' : 'text-zinc-600', 'transition-colors']"
              />
            </button>
          </div>
        </div>
      </fieldset>

      <div class="flex justify-center pt-2">
        <button
          type="submit"
          :disabled="isSubmitting || isSent || generalRating === 0 || !reviewText" 
          class="gradient-button relative w-14 h-14 rounded-full flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Transition name="fade-icon" mode="out-in">
            <Icon v-if="isSent" icon="mdi:check" class="w-8 h-8" />
            <Icon v-else-if="isSubmitting" icon="line-md:loading-twotone-loop" class="w-8 h-8" />
            <Icon v-else icon="mdi:send" class="w-7 h-7 text-black" />
          </Transition>
        </button>
      </div>
    </form>

  </Layout>
</template>

<script>
import Layout from '../components/Layout.vue';
import { Icon } from '@iconify/vue';
import apiClient from '../services/api';

export default {
  name: 'Reviews', // Mantenemos el nombre original
  components: {
    Layout,
    Icon,
  },
  data() {
    return {
      // Datos para reseña general
      generalRating: 0,
      generalHoverRating: 0,
      reviewText: '',
      // Datos para valoración de snack
      selectedSnack: '',
      snackRating: 0,
      snackHoverRating: 0,
      // Estado del formulario
      isSubmitting: false,
      isSent: false,
      // Lista de snacks (idealmente vendría del backend)
      availableSnacks: [
        'Galletas Saladas',
        'Barra de Fruta',
        'Mix de Nueces',
        'Chocolate Bar',
        'Pretzels',
        'Opción Vegana X'
      ],
    };
  },
  methods: {
    // Método de envío combinado
    async submitFullReview() {
      // Validación mínima para la reseña general
      if (this.generalRating === 0 || !this.reviewText) {
        alert('Por favor, completa la valoración y la reseña general.');
        return;
      }
      // Validación si se seleccionó un snack pero no se valoró
      if (this.selectedSnack && this.snackRating === 0) {
          alert('Por favor, asigna una valoración al snack seleccionado.');
          return;
      }

      this.isSubmitting = true;

      // Construir el payload con ambos tipos de datos
      const payload = {
        general: {
          rating: this.generalRating,
          text: this.reviewText,
        },
        snack: null, // Por defecto null
      };

      if (this.selectedSnack && this.snackRating > 0) {
        payload.snack = {
          name: this.selectedSnack,
          rating: this.snackRating,
        };
      }

      console.log('Enviando reseña completa:', payload);

      try {
        // LLAMADA AL ENDPOINT COMBINADO (POST /api/reviews)
        const response = await apiClient.post('/reviews', payload); // Usamos la ruta que modificamos

        console.log('Respuesta del servidor:', response.data);

        this.isSent = true;

        // Resetear todo el formulario
        setTimeout(() => {
          this.isSent = false;
          this.generalRating = 0;
          this.reviewText = '';
          this.selectedSnack = '';
          this.snackRating = 0;
          this.generalHoverRating = 0; // También resetear hovers
          this.snackHoverRating = 0;
        }, 2000);

      } catch (error) {
        console.error('Error al enviar la reseña:', error);
        alert('No se pudo enviar la reseña: ' + (error.response?.data?.error || error.message));
      } finally {
        this.isSubmitting = false;
      }
    }
  },
  watch: {
    // Si cambia el snack, resetea solo la valoración del snack
    selectedSnack() {
      this.snackRating = 0;
      this.snackHoverRating = 0;
    }
  }
}
</script>