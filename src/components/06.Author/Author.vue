<script setup>
import authorImage from '../../assets/author.jfif';
import { onBeforeMount } from 'vue';
import { useArticlesStore } from '../../stores/articles.js';

const articlesStore = useArticlesStore();

onBeforeMount(() => {
    articlesStore.clearSearchArticles();
    articlesStore.fetchAllArticles()
})
</script>

<template>
    <main id="author-wrapper">
        <div class="author-content">
            <img :src="authorImage" alt="" id="author-img">
            <p class="description">
                Hi,there 👋
            </p>
            
            <p class="description">
                My name is Mandla, the sole owner of Fanatii World🚀🎮💻.
                <br/>
                I'm a Web Developer who specializes in the creation of websites and web apps.
                But I am also a very passionate gamer, and a tech advocate/creator.
                Are you looking to collaborate on a project or need a website/web app?
            </p>
            <p class="description connect">Lets connect and craft your future:</p>
            <div class="socials">
                <a href="mailto:mandlankosi739@gmail.com"><i class="fa-solid fa-envelope"></i></a>
                <a href="https://calendly.com/mandlankosi739"><i class="fa-solid fa-calendar-days"></i></a>
                <a href="https://fanatii1.github.io/Portfolio/"><i class="fa-solid fa-laptop"></i></a>
                <a href="https://www.instagram.com/fanatii_dev/"><i class="fa-brands fa-instagram"></i></a>
                <a href="https://www.linkedin.com/in/mandlenkosi-marwanqana-b08357218/"><i class="fa-brands fa-linkedin"></i></a>
            </div>
        </div>
    </main>
</template>

<style lang="scss" scoped>
#author-wrapper {
    height: 100%;
    overflow: scroll;
}

.author-content {
    width: 35%;
    height: 50%;
    margin: 0 auto;
    font-size: 1.3rem;
    font-weight: 100;
    color: #c3c3c3;
    line-height: 1.345;
}

#author-img {
    width: 100%;
    height: auto;
    display: block;
    object-fit: contain;
}

.description {
    margin: 2% 0 0 0;
}

.connect {
    font-weight: bold;
}

.socials {
    font-size: 2rem;
}

.socials a, .socials a:active {
    color:  rgb(255, 0, 189);
    cursor: pointer;
    transition: .4s;
    margin-right: 3%;
}

.socials a:hover {
    transform: scale(1.06);
}

.fa-envelope, .fa-laptop, .fa-linkedin {
    color: #fff
}


@media screen and (max-width: 768px) {
  #author-wrapper {
    margin: 6% auto;
  }

  .author-content[data-v-ecb04a28] {
    height: 50%;
    margin: 0 auto;
    font-size: 1rem;
    font-weight: 100;
    color: #c3c3c3;
    line-height: 2;
  }

  .fa-solid, .fa-brands {
    font-size: 1.2rem;
  }
}

@media screen and (max-width: 425px) {  
  #buymeacoffee {
    font-size: 0.5rem !important;
  }
}
</style>