<script setup>
import { onMounted, ref, watch } from 'vue';
import router from '../../router';
import { useRoute } from 'vue-router';
import { useArticlesStore } from '../../stores/articles';
import { BLOCKS, MARKS, INLINES } from '@contentful/rich-text-types';
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';

const route = useRoute();
const articlesStore = useArticlesStore();
const articleId = Number(route.params.id);
const articleInfo = articlesStore.fetchArticle(articleId);
const article = articleInfo.article;

//object that defines the options of how the rich text editor content from the CMS renders
const renderOptions = {
    renderNode:{
      [BLOCKS.EMBEDDED_ASSET] : (node, children)=>{
        // console.log(node.node.data.target.sys.id)
        // console.log(articleInfo.assets)
        const assets = articleInfo.assets;
        const imgInfo = assets.find(asset => asset.sys.id === node.data.target.sys.id );
        const img = imgInfo.fields.file.url;
        // console.log(img)
        return `<div class='rtc-img-wrapper'><img src=${img} alt='rtc-img' class='rtc-img'/></div>`
      },
      [BLOCKS.PARAGRAPH]: (node, children)=>{
        return `<p class='rtc-paragraph'>${node.content[0].value}</p>`
      },
      [BLOCKS.HEADING_1]: (node,children)=>{
        return `<h1 class='rtc-heading-1'>${node.content[0].value}</h1>`
      },
      [BLOCKS.HEADING_2]: (node,children)=>{
        return `<h2 class='rtc-heading-2'>${node.content[0].value}</h2>`
      },
      [BLOCKS.HEADING_3]: (node,children)=>{
        return `<h3 class='rtc-heading-3'>${node.content[0].value}</h3>`
      },
      [BLOCKS.HEADING_4]: (node,children)=>{
        return `<h4 class='rtc-heading-4'>${node.content[0].value}</h4>`
      },
      [BLOCKS.HEADING_5]: (node,children)=>{
        return `<h5 class='rtc-heading-5'>${node.content[0].value}</h5>`
      },
      [BLOCKS.HEADING_6]: (node,children)=>{
        return `<h6 class='rtc-heading-6'>${node.content[0].value}</h6>`
      },
      [BLOCKS.UL_LIST] : (node, children)=>{
        return(
`          <ul class='rtc-list'>
            ${children}
          </ul>`
        )
      },
      [INLINES.HYPERLINK]: (node, children) => {
        
        return `<a href=${node.data.url} target='_blank' rel='noopener noreferrer'>${node.content[0].value}</a>`
      },
      [MARKS.UNDERLINE]: (node, children)=>{
        return `<u></u>`
      }
    }
}

//function that reads out the article to the users
//the article is in the documentToHtmlString() which is a function from contentful that contains(returns) the entire content of the article, including the html
function readArticle(){
  const articleContent = documentToHtmlString(article, renderOptions);
  const cleanedArticle = articleContent.replace(/<[^>]*>/g, '');
  console.log(cleanedArticle)
  speakOutArticle(cleanedArticle)
}

//function that speaks out the aricle
function speakOutArticle(article){
  const synth = window.speechSynthesis;
  const utterance = new SpeechSynthesisUtterance(article);
  synth.speak(utterance);
}

</script>

<template>
    <main id="article-wrapper">
        <section id="article-banner">
            <img :src="articleInfo.img" alt="" id="article-banner-img">
        </section>
        
        <div id="heading-wrapper">
            <h2 id="new-articles-heading-read">{{ articleInfo.title }} <i @click="readArticle" class="fa-solid fa-volume-high"></i></h2>
            <div class="heading-underline"></div>
       </div>

       <div id="author-wrapper">
            <img :src="articleInfo.authorImg" alt="" class="authorImg">
            <div class="author-description">
              <RouterLink id="author" to="/author">By: {{ articleInfo.author }}</RouterLink>
              <br>
              <p>web developer, gamer and tech advocate</p>
            </div>
       </div>

       <section id="article-content">
        <!-- {{ documentToHtmlString(article, renderOptions) }} -->
        <div class="article-content"  v-html="documentToHtmlString(article, renderOptions)" ></div>
       </section>
    </main>

    
    <footer id="buymeacoffee">
        <p>
          I'm brewing up extra-special content and insights, just for you and I would appreciate your support in 
          <a href="https://www.buymeacoffee.com/fanatiiworld" id="coffee-link"><b>buying me a coffee.☕</b></a>
        </p>
    </footer>
