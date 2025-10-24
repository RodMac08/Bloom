<template>
  <Transition name="fade">
    <div v-if="isOpen" class="fixed inset-0 w-full h-screen z-50">
      <div @click="close" class="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>

      <div class="relative w-full h-full flex items-center justify-center p-4">
        <div class="w-full max-w-lg rounded-2xl bg-gradient-to-r from-[#4079ff] to-[#40ffaa] p-[2px]">
          <div class="w-full h-full bg-zinc-900 rounded-[14px] p-8">
            <form @submit.prevent="handleSubmit" class="space-y-6">
              
              <GradientText
                text="Reportar un Problema"
                :colors="['#4079ff', '#40ffaa', '#4079ff']"
                :animation-speed="5"
                class-name="text-3xl font-bold text-center p-2"
              />

              <div>
                <label for="errorType" class="block mb-2 text-sm font-medium text-zinc-300">Tipo de Error</label>
                <select 
                  id="errorType" 
                  v-model="errorType"
                  class="w-full bg-zinc-700 border border-zinc-600 text-white rounded-lg px-4 py-2 focus:ring-[#40ffaa] focus:border-[#40ffaa]"
                >
                  <option disabled value="">Selecciona una opción</option>
                  <option>Error visual (UI/UX)</option>
                  <option>Problema de funcionamiento</option>
                  <option>Contenido inapropiado</option>
                  <option>Otro</option>
                </select>
              </div>

              <div>
                <label for="description" class="block mb-2 text-sm font-medium text-zinc-300">Descripción</label>
                <div class="rounded-lg p-[2px] bg-zinc-600 focus-within:bg-gradient-to-r from-[#4079ff] to-[#40ffaa] transition-colors duration-300">
                  <textarea 
                    id="description"
                    v-model="description"
                    rows="4"
                    class="w-full bg-zinc-700 border-none rounded-[6px] px-4 py-2 focus:ring-0 text-white placeholder-zinc-400"
                    placeholder="Describe el problema que encontraste..."
                    required
                  ></textarea>
                </div>
              </div>

              <div class="flex justify-end pt-2">
                <button 
                  type="submit"
                  :disabled="isSubmitting || isSent"
                  class="gradient-button relative w-14 h-14 rounded-full flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform duration-300"
                >
                  <Transition name="fade-icon" mode="out-in">
                    <Icon v-if="isSent" icon="mdi:check" class="w-8 h-8" />
                    <Icon v-else-if="isSubmitting" icon="line-md:loading-twotone-loop" class="w-8 h-8" />
                    <Icon v-else icon="mdi:send" class="w-7 h-7 text-black" />
                  </Transition>
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script>
import GradientText from '../components/GradientText.vue';
import { Icon } from '@iconify/vue';

export default {
  name: 'ReportModal',
  components: { GradientText, Icon },
  props: {
    isOpen: {
      type: Boolean,
      required: true
    }
  },
  emits: ['close'],
  data() {
    return {
      errorType: '',
      description: '',
      isSubmitting: false,
      isSent: false,
    }
  },
  methods: {
    close() {
      this.$emit('close');
    },
    handleSubmit() {
      if (!this.errorType || !this.description) {
        alert('Por favor, completa todos los campos.');
        return;
      }
      this.isSubmitting = true;
      console.log('Enviando reporte:', { type: this.errorType, description: this.description });

      setTimeout(() => {
        this.isSubmitting = false;
        this.isSent = true;
        
        setTimeout(() => {
          this.isSent = false;
          this.errorType = '';
          this.description = '';
          this.close(); // Cierra el modal después de enviar
        }, 2000);
      }, 1500);
    }
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
/* Estilos para la transición de los iconos del botón */
.fade-icon-enter-active,
.fade-icon-leave-active {
  transition: opacity 0.3s ease;
}
.fade-icon-enter-from,
.fade-icon-leave-to {
  opacity: 0;
}
</style>