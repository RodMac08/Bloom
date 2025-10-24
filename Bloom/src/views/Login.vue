<template>
  <div class="flex flex-col justify-center items-center w-screen h-screen bg-zinc-900 gap-4 p-4 font-sans">
    <GradientText
      text="Bienvenido a Bloom"
      :colors="['#4079ff', '#40ffaa', '#4079ff']"
      :animation-speed="5"
      class-name="text-4xl md:text-6xl font-bold text-center p-4"
    />    

    <img src="../assets/Logo simple.png" alt="" class="w-32 h-32" />

    <div class="w-full max-w-md rounded-2xl bg-gradient-to-r from-[#4079ff] to-[#40ffaa] p-[2px] shadow-lg">
      <div class="p-8 space-y-6 w-full h-full bg-zinc-800 rounded-[14px]">
        
        <h1 class="text-3xl font-bold text-center text-white">
          {{ isLogin ? 'Iniciar Sesión' : 'Crear Cuenta' }}
        </h1>

        <form @submit.prevent="handleSubmit" class="space-y-5">
          
          <Transition name="fade">
            <div v-if="!isLogin">
              <label for="name" class="block mb-2 text-sm font-medium text-zinc-300">
                Nombre
              </label>
              <!-- Input con Borde de Gradiente en Focus -->
              <div class="rounded-lg p-[2px] bg-zinc-600 focus-within:bg-gradient-to-r from-[#4079ff] to-[#40ffaa] transition-colors duration-300">
                <input 
                  type="text" 
                  id="name" 
                  v-model="registerData.name"
                  class="w-full bg-zinc-700 border-none rounded-[6px] px-4 py-2 focus:ring-0 text-white placeholder-zinc-400"
                  placeholder="Tu nombre completo"
                  required 
                />
              </div>
            </div>
          </Transition>

          <div>
            <label for="email" class="block mb-2 text-sm font-medium text-zinc-300">
              Correo Electrónico
            </label>
            <div class="rounded-lg p-[2px] bg-zinc-600 focus-within:bg-gradient-to-r from-[#4079ff] to-[#40ffaa] transition-colors duration-300">
              <input 
                type="email" 
                id="email" 
                v-model="formData.email"
                class="w-full bg-zinc-700 border-none rounded-[6px] px-4 py-2 focus:ring-0 text-white placeholder-zinc-400"
                placeholder="tu@correo.com"
                required 
              />
            </div>
          </div>

          <div>
            <label for="password" class="block mb-2 text-sm font-medium text-zinc-300">
              Contraseña
            </label>
            <div class="rounded-lg p-[2px] bg-zinc-600 focus-within:bg-gradient-to-r from-[#4079ff] to-[#40ffaa] transition-colors duration-300">
              <input 
                type="password" 
                id="password" 
                v-model="formData.password"
                class="w-full bg-zinc-700 border-none rounded-[6px] px-4 py-2 focus:ring-0 text-white placeholder-zinc-400"
                placeholder="••••••••"
                required 
              />
            </div>
          </div>
          
          <!-- Botón con Gradiente y Hover Especial -->
          <div class="pt-2">
            <button 
              type="submit"
              class="gradient-button w-full py-3 font-semibold rounded-lg"
            >
              {{ isLogin ? 'Ingresar' : 'Crear Cuenta' }}
            </button>
          </div>
        </form>

        <p class="text-center text-sm text-zinc-400">
          {{ isLogin ? '¿No tienes una cuenta?' : '¿Ya tienes una cuenta?' }}
          <button @click="toggleFormMode" class="font-medium text-[#4079ff] hover:text-[#40ffaa] transition-colors duration-300">
            {{ isLogin ? 'Regístrate' : 'Inicia Sesión' }}
          </button>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import GradientText from "../components/GradientText.vue";
import { useAuthStore } from '../stores/auth'; // Importamos el store de Pinia

const authStore = useAuthStore(); // Instanciamos el store

// --- Tus variables reactivas no cambian ---
const formMode = ref<'login' | 'register'>('login');
const isLogin = computed(() => formMode.value === 'login');

const registerData = reactive({
  businessName: '',
  name: '',
  email: '',
  password: '',
});

const loginData = reactive({ email: '', password: '' });

// El formData sigue igual
const formData = computed(() => isLogin.value ? loginData : registerData);

const toggleFormMode = () => {
  formMode.value = isLogin.value ? 'register' : 'login';
};

// --- handleSubmit ahora usa las acciones del store ---
const handleSubmit = async () => {
  try {
    if (isLogin.value) {
      // Llamamos a la acción 'login' del store
      await authStore.login(loginData.email, loginData.password);
    } else {
      // Pedimos el nombre del negocio si no está
      if (!registerData.businessName) {
        registerData.businessName = prompt('Por favor, ingresa el nombre de tu negocio:', 'Mi Negocio');
        if (!registerData.businessName) return; // Si cancela
      }
      // Llamamos a la acción 'register' del store
      await authStore.register({
        businessName: registerData.businessName,
        userName: registerData.name, // El store espera 'userName'
        email: registerData.email,
        password: registerData.password,
      });
    }
    // ¡Ya no necesitamos guardar el token ni redirigir aquí!
    // El store se encarga de eso automáticamente.

  } catch (error) {
    // El manejo de errores sigue siendo útil aquí
    console.error('Error de autenticación:', error);
    const errorMessage = error.response?.data?.error || 'Ocurrió un error. Inténtalo de nuevo.';
    alert(errorMessage);
  }
};
</script>