</template>

<style scoped>
#article-wrapper {
    height: 100%;
    overflow: scroll;
}

#article-wrapper::-webkit-scrollbar {
    width: 3px;
    background-color: none;
}

#article-wrapper::-webkit-scrollbar-thumb {
    background-color: #ed1d3c41;
    border-radius: 2px;
}

#article-banner {
    height: 63%;
}

#article-banner-img {
    display: block;
    height: 100%;
    width: 100%;
    object-fit: cover;
}

.heading-underline {
    width: 35% !important;
}

#author-wrapper {
  height: 5%;
  display: flex;
  width: 85%;
  margin: 2% auto;
  color: #fff;
  font-size: 1.2rem;
  font-weight: 600;
  align-items: center;
  max-width: 1495px;
}

.authorImg {
  display: block;
  height: 100%;
  max-width: 65px;
  max-height: 65px;
  border-radius: 50%;
  border: 1px solid #ed1d3b;
  padding: 0.1%;
}

#author, #author:active {
  margin-left: 2.5%;
  color: #ed1d3b;
  font-size: 1.15rem;
  width: 100%;
  display: block;
}

.author-description p {
  margin-left: 2.5%;
  font-size: 0.9rem;
  color: gray;
  font-style: italic;
}

#article-content {
    width: 85%;
    height: 100%;
    margin: 0 auto;
    font-size: 1.3rem;
    color: #c3c3c3;
    text-align: left;
}

.fa-volume-high {
  color: #ed1d3b;
  font-size: 2rem;
}

#buymeacoffee {
  border-radius: 40px;
  width: 87%;
  height: 7%;
  background: #242526;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.125rem;
  font-weight: 500;
  max-width: 1150px;
  margin-top: 2%;
}

#coffee-link, #coffee-link:active {
  color: #ed1d3b;
}

@media screen and (max-width: 768px) {
  #author-wrapper {
    margin: 6% auto;
  }

  #article-banner {
    height: 55%;
  }
}

@media screen and (max-width: 425px) {
  #new-articles-heading {
    font-size: 1.6rem;
  }
  
  #buymeacoffee[data-v-fe4562ad] {
    padding: 5%;
    font-size: 0.7rem;
  }

  .rtc-img-wrapper {
    max-height: 360px;
  }
}

@media screen and (max-width: 1024px) {
  #author-wrapper {
    margin: 8% auto;
  }

  #article-content {
    font-size: 1rem;
  }

  .fa-volume-high {
    color: #ed1d3b;
    font-size: 1.4rem;
  }

  #buymeacoffee {
    padding: 5%;
    font-size: 1rem;
  }
}


@media screen and (max-width: 1024px) {
  .all-new-articles {
    height: 50%;
  }
}

@media screen and (max-width: 768px) {
  .rtc-paragraph {
    margin: 5% 0 !important;
  }

  .rtc-img-wrapper {
    max-height: 450px !important;
  }
}



/*STYLES FOR THE READ ARTICLES PAGE ARE DEFINED HERE BECAUSE THE RICH TEXT EDITOR OF THE CMS MUST HAVE ITS STYLES GLOBAL TO THE HTML PAGE*/
.article-content {
  max-width: 1550px;
  margin: 0 auto;
}

.rtc-paragraph {
  margin: 1% 0;
}

.rtc-img-wrapper {
  height: 750px;
  max-height: 525px;
  width: 95%;
  margin: 2% auto;
}

.rtc-img{
  display: block;
  height: 100%;
  width: 100%;
  margin: 0 auto;
  object-fit: cover;
}

@media screen and (max-width: 425px) {
  .rtc-img-wrapper {
    max-height: 360px;
  }
}

</style>