<template>
  <RouterView />
</template>

<script>
import { RouterView } from 'vue-router';
import { onMounted } from 'vue';
import { useAuthStore } from './stores/auth';

export default {
  name: 'App', // Es buena práctica nombrar tus componentes
  components: {
    RouterView
  },
  // La función setup() es donde usas Composition API dentro de Options API
  setup() {
    // 1. Obtienes el store DENTRO de setup()
    const authStore = useAuthStore();

    // 2. Registras el hook onMounted DENTRO de setup()
    onMounted(() => {
      authStore.fetchUser(); // Llama a la acción para cargar el usuario
    });

    // setup() no necesita retornar nada en este caso, 
    // ya que solo estamos ejecutando lógica al montar.
  }
}
</script>