<template>
  <Layout title="Acerca del proyecto" :showButton="false" :showSidebar="true" :showBackground="true">
    <div class="p-4 md:p-8">

      <div class="mb-12">
        <div class="rounded-2xl bg-gradient-to-r from-[#4079ff] to-[#40ffaa] p-[2px]">
          <div class="w-full h-full bg-zinc-800 rounded-[14px] p-6">
            <h2 class="text-2xl font-bold text-white mb-4">Objetivo del Proyecto</h2>
            <p class="text-zinc-300 leading-relaxed">
              Bloom es una plataforma diseñada para centralizar y analizar las reseñas de los usuarios, transformando datos cualitativos en información estratégica. Nuestro objetivo es proporcionar a las empresas una herramienta poderosa para entender a sus clientes, identificar áreas de mejora y tomar decisiones basadas en datos reales para potenciar su crecimiento y reputación.
            </p>
          </div>
        </div>
      </div>

      <div class="text-center">
        <h2 class="text-3xl font-bold text-white mb-8">Nuestro Equipo</h2>
        
        <div class="grid grid-cols-2 gap-8 place-items-center">
          
          <div v-for="member in team" :key="member.id" class="flex flex-col items-center text-center">
    
            <TiltedCard
              :image-src="member.imageUrl"
              :alt-text="member.name"
              container-height="300px"
              container-width="300px"
              image-height="300px"
              image-width="300px"
              :rotate-amplitude="12"
              :scale-on-hover="1.05"
              :overlay-content="true"          
              :display-overlay-content="true"  
            >
              <template #overlay>
                <div class="absolute top-4 left-4">
                  <p class="bg-black/50 text-white text-xs font-semibold px-4 py-2 rounded-lg backdrop-blur-sm">
                    {{ member.name }}
                  </p>
                </div>
              </template>
            </TiltedCard>
        
            <p class="text-white font-medium mt-4 text-lg">{{ member.role }}</p>
        
            <a 
              :href="member.cvUrl" 
              target="_blank" 
              rel="noopener noreferrer"
              class="gradient-button mt-2 w-full max-w-[150px] py-2 px-4 flex items-center justify-center gap-2 rounded-full"
            >
              <Icon icon="mdi:file-document-outline" />
              <span>Ver CV</span>
            </a>
        
          </div> 
        
        </div>
      </div>

    </div>
  </Layout>
</template>

<script>
import Layout from '../components/Layout.vue';
import { Icon } from '@iconify/vue';
import TiltedCard from '../components/TiltedCard.vue'; 

export default {
  name: 'About',
  components: {
    Layout,
    Icon,
    TiltedCard
  },
  data() {
    return {
      team: [
        { 
          id: 1, 
          name: 'Rodrigo Macias', 
          role: 'Developer', 
          imageUrl: new URL('@/assets/Rodrigo.png', import.meta.url).href,          
          cvUrl: '/cvs/Rodrigo.pdf'
        },
        { 
          id: 2, 
          name: 'Manuel Mijares', 
          role: 'Developer', 
          imageUrl: new URL('@/assets/Manolo.png', import.meta.url).href,          
          cvUrl: '/cvs/Manuel.pdf'
        },
        { 
          id: 3, 
          name: 'Segio Lopez', 
          role: 'Developer', 
          imageUrl: new URL('@/assets/Cheko.png', import.meta.url).href,          
          cvUrl: '/cvs/Sergio.pdf'
        },
        { 
          id: 4, 
          name: 'Diego Requejo', 
          role: 'Developer', 
          imageUrl: new URL('@/assets/Dieguin.png', import.meta.url).href,          
          cvUrl: '/cvs/Diego.pdf'
        },
        { 
          id: 5, 
          name: 'Enzo', 
          role: 'Project Manager', 
          imageUrl: new URL('@/assets/Chencho.png', import.meta.url).href,          
          cvUrl: 'no tiene, es el mero mero'
        }
      ]
    };
  }
}
</script>

