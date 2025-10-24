<template>
  <Layout title="Configuración de la cuenta" :showButton="false" :showSidebar="true" :showBackground="true">
    <div class="p-4 md:p-8 space-y-10">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-1 h-full">
          <div class="rounded-2xl bg-gradient-to-r from-[#4079ff] to-[#40ffaa] p-[2px] h-full">
            <div class="bg-zinc-800 p-6 rounded-[14px] h-full text-center items-center flex flex-col gap-4">
              <h3 class="text-xl font-bold text-white mb-4">Foto de perfil</h3>
              <div class="relative w-32 h-32 mx-auto mb-4">
                <img :src="user?.profile_image_url || 'https://i.pravatar.cc/150?img=5'" alt="Foto de perfil" class="w-full h-full rounded-full object-cover">
                <button @click="openFilePicker" class="absolute bottom-0 right-0 bg-zinc-800 p-2 rounded-full hover:bg-white transition-colors group border border-zinc-700">
                  <Icon icon="mdi:pencil" class="text-white w-5 h-5 transition-colors group-hover:text-zinc-800" />
                </button>
                <input
                  type="file"
                  ref="fileInput"
                  @change="handleFileChange"
                  accept="image/*"
                  class="hidden"
                />
              </div>
              <p v-if="user" class="text-white font-semibold">{{ user.name }}</p>
              <p v-if="user" class="text-zinc-400 text-sm">{{ user.email }}</p>
            </div>
          </div>
        </div>
        <div class="lg:col-span-2">
          <div class="rounded-2xl bg-gradient-to-r from-[#4079ff] to-[#40ffaa] p-[2px]">
            <div class="bg-zinc-800 p-6 rounded-[14px]">
              <h3 class="text-xl font-bold text-white mb-6">Información general</h3>
              <form @submit.prevent="updateProfile" class="space-y-4">
                <div>
                  <label for="name" class="block mb-2 text-sm font-medium text-zinc-300">Nombre completo</label>
                  <div class="rounded-lg p-[2px] bg-zinc-600 focus-within:bg-gradient-to-r from-[#4079ff] to-[#40ffaa] transition-colors duration-300">
                    <input type="text" id="name" v-model="form.name" class="w-full bg-zinc-700 border-none rounded-[6px] px-4 py-2 focus:ring-0 text-white placeholder-zinc-400">
                  </div>
                </div>
                <div>
                  <label for="email" class="block mb-2 text-sm font-medium text-zinc-300">Correo electrónico</label>
                  <div class="rounded-lg p-[2px] bg-zinc-600">
                    <input type="email" id="email" v-model="form.email" class="w-full bg-zinc-700 border-none rounded-[6px] px-4 py-2 focus:ring-0 text-white placeholder-zinc-400" disabled>
                  </div>
                </div>
                <div class="flex justify-end pt-2">
                  <button type="submit" class="gradient-button py-2 px-5 rounded-lg font-semibold">
                    Guardar cambios
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div class="rounded-2xl bg-gradient-to-r from-[#4079ff] to-[#40ffaa] p-[2px]">
        <div class="bg-zinc-800 p-6 rounded-[14px]">
          <h3 class="text-xl font-bold text-white mb-6">Cambiar contraseña</h3>
          <form @submit.prevent="changePassword" class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="md:col-span-2">
              <label for="currentPassword" class="block mb-2 text-sm font-medium text-zinc-300">Contraseña actual</label>
               <div class="rounded-lg p-[2px] bg-zinc-600 focus-within:bg-gradient-to-r from-[#4079ff] to-[#40ffaa] transition-colors duration-300">
                <input type="password" id="currentPassword" v-model="passwordForm.current" class="w-full bg-zinc-700 border-none rounded-[6px] px-4 py-2 focus:ring-0 text-white">
              </div>
            </div>
            <div>
              <label for="newPassword" class="block mb-2 text-sm font-medium text-zinc-300">Nueva contraseña</label>
               <div class="rounded-lg p-[2px] bg-zinc-600 focus-within:bg-gradient-to-r from-[#4079ff] to-[#40ffaa] transition-colors duration-300">
                <input type="password" id="newPassword" v-model="passwordForm.new" class="w-full bg-zinc-700 border-none rounded-[6px] px-4 py-2 focus:ring-0 text-white">
              </div>
            </div>
            <div>
              <label for="confirmPassword" class="block mb-2 text-sm font-medium text-zinc-300">Confirmar nueva contraseña</label>
               <div class="rounded-lg p-[2px] bg-zinc-600 focus-within:bg-gradient-to-r from-[#4079ff] to-[#40ffaa] transition-colors duration-300">
                <input type="password" id="confirmPassword" v-model="passwordForm.confirm" class="w-full bg-zinc-700 border-none rounded-[6px] px-4 py-2 focus:ring-0 text-white">
              </div>
            </div>
            <div class="md:col-span-2 flex justify-end">
              <button type="submit" class="gradient-button py-2 px-5 rounded-lg font-semibold">
                Actualizar contraseña
              </button>
            </div>
          </form>
        </div>
      </div>
      <div class="bg-zinc-800 p-6 rounded-2xl border border-red-500">
        <h3 class="text-xl font-bold text-red-500 mb-2">Zona de peligro</h3>
        <p class="text-zinc-400 mb-4">Una vez que elimines tu cuenta, no hay vuelta atrás. Por favor, ten la certeza.</p>
        <button @click="deleteAccount" class="bg-red-600 text-white py-2 px-5 rounded-lg font-semibold hover:bg-white hover:text-red-600 border border-red-600 transition-all duration-300">
          Eliminar mi cuenta
        </button>
      </div>
      <div class="rounded-2xl bg-gradient-to-r from-[#4079ff] to-[#40ffaa] p-[2px] h-full">
        <div class="bg-zinc-800 p-6 rounded-2xl">
        <h3 class="text-xl font-bold text-white mb-2">Planes</h3>
        <p class="text-zinc-400 mb-4">Revisa los planes disponibles que tenemos para tu empresa.</p>
        <router-link to="/plans" class="gradient-button py-2 px-5 rounded-lg font-semibold inline-block text-center">
            Revisar planes
        </router-link>
      </div>
      </div>
    </div>
  </Layout>
