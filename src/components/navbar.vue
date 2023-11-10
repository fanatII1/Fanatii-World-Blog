<script setup>
import logo from '../assets/logo_rm_bg.png';
import { ref, watch, computed } from 'vue';
import { useArticlesStore } from '../stores/articles';


const articlesStore = useArticlesStore();
const activeNavItem = ref('home');
const searchText = ref('');
const microphone = ref(null);
const mobileNav = ref(null);
const mobileNavStatus = ref(false);

function setActiveNavItem(item) {
  activeNavItem.value = item;
}

watch(searchText, () => {
  articlesStore. searchArticles(searchText.value)
})

//searching the articles by voice
function searchArticleByVoice() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  recognition.start();

  recognition.onstart = function () {
    console.log('Listening, please speak...');
    microphone.value.style.color = '#fff';
  };

  recognition.onresult = function (event) {
    const transcript = event.results[0][0].transcript.toLowerCase();
    const articleName = transcript;
    // console.log(articleName, transcript)
    articlesStore.searchArticles(articleName);
    microphone.value.style.color = ' rgb(255, 0, 189)';
  };
}

//open//close of mobile nav
function changeMobileNavStatus() {
  mobileNavStatus.value = !mobileNavStatus.value;
}
</script>


<template>
  <nav class="navbar">
    <div class="logo nav-item-1">
      <img :src="logo" alt="" id="logo">
      <i class="fa-solid fa-bars" @click="changeMobileNavStatus"></i>
    </div>

    <div class="menu nav-item-2">
      <div :class="{ 'nav-item': true, 'active': activeNavItem === 'home' }" @click="setActiveNavItem('home')">
        <RouterLink to="/">Home</RouterLink>
      </div>
      <div :class="{ 'nav-item': true, 'active': activeNavItem === 'developer' }" @click="setActiveNavItem('developer')">
        <RouterLink to="/developers">Developers</RouterLink>
      </div>
      <div :class="{ 'nav-item': true, 'active': activeNavItem === 'gaming' }" @click="setActiveNavItem('gaming')">
        <RouterLink to="/gaming">Gaming</RouterLink>
      </div>
      <div :class="{ 'nav-item': true, 'active': activeNavItem === 'tech' }" @click="setActiveNavItem('tech')">
        <RouterLink to="/tech"> Tech</RouterLink>
      </div>
    </div>

      <!-- Search Input -->
      <div class="search-input-wrapper nav-item">
        <input class="search" v-model="searchText" type="text" placeholder="Search..." />
        <div class="search-icon-wrapper">
          <i class="fa fa-search"></i>
        </div>
        <div class="voice-icon-wrapper" @click="searchArticleByVoice">
          <i ref="microphone" class="fa-solid fa-microphone"></i>
        </div>
    </div>
  </nav>



  <!-- MOBILE NAV -->
  <nav :class="{'mobile-nav': mobileNavStatus, 'mobile-nav-status': true}" ref="mobileNav">
    <i :class="{'fa-solid fa-x': mobileNavStatus}" @click="changeMobileNavStatus"></i>
    <div :class="{ 'mobile-nav-item': true, 'active': activeNavItem === 'home' }" @click="setActiveNavItem('home')"><RouterLink to="/">Home</RouterLink></div>
    <div :class="{ 'mobile-nav-item': true, 'active': activeNavItem === 'developer' }" @click="setActiveNavItem('developer')"><RouterLink to="/developers">Developers</RouterLink></div>
    <div :class="{ 'mobile-nav-item': true, 'active': activeNavItem === 'gaming' }" @click="setActiveNavItem('gaming')"><RouterLink to="/gaming">Gaming</RouterLink></div>
    <div :class="{ 'mobile-nav-item': true, 'active': activeNavItem === 'tech' }" @click="setActiveNavItem('tech')"><RouterLink to="/tech"> Tech</RouterLink></div>
  </nav>
</template>


<style lang="scss" scoped>
nav {
  position: sticky;
  top: 0;
  left: 0;
  height: 7%;
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #000;
  color: #fff;
  z-index: 5;
  overflow: hidden;
}

@media screen and (min-height: 600px) and (max-height: 670px) {
  nav {
    height: 81%;
  }
}


.navbar a{
  color: #fff;
  text-decoration: none;
}

.logo{
  height: 115%;
  display: flex;
  align-items: center;
  justify-content: center;
}
#logo{
  display: block;
  width: 100%;
  height: 155%;
  object-fit: contain;
}

.fa-bars {
  font-size: 1.15rem;
  display: none;
}

.menu {
  width: 50%;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  font-size: 1rem;
}

.nav-item {
  margin: 0 10px;
  cursor: pointer;
  transition: 0.6s ease-in-out;
  font-size: 0.75rem;
}

.nav-item.active a{
  color:  rgb(255, 0, 189);
}

.nav-item:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.search-input-wrapper{
  display: flex;
  justify-content: center;
  align-items: center;
  height: 70%;
}

input:focus{
  outline: none;
}

.search{
  border: none;
  background: #2f2f2f;
  padding: 2%;
  color: #fff;
  font-weight: 600;
  height: 100%;
}

.search::placeholder{
  color: #fff;
}

.search-icon-wrapper{
  display: flex;
  justify-content: center;
  align-items: center;
  background-color:  rgb(255, 0, 189);
  height: 100%;
  min-width: 35px;
}

.voice-icon-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  color:  rgb(255, 0, 189);
  border: 1px solid  rgb(255, 0, 189);
  height: 100%;
  min-width: 35px;
}

.mobile-nav {
  display: none;
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background-color: #000;
  animation: slideMobileNav .4s;
}

@keyframes slideMobileNav {
  from {
    width: 0;
  }
  to {
    width: 100%;
  }
}

.mobile-nav-status {
  display: none;
}

.mobile-nav a {
  text-decoration: none;
  color: #fff;
}

.mobile-nav-item {
  margin: 5% auto;
  cursor: pointer;
  transition: 0.6s ease-in-out;
  font-weight: bold;
}

.mobile-nav-item.active a {
  color:  rgb(255, 0, 189);
}

.mobile-nav-item:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.fa-x {
  position: relative;
  top: -30%;
  right: -40%;
  font-size: 1.5rem;
}

@media screen and (max-width: 1024px) {
  .nav-item {
    font-size: 0.65rem;
  }
}

@media screen and (max-width: 680px) {
  .nav-item-2 {
    display: none;
  }

  .mobile-nav {
    display: flex;
  }

  #logo {
    display: none;
  }

  .fa-bars {
    display: inline;
  }
}

</style>