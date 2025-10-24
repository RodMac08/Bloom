<template>
  <header class="
    relative flex justify-between items-center 
    px-5 py-5 bg-zinc-900 shadow-xl rounded-t-xl
    after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 
    after:h-[2px] after:bg-gradient-to-l after:from-[#40ffaa] after:to-[#4079ff]
  ">
    <GradientText
      :text="title"
      :colors="['#4079ff', '#40ffaa', '#4079ff']"
      :animation-speed="5"
      class-name="text-2xl font-bold p-2"
    />

  </header>
</template>

<script>
import GradientText from "./GradientText.vue"

export default {
  name: "Header",
  components: {
    GradientText
  },
  props: {
    title: {
      type: String,
      default: "Titulo por defecto"
    }
  }
}
</script>