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

function listItemElementCreator(list, value) {
  // console.log(value, value.marks.propertyThatDoesNotExist)
  // console.log(value.marks[0], typeof value.marks[0] === 'undefined')
  if(value.marks){
    if(typeof value.marks[0] === 'undefined') {
    // console.log('yo 1')
    const li = document.createElement('li');
    li.className = 'sub-list-item';
    li.textContent = value.value;
    list.appendChild(li);
    return list
  } else {
    // console.log('yo 222')
    let listLastChild = list.tagName === 'UL' ? list.lastChild : null;
    // console.log(listLastChild)
    
    if(listLastChild) {
      const span = document.createElement('span');
      span.textContent = value.value;
      span.style.fontStyle = 'italic';
      span.style.textDecoration = 'underline';
      listLastChild.appendChild(span);
      span.style.color = '#fff';
    }else {
      const li = document.createElement('li');
      li.style.color = '#fff';
      li.classList = list.tagName === 'UL' ? 'sub-list-item' : 'main-list-item';
      li.style.fontSize = list.tagName === 'UL' ? '0.65rem' : '1rem';
      li.textContent = value.value;
      list.appendChild(li);

    }
  }

    // console.log(list)
    return list
  }

}

function ListItemCreator(listType, listItems) {
  // console.log(listType)
  const list = document.createElement(listType);
  listItems.forEach((listItem) => {
    let listItemValues = listItem.content;
    
    //for each value we are going to return a <li>
      listItemValues.forEach((value) => {
        let listItemContent = value.content;
        if(value.nodeType === 'paragraph') {
          listItemContent.forEach((item) => {
            listItemElementCreator(list, item);
          }) 
        }
        else if(value.nodeType === 'unordered-list') {
          const inlineUL = document.createElement('ul');
          let inlineListItems = listItemContent;
          inlineListItems.forEach((inlineItem) => {
            let itemContent = inlineItem.content;
            itemContent.forEach((itemValue) => {
              itemValue.content.forEach((value) => {
                let inlineList = listItemElementCreator(inlineUL, value);
                list.appendChild(inlineList)
              })
            })
          })
        }
        else {
          console.log('')
        }
      })
  })
  return list
}

//object that defines the options of how the rich text editor content from the CMS renders
const renderOptions = {
    preserveWhiteSpace: true,
    renderMark: {
      [MARKS.UNDERLINE]: (text)=>{
        return `<u>${text}</u>`
      },
      [MARKS.BOLD]: (text)=>{
        return `<b>${text}</b>`
      }
    },
    renderNode:{
      [BLOCKS.EMBEDDED_ASSET] : (node, children)=>{
        // console.log(node.node.data.target.sys.id)
        // console.log(articleInfo.assets)
        const assets = articleInfo.assets;
        const imgInfo = assets.find(asset => asset.sys.id === node.data.target.sys.id );
        const img = imgInfo.fields.file.url;

        return `<div class='rtc-img-wrapper'><img src=${img} alt='rtc-img' class='rtc-img'/></div>`
      },
      [BLOCKS.PARAGRAPH]: (node, children)=>{
        // console.log(node.content)
        const div =  document.createElement('div');
        div.className = 'rtc-paragraph-inline';
        node.content.forEach((value, index) => {
          // value.value being undefined means that the node content(paragraph data) is a hyperlink
          if(typeof value.value === 'undefined') {
            // console.log(value)
            const link = document.createElement('a');
            link.setAttribute('href', value.data.uri);
            link.textContent = value.content[0].value;
            link.style.color = '#ff00bd';
            // console.log(div.lastChild)
            let currentTextForLink = div.lastChild;
            currentTextForLink.appendChild(link)
            // console.log(currentTextForLink)
            // div.appendChild(link)
          }
          else {
            const paragraph = document.createElement('p');
            paragraph.textContent = value.value;
            paragraph.style.fontWeight = typeof value.marks[0] === 'undefined' ? '' : 'bold';

            if(typeof value.marks[0] === 'undefined'){
              paragraph.style.marginBottom = '1.5%';
            }
            else {
              paragraph.style.marginTop = '0.5%';
            }

            div.appendChild(paragraph)
          }
        })

        return div.outerHTML
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
        console.log('hiii')
        let listItems = node.content;
        let list = ListItemCreator('ul', listItems)
        // return the created html as a string to mend in the document(HTML
        // done this because the documentToHtmlString() renders the text editor content from CMS via a string
        return list.outerHTML
      },
      [BLOCKS.OL_LIST] : (node, children)=>{
        // console.log('hiii')
        let listItems = node.content;
        let list = ListItemCreator('ol', listItems)
        return list.outerHTML
      },
      [INLINES.HYPERLINK]: ({ data }, children) => {
        console.log(data)
        return 
        `<a
        href={data.uri}
        target={${data.uri.startsWith(website_url) ? '_self' : '_blank'}}
        >{children}</a>`
      },
      [MARKS.ITALIC]: (node, children)=>{
        console.log('hi')
        return `<b></b>`
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
    <main id='article-wrapper'>
        <section id='article-banner'>
            <img :src='articleInfo.img' alt='' id='article-banner-img'>
        </section>
        
        <div id='heading-wrapper'>
            <h2 id='new-articles-heading-read'>{{ articleInfo.title }} <i @click='readArticle' class='fa-solid fa-volume-high'></i></h2>
            <div class='heading-underline'></div>
       </div>

       <div id='author-wrapper'>
            <img :src='articleInfo.authorImg' alt='' class='authorImg'>
            <div class='author-description'>
              <RouterLink id='author' to='/author'>By: {{ articleInfo.author }}</RouterLink>
              <p>web developer, gamer and tech advocate</p>
            </div>
       </div>

       <section id='article-content'>
        <!-- {{ documentToHtmlString(article, renderOptions) }} -->
        <div class='article-content'  v-html='documentToHtmlString(article, renderOptions)' ></div>
       </section>

      <footer id='buymeacoffee'>
        <p>
          Creating exclusive content just for you. Your
          <a href='https://www.buymeacoffee.com/fanatiiworld' id='coffee-link'><b>coffee support</b></a>
          is much appreciated.☕
        </p>
      </footer>
    </main>
</template>

<style lang='scss' scoped>
#article-wrapper {
    height: 100%;
    overflow: scroll;
}

#article-wrapper::-webkit-scrollbar {
    width: 0px;
    // background-color: white;
}

#article-wrapper::-webkit-scrollbar-thumb {
    background-color: #ff002641;
    width: 1px;
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
  max-width: 990px;
}

