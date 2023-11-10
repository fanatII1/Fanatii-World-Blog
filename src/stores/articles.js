import { defineStore } from 'pinia';

export const useArticlesStore = defineStore('articles', {
  state: () => ({
    articles: [{ id: 1, title: '', category: '', img: '', date: '' }],
    searchedArticles: [],
    pollQuestions: []

  }),
  actions: {
    async fetchAllArticles() {
      //fetch all articles and make sure to remove the sys and metadata properties only at first level of the CMS articles object
      const articlesBaseURL = import.meta.env.VITE_CONTENTFUL_BASE_URL;
      let fetchArticleData = await fetch(articlesBaseURL);
      let articlesData = await fetchArticleData.json();
      let { items, includes } = articlesData;

      const sanitizedArticles = items.map((item, index) => {
        const { metadata, sys, ...fields } = item;
        const { title, author, authorImage, date, banner, category, article, poll } = fields.fields;
        
        //if there is an authorImage, means this is data related to the articles
        //else its data related to the poll
        if(authorImage){
          const authorImageInfo = includes.Asset.find(asset => asset.sys.id === authorImage.sys.id );
          const authorImg = authorImageInfo.fields.file.url;
          const bannerImageInfo = includes.Asset.find(asset => asset.sys.id === banner.sys.id );
          const bannerImage = bannerImageInfo.fields.file.url;
          let formattedDate = modifyDate(date)
          function modifyDate(date) {
            const isoDate = date;
            const newDate = new Date(isoDate);

            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            const formattedDate = newDate.toLocaleDateString('en-US', options);
            return formattedDate
          }

          const articleInfo = { 
            id: ++index,
            title,
            author,
            authorImg,
            img: bannerImage,
            date: formattedDate,
            banner,
            category,
            article,
            assets: includes.Asset
          };

          return articleInfo;
        }
        else {
          const pollInfo = { poll }
          this.pollQuestions = pollInfo;
        }
      });

      const articlesWithoutPoll = sanitizedArticles.filter(article => typeof article !== 'undefined')
      localStorage.setItem('articles', JSON.stringify(articlesWithoutPoll))
      this.articles = articlesWithoutPoll;
      return articlesWithoutPoll;
    },
     searchArticles(searchText) {
      // Filter articles based on the search query (case-insensitive)
      this.searchedArticles = this.articles.filter(article =>
        article.title.toLowerCase().includes(searchText.toLowerCase())
      );
    },
    clearSearchArticles() {
      this.searchedArticles = [];
    },
    fetchArticle(id) {
      const articles = JSON.parse(localStorage.getItem('articles'))
      return articles.find(article => article.id === id)
    }
  }
});
