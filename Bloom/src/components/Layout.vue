<template>
  <div class="flex max-h-screen w-full">
    <Sidebar v-if="showSidebar" />
    <div class="flex flex-col flex-1 py-3 px-3">
      <Header :title="title" :showButton="showButton" />
      <main class="flex-1 p-8 bg-zinc-900 overflow-y-auto rounded-b-xl shadow-lg">
        <slot />
      </main>
    </div>
  </div>
</template>

<script>
import Sidebar from "./Sidebar.vue";
import Header from "./Header.vue";

export default {
  name: "Layout",
  components: { Sidebar, Header },
  props: {
    title: { type: String, default: "Título por defecto" },
    showButton: { type: Boolean, default: true },
    showSidebar: { type: Boolean, default: true },
    showBackground: { type: Boolean, default: true }
  },
  watch: {
    showBackground: {
      handler(newValue) {
        this.updateBodyBackground(newValue);
      },
      immediate: true 
    }
  },
  unmounted() {
    document.body.classList.remove('bg-gray-200');
  },
  methods: {
    updateBodyBackground(shouldShow) {
      if (shouldShow) {
        document.body.classList.add('bg-zinc-800');
      } else {
        document.body.classList.remove('bg-zinc-800');
      }
    }
  }
}
</script>