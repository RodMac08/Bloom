<template>
  <RouterView />
</template>

<script>
import { RouterView } from 'vue-router';
import { onMounted } from 'vue';
import { useAuthStore } from './stores/auth';

export default {
  name: 'App', 
  components: {
    RouterView
  },
  setup() {
    const authStore = useAuthStore();

    onMounted(() => {
      authStore.fetchUser(); 
    });

  }
}
</script>