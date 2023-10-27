<script setup>
import { ref, computed, onBeforeMount, onMounted } from 'vue';
import router from '../../router';
import { useArticlesStore } from '../../stores/articles.js';
import { client } from '../../contentful';

const articlesStore = useArticlesStore();
const spaceID = import.meta.env.VITE_SPACE_ID;
const environmentID = import.meta.env.VITE_ENVIRONMENT_ID;

const blogPoll = ref([])
const selectedAnswer = ref(null);
const selectedPoll = ref(null);
const latestFourArticles = ref([]);
let categoryVotes = ref(0)

const displayedArticles = computed(() => {
  return articlesStore.searchedArticles.length > 0
    ? articlesStore.searchedArticles
    : articlesStore.articles;
});

function voteCountPercentage(updatedEntry, selectedCategory){
    console.log(selectedCategory)
    let votes = 0;
    if(selectedCategory === 'developers') {
        updatedEntry.Developers.options.forEach(entry => votes += entry.votes)
    }
    else if(selectedCategory === 'gaming') {
        updatedEntry.Gaming.options.forEach(entry => votes += entry.votes)
    }
    else {
        updatedEntry.Tech.options.forEach(entry => votes += entry.votes)
    }
    categoryVotes.value = votes;
}

//here we update the votes of a selected answer by:
//1. getting the selected answer(option) by id
//2. updating its vote number by 1(+1)
//3. and based on the selected answers category(provided on the pollEntry variable(object) e.g Developers, Gaming, Tech), we update the poll answer(option
// * and OPTIONALLY, we set the width of the selected poll(by percentage) for styling purposes
function selectAnswer(answerID, answerIndex, pollID, question, answer, poll) {
  selectedAnswer.value = answerID;
  selectedPoll.value = pollID;
  let selectedCategory;

  //we get the selected topic by using the object answer ...in array
  client.getSpace(spaceID)
 .then((space) => space.getEnvironment('master'))
  .then((environment) => environment.getEntry(environmentID))
  .then((entry) => {
    let pollEntry = entry.fields.poll['en-US'];
    let pollEntryCategoryToUpdate = pollEntry.Developers.question === poll.question ? pollEntry.Developers : pollEntry.Gaming.question === poll.question ? pollEntry.Gaming : pollEntry.Tech;
    let selectedPollEntryToUpdate = pollEntryCategoryToUpdate.options[answerIndex];
    selectedPollEntryToUpdate.votes = selectedPollEntryToUpdate.votes + 1;

    if(pollEntry.Developers.question === pollEntryCategoryToUpdate.question){
        // console.log('developers')
        // console.log(entry.fields.poll['en-US'])
        selectedCategory = 'developers';
        entry.fields.poll['en-US'].Developers.options[answerIndex] = selectedPollEntryToUpdate;
    } else if (pollEntry.Gaming.question === pollEntryCategoryToUpdate.question) {
        selectedCategory = 'gaming';
        entry.fields.poll['en-US'].Gaming.options[answerIndex] = selectedPollEntryToUpdate;
    } else {
        selectedCategory = 'tech';
        entry.fields.poll['en-US'].Tech.options[answerIndex] = selectedPollEntryToUpdate;
    }

    return entry.update()
  })
  .then((entry) => {
    entry.publish();
    console.log(`Entry ${entry.sys.id} updated.`)
    console.log(entry)
    const updatedEntry = entry.fields.poll['en-US'];
    voteCountPercentage(updatedEntry, selectedCategory)
  })

}

function fetchArticle(id) {
    router.push(`/read-article/${id}`)
}

onBeforeMount(() => {
    articlesStore.clearSearchArticles();
})

//fetch all articles from CMS
onMounted(async () => {
    const art = await articlesStore.fetchAllArticles();
    const pollQuestions = articlesStore.pollQuestions.poll;
    const { Developers, Gaming, Tech } = pollQuestions;

    const poll = [Developers, Gaming, Tech];
    blogPoll.value = poll;
    const fourArticles = art.filter((article) => article.id > 1);
    latestFourArticles.value = fourArticles
})
</script>