.authorImg {
  display: block;
  height: 100%;
  max-width: 65px;
  max-height: 65px;
  border-radius: 50%;
  border: 1px solid  rgb(255, 0, 189);
  padding: 0.1%;
}

#author, #author:active {
  margin-left: 2.5%;
  color:  rgb(255, 0, 189);
  font-size: 0.85rem;
  width: 100%;
  display: block;
}

.author-description p {
  margin-left: 2.5%;
  font-size: 0.75rem;
  color: gray;
  font-style: italic;
  font-weight: 300;
}

#article-content {
    width: 85%;
    // height: 100%;
    margin: 0 auto;
    font-size: 1rem;
    letter-spacing: 0.035rem;
    color: #c3c3c3;
    text-align: left;
    line-height: 2;
}

.fa-volume-high {
  color:  rgb(255, 0, 189);
  font-size: 2rem;
}

#buymeacoffee {
  border-radius: 10px;
  width: 80%;
  height: 7%;
  background: #242526;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.85rem;
  font-weight: 500;
  max-width: 1000px;
  margin-top: 2%;
  color: #fff;
}

#coffee-link, #coffee-link:active {
  color:  rgb(255, 0, 189);
}

@media screen and (max-width: 375px) {
  #buymeacoffee[data-v-fe4562ad] {
    padding: 5%;
    font-size: 0.4rem !important;
  }
}

@media screen and (max-width: 425px) {
  #new-articles-heading {
    font-size: 1.6rem;
  }
  
  #buymeacoffee[data-v-fe4562ad] {
    padding: 5%;
  }

  .rtc-img-wrapper {
    max-height: 360px;
  }
}

@media screen and (max-width: 638px) {
  .article-content {
    font-size: 1.065rem;
  }

  #buymeacoffee[data-v-fe4562ad] {
    padding: 5%;
    font-size: 0.68rem !important;
  }
}

@media screen and (max-width: 767px) {
  #author-wrapper {
    margin: 6% auto;
  }

  #article-banner {
    height: 55%;
  }
}

@media screen and (max-width: 1024px) {
  #author-wrapper {
    margin: 8% auto;
  }

  #article-content {
    font-size: 0.9rem;
  }

  .fa-volume-high {
    color:  rgb(255, 0, 189);
    font-size: 1.4rem;
  }

  #buymeacoffee {
    padding: 5%;
    font-size: 0.8rem;
  }
}


/*STYLES FOR THE READ ARTICLES PAGE ARE DEFINED HERE BECAUSE THE RICH TEXT EDITOR OF THE CMS MUST HAVE ITS STYLES GLOBAL TO THE HTML PAGE*/
.article-content {
  max-width: 1000px;
  margin: 0 auto;
}

.rtc-paragraph {
  margin: 1% 0;
}

.rtc-img-wrapper {
  height: 750px;
  max-height: 525px;
  width: 95%;
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