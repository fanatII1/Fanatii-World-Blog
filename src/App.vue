<script setup>
import { RouterLink, RouterView } from 'vue-router';
import { ref, onMounted, watch } from 'vue';
import logo from './assets/logo-2.png';
import navbar from './components/navbar.vue'

const activeNavItem = ref('home');
function setActiveNavItem(item) {
  activeNavItem.value = item;
}

onMounted(() => {
  
})
</script>

<template>
  <navbar/>
  <RouterView/>
</template>

<style scoped>
</style>