<template>
  <Navbar/>  
  <main id="home-wrapper">
    <!-- LATEST 5 ARTICLES / Top of the month -->
    <section id="latest-articles">
        <div class="main-latest">
          <div class="overlay"></div>
          <img :src="articlesStore.articles[0].img" alt="" class="article-image">
          <p class="title main-title">{{ articlesStore.articles[0].title }}</p>  
        </div>
        <div class="sub-latest" v-if="articlesStore.articles.length  > articlesStore.articles.length - 1">
            <div class="sub-article" v-for="(article, index) in latestFourArticles">
                <div class="overlay"></div>
                <img :src="article.img ? article.img : ''" alt="" class="latest-article-img">
                <p class="title">{{ article.title }}</p> 
                <p class="article-date">{{ article.date }}</p>
            </div>
        </div>
    </section>

    <div id="heading-wrapper">
       <h2 id="new-articles-heading">New Articles</h2>
       <div class="heading-underline"></div>
    </div>

    <!-- NEW ARTICLES -->
    <section class="all-new-articles">
      <div class="new-article" v-for="article in displayedArticles" @click="fetchArticle(article.id)">
        <img :src="article.img" alt="" class="new-article-img">
        <p class="new-article-title"><span class="span-new-article-title">{{ article.title }}</span></p>
        <p class="date">{{ article.date }}</p>
        <p
          :class="{
            category: true,
            developers: article.category === 'Developers',
            gaming: article.category === 'Gaming',
            tech: article.category === 'Tech'
          }"
        >
          {{ article.category }}
        </p>
      </div>
    </section>

    <div id="heading-wrapper">
       <h2 id="new-articles-heading">POLL'S</h2>
       <div class="heading-underline"></div>
    </div>


    <!-- POLL -->
    <section id="poll">
        <div class="poll-area" v-for="(poll, index) in blogPoll">
            <p class="poll-question">{{ poll.question }}</p>
            <div class="opt" v-for="answer, answerIndex in poll.options" @click="selectAnswer(answer.id, answerIndex,  poll.id, poll.question, answer.answer, poll)">
              <div
               id="percentage"
               v-if="answer.id === selectedAnswer && poll.id === selectedPoll"
               :style="{ 'width' : answer.votes * 100 / categoryVotes + '%' }"
               >
            </div>
              <p class="option-name">{{ answer.answer }}</p>
            </div>
        </div>
    </section>
  </main>
</template>

<style lang="scss" scoped>
#home-wrapper {
    height: 100%;
    overflow: scroll;
}

#home-wrapper::-webkit-scrollbar {
    width: 3px;
    background-color: none;
}

#home-wrapper::-webkit-scrollbar-thumb {
    background-color: #ed1d3c41;
    border-radius: 2px;
}


#latest-articles {
    height: 55%;
    display: flex;
}

.article-image {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.main-latest {
    position: relative;
    width: 50%;
    cursor: pointer;
    transition: .4s;
    overflow: hidden;
}

.main-latest:hover, .main-latest img {
    transform: scale(1.008);
}

.overlay{
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: #ed1d3b;
    background: -webkit-linear-gradient(181deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0) 50%, #ed1d3cad 100%);
    background: linear-gradient(181deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0) 50%, #ed1d3cad);
    z-index: 2;
}

.sub-latest{
    display: grid;
    grid-template-columns: 50% 50%;
    grid-template-rows: 50% 50%;
    height: 100%;
    width: 50%;
    overflow: hidden;
    cursor: pointer;
}

.sub-article{
    position: relative;
    overflow: hidden;
    transition: .4s;
}

.sub-article:hover, .sub-article img {
    transform: scale(1.02);
}

.title{
    position: absolute;
    bottom: 0;
    z-index: 3;
    margin: 0 0 5% 3%;
    font-weight: 600;
    font-size: 1.15rem;
    color: #fff;
}

.article-date{
    position: absolute;
    bottom: 0;
    z-index: 3;
    margin: 0 0 1% 3%;
    font-size: 0.7rem;
    color: #fff;
}

.main-title{
    font-size: 2.5rem;
}

#heading-wrapper{
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}

.heading-underline {
    height: 5px;
    width: 15%;
    background-color: #ed1d3b;
}

.all-new-articles {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 350px));
    grid-auto-rows: 100%;
    justify-content: center;
    gap: 2%;
    height: 40%;
    max-height: 850px;
    margin: 3% 0;
    overflow: scroll;
}

.all-new-articles::-webkit-scrollbar {
    width: 0;
    background-color: none;
}

.all-new-articles::-webkit-scrollbar-thumb {
    background-color: #ed1d3c41;
    border-radius: 2px;
}

