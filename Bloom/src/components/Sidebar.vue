<template>
  <div>
    <aside
      :class="['bg-zinc-900 min-h-screen flex flex-col items-center py-4 shadow-sm transition-all duration-400', expanded ? 'w-56' : 'w-16' ]"
    >
      <button @click="toggleMenu" class="p-2 mb-6 rounded-full focus:outline-none focus:ring-2 focus:ring-white hover:bg-white/20 transition-all duration-200" aria-label="Expandir o contraer menú">
        <Icon 
          icon="ph:caret-double-right-bold" 
          :class="['w-6 h-6 transition-transform duration-400 text-white bg-clip-text', expanded && 'rotate-180']"
        />
      </button>

      <div class="mb-6">
        <img src="../assets/Logo simple.png" alt="logo" class="w-10 h-10" />
      </div>

      <div class="w-full px-4 mb-6">
        <hr class="border-white" />
      </div>
      
      <nav class="flex flex-col gap-2 w-full px-2">
        <router-link
          v-for="item in mainMenu"
          :key="item.link"
          :to="item.link"
          :title="expanded ? undefined : item.label"
          class="gradient-button flex items-center rounded-full text-zinc-900"
        >
          <div class="w-12 h-10 flex items-center justify-center flex-shrink-0">
            <img v-if="item.imageUrl" :src="item.imageUrl" :alt="item.label" class="w-8 h-8 rounded-full object-cover" />
            <Icon v-else :icon="item.icon" class="text-xl" />
          </div>
          <transition name="fade-blur">
            <span v-if="expanded" class="ml-2 font-medium truncate">{{ item.label }}</span>
          </transition>
        </router-link>
      </nav>

      <div class="flex flex-col gap-2 w-full mt-auto mb-2 px-2">
        <template v-for="item in footerMenu" :key="item.label">
          <router-link
            v-if="item.link"
            :to="item.link"
            :title="expanded ? undefined : item.label"
            class="gradient-button flex items-center rounded-full text-zinc-900"
          >
            <div class="w-12 h-10 flex items-center justify-center flex-shrink-0">
              <img v-if="item.imageUrl" :src="item.imageUrl" :alt="item.label" class="w-8 h-8 rounded-full object-cover" />
              <Icon v-else :icon="item.icon" class="text-xl" />
            </div>
            <transition name="fade-blur">
              <span v-if="expanded" class="ml-2 font-medium truncate">{{ item.label }}</span>
            </transition>
          </router-link>
          
          <button
            v-else-if="item.action"
            @click="handleAction(item.action)"
            :title="expanded ? undefined : item.label"
            class="gradient-button flex items-center rounded-full text-zinc-900 w-full"
          >
            <div class="w-12 h-10 flex items-center justify-center flex-shrink-0">
              <Icon :icon="item.icon" class="text-xl" />
            </div>
            <transition name="fade-blur">
              <span v-if="expanded" class="ml-2 font-medium truncate">{{ item.label }}</span>
            </transition>
          </button>
        </template>
      </div>
    </aside>

    <ReportModal :isOpen="isReportModalOpen" @close="closeReportModal" />
  </div>
</template>

<script>
import { Icon } from '@iconify/vue';
import ReportModal from '../views/Report.vue'; 
import { mapState } from 'pinia';        
import { useAuthStore } from '../stores/auth'; 

export default {
  name: "Sidebar",
  components: { Icon, ReportModal },
  data() {
    return {
      expanded: false,
      isReportModalOpen: false, 
      mainMenu: [
        { icon: "line-md:star-twotone", label: "Registrar Reseña", link: "/Reviews" },
        { icon: "line-md:text-box-multiple", label: "Resumenes", link: "/Summaries" },
        { icon: "line-md:link", label: "Marketing", link: "/Marketing" },
      ],
      // Base del menú del footer (sin la cuenta)
      footerMenuBase: [ 
        { icon: "line-md:person-search-twotone", label: "Acerca de", link: "/about" },
        { icon: "line-md:alert-circle-twotone-loop", label: "Reportar", action: 'openReportModal' }, 
        { icon: "line-md:log-in", label: "Cerrar sesión", action: 'logout' }, // Cambiado a acción
      ]
    };
  },
  computed: {
    // Mapea el estado 'user' del store a this.user
    ...mapState(useAuthStore, ['user']),

    // Construye dinámicamente el menú del footer completo
    footerMenu() {
      const menu = [];
      // Solo añade el item de cuenta si el usuario está cargado
      if (this.user) {
        menu.push({
          label: this.user.name, 
          link: "/account", 
          // Usa la imagen del usuario o una imagen por defecto
          imageUrl: this.user.profile_image_url || 'https://via.placeholder.com/150' 
        });
      }
      // Concatena con el resto de los items
      return menu.concat(this.footerMenuBase);
    }
  },
  methods: {
    toggleMenu() {
      this.expanded = !this.expanded;
    },
    openReportModal() {
      this.isReportModalOpen = true;
    },
    closeReportModal() {
      this.isReportModalOpen = false;
    },
    // Método para cerrar sesión llamando al store
    logout() {
      const authStore = useAuthStore();
      authStore.logout();
    },
    // Manejador genérico para las acciones
    handleAction(actionName) {
      if (typeof this[actionName] === 'function') {
        this[actionName]();
      } else {
        console.warn(`Action "${actionName}" not found.`);
      }
    }
  }
};
</script>

<style scoped>
/* Tus estilos no necesitan cambios */
.fade-blur-enter-active,
.fade-leave-active {
  transition: all 0.4s ease-in-out;
}
.fade-blur-enter-from,
.fade-leave-to {
  opacity: 0;
  filter: blur(5px);
  transform: translateX(-20px);
}
.fade-blur-enter-to,
.fade-blur-leave-from {
  opacity: 1;
  filter: blur(0);
  transform: translateX(0);
}
</style>