</template>

<script>
import Layout from '../components/Layout.vue';
import { Icon } from '@iconify/vue';
import { mapState } from 'pinia';
import { ref } from 'vue'; // ref se usa dentro de setup
import { useAuthStore } from '../stores/auth';
import apiClient from '../services/api'; // Importa apiClient

export default {
  name: "Account",
  components: {
    Layout,
    Icon
  },
  data() {
    return {
      form: {
        name: '',
        email: '',
      },
      passwordForm: {
        current: '',
        new: '',
        confirm: ''
      },
      isUpdatingProfile: false,
    };
  },
  computed: {
    ...mapState(useAuthStore, ['user'])
  },
  watch: {
    user(newUser) {
      if (newUser) {
        this.form.name = newUser.name;
        this.form.email = newUser.email;
      }
    }
  },
  created() {
    const authStore = useAuthStore();
    if (authStore.user) {
      this.form.name = authStore.user.name;
      this.form.email = authStore.user.email;
    }
  },
  setup() {
    const fileInput = ref(null); // Referencia al input

    // Método para abrir el selector
    const openFilePicker = () => {
      fileInput.value?.click();
    };

    // Retornamos para que la plantilla pueda usarlos
    return { fileInput, openFilePicker };
  },
  methods: {
    // Método para manejar el cambio de archivo (MOVIDO AQUÍ)
    async handleFileChange(event) {
      const file = event.target.files?.[0];
      if (!file) return;

      console.log("Archivo seleccionado:", file);
      // Obtenemos el store DENTRO del método
      const authStore = useAuthStore();
      try {
        await authStore.uploadAvatar(file);
        alert('Foto de perfil actualizada con éxito!');
      } catch (error) {
        alert('Error al subir la foto: ' + (error.response?.data?.error || error.message));
      } finally {
        // Limpiar el input usando $refs
        if (this.$refs.fileInput) {
           this.$refs.fileInput.value = '';
        }
      }
    },
    // Tus otros métodos
    async updateProfile() {
      if (!this.form.name.trim()) {
        alert('El nombre no puede estar vacío.');
        return;
      }
      this.isUpdatingProfile = true; // Deshabilita el botón (opcional)
      const authStore = useAuthStore(); // Obtiene la instancia del store

      try {
        // Llama al endpoint PUT /users/me
        const response = await apiClient.put('/users/me', {
          name: this.form.name.trim() // Envía solo el nombre
        });

        // Actualiza el estado global en Pinia con la respuesta del backend
        authStore.user = response.data;

        alert('Perfil actualizado con éxito.');

      } catch (error) {
        console.error('Error al actualizar el perfil:', error);
        alert('No se pudo actualizar el perfil: ' + (error.response?.data?.error || error.message));
        // Opcional: Revertir el cambio en el formulario si falló
        // this.form.name = authStore.user?.name || '';
      } finally {
        this.isUpdatingProfile = false; // Rehabilita el botón
      }
    },
    // --- MÉTODO changePassword ACTUALIZADO ---
  async changePassword() {
    // 1. Validaciones básicas en el frontend
    if (!this.passwordForm.current || !this.passwordForm.new || !this.passwordForm.confirm) {
      alert('Por favor, completa todos los campos de contraseña.');
      return;
    }
    if (this.passwordForm.new !== this.passwordForm.confirm) {
      alert('Las nuevas contraseñas no coinciden.');
      return;
    }
    // Opcional: Añadir validación de longitud/complejidad para la nueva contraseña

    // 2. Estado de carga (opcional)
    // this.isChangingPassword = true; // Necesitarías añadir 'isChangingPassword: false' en data()

    try {
      // 3. Llamada a la API
      const response = await apiClient.put('/users/me/password', {
        current: this.passwordForm.current,
        new: this.passwordForm.new,
        // No necesitamos enviar 'confirm', el backend confía en la validación del frontend
      });

      // 4. Manejo de éxito
      alert(response.data.message || 'Contraseña actualizada correctamente.'); // Muestra mensaje del backend
      // Limpiar el formulario
      this.passwordForm.current = '';
      this.passwordForm.new = '';
      this.passwordForm.confirm = '';

    } catch (error) {
      // 5. Manejo de errores
      console.error('Error al cambiar la contraseña:', error);
      alert('No se pudo cambiar la contraseña: ' + (error.response?.data?.error || error.message));
    } finally {
      // this.isChangingPassword = false; // Desactiva el estado de carga
    }
    },
    deleteAccount() {
      if (confirm('¿Estás absolutamente seguro? Esta acción no se puede deshacer.')) {
        console.log('Eliminando cuenta...');
        alert('Cuenta eliminada (simulación).');
      }
    }
  }
};
</script>