.new-article{
    height: 100%;
    background-color: #0f1010;
    color: #fff;
    border: 1px solid #ed1d3b;
    -webkit-box-shadow: 0 0 11px 1.5px #ed1d3b;
    -moz-box-shadow: 0 0 11px 1.5px #ed1d3b;
    box-shadow: 0 0 11px 1.5px #ed1d3b;
    cursor: pointer;
    transition: .4s;
}

.new-article:hover {
    transform: scale(1.04);
}

.latest-article-img{
    display: block;
    height: 100%;
    width: 100%;
    object-fit: cover;
    margin-bottom: 5%;
}

.new-article-title, .date, .category {
    padding-left: 3%;
    line-height: 2.5;
    font-size: 1.05rem;
    font-weight: 600;
}

.category {
    padding-left: 0;
    display: inline;
}

.developers, .gaming, .tech {
    padding: 2%;
    margin-left: 3%;
}

.developers {
    background-color: #ed1d3b;
    -webkit-box-shadow: 0 0 11px 1.5px #ed1d3b;
    -moz-box-shadow: 0 0 11px 1.5px #ed1d3b;
    box-shadow: 0 0 11px 1.5px #ed1d3b;
}

.gaming {
    background-color: #f10de2;
    -webkit-box-shadow: 0 0 11px 1.5px #f10de2;
    -moz-box-shadow: 0 0 11px 1.5px #f10de2;
    box-shadow: 0 0 11px 1.5px #f10de2;
}

.tech {
    background-color: #5d00f9;
    -webkit-box-shadow: 0 0 11px 1.5px #5d00f9;
    -moz-box-shadow: 0 0 11px 1.5px #5d00f9;
    box-shadow: 0 0 11px 1.5px #5d00f9;
}


#poll {
    height: 100%;
    max-height: 600px;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 350px));
    grid-auto-rows: 100%;
    gap: 3.5%;
    justify-content: center;
    margin: 3% 0;
}
.poll-area {
    max-width: 320px;
    height: 100%;
    max-height: 700px;
    padding-bottom: 1%;
    background-color: #0f1010;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    border-radius: 10px;
}

.poll-question {
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    background: #242526;
    padding: 2%;
    color: #fff;
    font-size: 1.65rem;
    text-align: center;
    font-weight: 600;
}

.opt {
    position: relative;
    margin: 4.2% 4.2% 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 5%;
    color: #fff;
    font-weight: 600;
    border: 1px solid #ed1d3b;
    -webkit-box-shadow: 0 0 11px 1.5px #ed1d3b;
    -moz-box-shadow: 0 0 11px 1.5px #ed1d3b;
    box-shadow: 0 0 11px 1.5px #ed1d3b;
    cursor: pointer;
    transition: .4s;
    height: 10%;
}

.opt:hover {
    transform: scale(1.02);
}

.option-name {
    position: absolute;
    z-index: 3;
}

#percentage {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    background: #ed1d3b;
    z-index: 2;
}

@media screen and (max-width: 1024px) {
    .all-new-articles {
        height: 50%;
    }
    .developers, .gaming, .tech {
    padding: 0% 2%;
    margin-left: 3%;
}
}

@media screen and (max-width: 768px) {
    .main-latest {
        display: none;
    }

    .sub-latest {
        width: 100%;
    }

    #new-articles-heading {
        font-size: 1.9rem;
    }

    /* #poll {
        height: 40%;
    } */

    .poll-question {
        font-size: 0.9rem;
    }

    .option-name {
        font-size: 0.7rem;
    }
}

@media screen and (max-width: 425px) {
    
    .new-article-title {
        font-size: 0.9rem;
    }

    .title {
        font-size: 1.05rem !important;
        bottom: 3.5%;
    }

    .developers, .gaming{
        padding: 0;
        padding-left: 2%;
        margin-left: 3%;
        margin-bottom: 10%;
    }

    .menu {
        display: none;
    }
}

@media screen and (max-width: 1024px) {
    #poll {
        height: 55%;
    }

    .poll-area {
        max-height: 450px;
        margin: 0 auto;
    }

    .poll-question {
        font-size: 1.2rem;
    }

    .main-title {
        font-size: 1.8rem;
    }
}

@media screen and (min-width: 1025px) {
    #poll {
        height: 55%;
    }
    .poll-area {
        max-width: 385px;
    }
}

</style>
