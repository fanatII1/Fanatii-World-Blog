<script setup>
import { ref, watch, computed, onMounted, onBeforeMount } from 'vue';
import { useArticlesStore } from '../../stores/articles.js';
import router from '../../router';

const articlesStore = useArticlesStore();
console.log(articlesStore.articles[0].title)

const displayedArticles = computed(() => {
  return articlesStore.searchedArticles.length > 0
    ? articlesStore.searchedArticles
    : articlesStore.articles.filter(article => article.category === 'Tech');
});

function fetchArticle(id) {
    router.push(`/read-article/${id}`)
}

onBeforeMount(() => {
    // articlesStore.clearSearchArticles();
    articlesStore.fetchAllArticles()
})
</script>

<template>  
  <Navbar/>  
  <main id="developer-wrapper">

    <div id="heading-wrapper">
       <h2 id="new-articles-heading">Developer Articles</h2>
       <div class="heading-underline"></div>
    </div>

    <!-- ALL TECH ARTICLES -->
    <section class="all-new-articles">
        <div class="new-article" v-for="article in displayedArticles" @click="fetchArticle(article.id)">
            <img :src="article.img" alt="" class="new-article-img">
            <p class="new-article-title"><span class="span-new-article-title">{{ article.title }}</span></p>
            <p class="date">{{ article.date }}</p>
            <p
            :class="{ 'category': true, 'developers': article.category === 'Developers', 'gaming': article.category === 'Gaming', 'tech': article.category === 'Tech' }"
            >
              {{ article.category }}
            </p>
        </div>
    </section>


  </main>
</template>

<style scoped>
#developer-wrapper {
    height: 100%;
    overflow: scroll;
}

#developer-wrapper::-webkit-scrollbar {
    width: 3px;
    background-color: none;
}

#developer-wrapper::-webkit-scrollbar-thumb {
    background-color: #ed1d3c41;
    border-radius: 2px;
}

#heading-wrapper{
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}

 

</style>