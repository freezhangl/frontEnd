<template>
  <div class="articles">
    <banner></banner>
    <div class="site-content animate">
      <!-- 文章目录 -->
      <!--      <div id="article-menus">-->
      <!--        <menu-tree :menus="menus" child-label="child"></menu-tree>-->
      <!--      </div>-->
      <main class="site-main ">
        <article class="hentry grid-line">
          <!-- 文章头部 -->
          <header class="entry-header">
            <!-- 标题输出 -->
            <h1 class="entry-title">{{ articleData.article_title }}</h1>
            <hr>
            <div class="breadcrumbs" v-if="articleData.createdAt">
              <div id="crumbs">最后更新时间：{{ articleData.createdAt | parseTimeFull }}</div>
            </div>
          </header>
          <!-- 正文输出 -->
          <div class="entry-content "
               v-if="articleData.editType==='mce'"
               ref="temp"
               v-html="articleData.article_content"
               @click="previewImg($event)"
          >
          </div>
          <mk-md-editor class="md-edit" v-else mode="preview" v-model="articleData.article_content"/>
          <!-- 文章底部 -->
          <section-title>
            <footer class="post-footer">
              <!-- 阅读次数 -->
              <div class="post-like">
                <i class="iconfont iconeyes"></i>
                <span class="count">{{ articleData.viewsCount }}</span>
              </div>
              <!-- 赞助按钮 -->
              <div class="donate" @click="showDonate=!showDonate">
                <span>赏</span>
                <ul class="donate_inner" :class="{'show':showDonate}">
                  <li class="wedonate"><img src="@/assets/img/vx.jpg">
                    <p>微信</p></li>
                  <li class="alidonate"><img src="@/assets/img/zfb.jpg">
                    <p>支付宝</p></li>
                </ul>
              </div>
              <!-- 文章标签 -->
              <div class="post-tags">
                <i class="iconfont iconcategory"></i>
                <span @click="goCategory(articleData.cate)">{{ cateName }}</span>
              </div>
            </footer>
          </section-title>
          <div class="tags-box">
            <div class="tag-item" v-for="item in articleData.tags">{{ item.name }}</div>
          </div>
          <!--声明-->
          <div class="open-message" v-if="articleData.reprint">
            <p>著名：如侵犯您的版权，请
              <router-link to="/about#Guestbook">留言</router-link>
              回复原文章的地址，我们会给您删除此文章，给您带来不便请您谅解！
            </p>
            <p>转载：- <a :href="articleData.reprint">{{ articleData.article_title }}</a></p>
          </div>

          <section class="related-post" v-if="relatedPost.length>0">
            <h3 class="related-title">相关文章</h3>
            <ul>
              <router-link :to="`/article/${item.id}`" tag="li" v-for="item in relatedPost" :key="item.id">
                {{ item.article_title }}
              </router-link>
            </ul>
          </section>


          <div class="an-t">Welcome To MG'blog !</div>
          <!--评论-->
<!--          <div id="gitalk-container"></div>-->

          <div class="comments">
            <div class="comments-head">
              <h2 class="comments-h-t">
                <i class="el-icon-edit-outline"></i>
                文章评论 ({{ commentsCount }})
              </h2>
              <comment-message-editor :key="comKey" style="font-size: 13px;line-height: 20px" :inline="false"
                                      buttonText="提交"
                                      @focus=""
                                      @submit="toSubmitComment"
              ></comment-message-editor>
            </div>
            <comment v-for="item in comments" style="font-size: 13px;line-height: 20px" :key="item.comment.id"
                     :comment="item.comment" :articleTitle="article_title" @reply="replyComment">
              <template v-if="item.reply.length">
                <comment v-for="reply in item.reply" @reply="replyComment" style="font-size: 13px;line-height: 20px"
                         :key="reply.comment.id"
                         :comment="reply.comment" :articleTitle="article_title"></comment>
              </template>
            </comment>
          </div>
        </article>
      </main>
    </div>
  </div>
</template>

<script>
import Banner from '@/components/banner'
import sectionTitle from '@/components/section-title'
import comment from '@/components/comment'
import menuTree from '@/components/menu-tree'
import commentMessageEditor from 'comment-message-editor'
import {dirArticle, getArticleDetail, getCommentsCreate, getCommentsList} from "../api/article";
import {marked} from 'marked';
import hljs from "highlight.js"
// https://highlightjs.org/static/demo/
import 'highlight.js/styles/base16/atelier-forest-light.css'
import MkMdEditor from "../components/md-editor";
import 'gitalk/dist/gitalk.css'
import Gitalk from 'gitalk'

export default {
  name: 'articles',
  watch: {
    '$route.params.id': function (id) {
      let arId = id
      this.article_id = id
      this.getDataDetail(arId)
      this.getComment(arId)
    },
    'articleData.article_content': function () {
      this.$nextTick(() => {
        if (this.articleData.editType === 'mce') {
          //延时 解决 v-html 取不到dom
          setTimeout(() => {
            const template = this.$refs.temp
            let blocks = template.querySelectorAll("pre code");
            blocks.forEach((block) => {
              //高亮
              hljs.highlightBlock(block);
            });
          }, 100)
        }
      })
    }
  },
  data() {
    return {
      comKey: 1,
      curLink: '',
      article_id: '',
      article_title: '-',
      showDonate: false,
      commentsCount: 0,
      comments: [],
      menus: [],
      relatedPost: [],
      articleData: {},
      cateName: '',
      currImgUrl: '',
      isShowImg: false,
      giTalk: null
    }
  },
  components: {
    MkMdEditor,
    Banner,
    sectionTitle,
    comment,
    menuTree,
    commentMessageEditor,
  },
  methods: {
    //初始化gittalk
    initGitTalk(article) {
      this.giTalk = new Gitalk({
        clientID: '2464910a5ab725227b64',
        clientSecret: 'a8aa10755bd2e4ab4b6d88a9a4ae153a1d8dbdfe',
        repo: "MG-blog",
        owner: 'ZHYI-source',
        admin: ['ZHYI-source'],//如果此仓库有多个开发中，以数组的格式加入
        perPage: 15, //每次加载的数据大小，最多 100。
        title: `关于【${article.article_title}】 评论`,
        labels: [article.cate.name || '-'],//Default: ['Gitalk'].GitHub issue 的标签。
        id: this.article_id,  //用于标记评论是哪个页面的，确保唯一，并且长度小于50
        distractionFreeMode: true,  // 类似Facebook评论框的全屏遮罩效果.
        pagerDirection: 'last', //评论排序方式， last为按评论创建时间倒叙，first为按创建时间正序。
      })
      this.giTalk.render('gitalk-container')
    },
    //提交回复
    replyComment(val) {
      this.getComment(val)
    },
    //提交评论
    toSubmitComment(val) {
      let p = {
        article_id: this.article_id,//文章id
        article_title: this.article_title,//文章id
        pid: 0,//父级id
        from_userId: '1',//用户ID
        from_username: 'Jake',//用户名称
        from_user_logo: 'https://s1.ax1x.com/2023/01/11/pSnKiH1.png',//用户头像
        content: val,//评论内容
        to_userId: '',//回复对象ID
        to_username: '',//回复对象名称
        to_user_logo: '',//回复对象头像
      }
      getCommentsCreate(p).then(res => {
        this.$message({
          message: '评论成功！',
          type: 'success'
        });
        this.comKey += 1
        this.getComment(this.article_id)
      })
    },
    goCategory(val) {
      localStorage.removeItem("category");
      localStorage.setItem("category", JSON.stringify(val));
      this.$router.push({name: 'category', params: {cateId: val.cateId, cate: val.name}});
    },
    markdownToHtml(val) {
      return marked(val);
    },
    getDataDetail(id) {
      getArticleDetail(id).then(article => {
        this.articleData = article || {}
        this.article_title = article.article_title
        this.cateName = this.articleData.cate.name
        let query = {
          //查询推荐并且按是否顶置排序查询
          params: {
            sort_id: article.sort_id
          },
          limit: 20,//每页条数
          offset: 1,//当前页
          sort: {
            prop: 'createdAt',
            order: 'desc',
          }
        }
        dirArticle(query).then(resAt => {
          this.relatedPost = resAt.data.filter(e => {
            if (e.id !== article.id) return e
          }) || []
        })
      })
    },

    // 预览解析的图片  $event.target.currentSrc为base64的图片地址
    previewImg($event) {
      if ($event.target.currentSrc) {
        this.currImgUrl = $event.target.currentSrc
        window.open(this.currImgUrl, '_blank')
      }
    },

    //加载文章评论
    getComment(id) {
      let p = {
        params: {
          article_id: id,
        }
      }
      getCommentsList(p).then(res => {
        this.commentsCount = res.count
        let params = res.data || []
        const initTree = (parentId) => {
          const child = params.filter(item => item.pid == parentId)
          return child.map(item => ({
            comment: {...item},
            reply: initTree(item.id)
          }))
        }
        this.comments = initTree(0).sort((a, b) => {
          return new Date(b.comment['createdAt']).getTime() - new Date(a.comment['createdAt']).getTime();
        })
      }).catch(err => {
        console.log(err)
      })
    },
    fetchH(arr, left, right) {
      if (right) {
        return arr.filter(item => item.offsetTop > left && item.offsetTop < right)
      } else {
        return arr.filter(item => item.offsetTop > left)
      }
    },

    // 生成目录
    createMenus() {
      let arr = []
      for (let i = 6; i > 0; i--) {
        let temp = []
        let e = document.querySelector(".md-edit").querySelectorAll(`h${i}`)
        for (let j = 0; j < e.length; j++) {
          let child = this.fetchH(arr, e[j].offsetTop, (j + 1 === e.length) ? undefined : e[j + 1].offsetTop)
          temp.push({
            h: i,
            title: e[j].innerText,
            id: e[j].id,
            offsetTop: e[j].offsetTop,
            child
          })
        }
        if (temp.length) {
          arr = temp
        }
      }
      this.menus = arr
    }
  },
  created() {
    let arId = this.$route.params.id
    this.article_id = this.$route.params.id
    this.getDataDetail(arId)
    this.getComment(arId)
  },
  mounted() {
    // this.createMenus()
    this.curLink = window.location.href
    window.scroll(0, 0)


  },

}
</script>
<style scoped lang="less">
.site-content {
  position: relative;

  .site-main {
    padding: 80px 0 0 0;
  }
}

#article-menus {
  position: sticky;
  top: 0;
  box-shadow: 0 2px 6px rgba(0, 0, 0, .1);
  border-radius: 3px;
  padding: 15px;
  width: 300px;
  transform: translateX(-120%) translateY(150px);
  font-size: 14px;
}

article.hentry {

  .entry-header {
    .entry-title {
      font-size: 23px;
      font-weight: 600;
      color: #737373;
      margin: 0.67em 0;

      &:before {
        content: "#";
        margin-right: 6px;
        color: #d82e16;
        font-size: 20px;
        font-weight: 600;
      }
    }

    hr {
      height: 1px;
      border: 0;
      background: #EFEFEF;
      margin: 15px 0;
    }

    .breadcrumbs {
      font-size: 14px;
      color: #D2D2D2;
      text-decoration: none;
      margin-bottom: 30px;

    }
  }

  .tags-box {
    display: flex;
    margin-top: 8px;
    font-size: 13px;
    flex-wrap: wrap;
    margin-bottom: 15px;
  }

  .tag-item {
    border: 1px solid #eee;
    padding: 5px;
    border-radius: 5px;
    margin: 0 5px;
  }

  .entry-content {
    font-family: -apple-system, system-ui, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, sans-serif, BlinkMacSystemFont, Helvetica Neue, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial !important;
  }

  footer.post-footer {
    width: 100%;
    padding: 20px 10px;
    margin-top: 30px;
    height: 65px;
    position: relative;

    i {
      font-size: 18px;
      margin-right: 5px;
    }

    .post-like {
      float: right;
      margin: 7px 0 0 20px;
    }

    .post-share {
      float: right;
      list-style: none;
      margin-right: 20px;
    }

    .donate {
      float: left;
      line-height: 36px;
      border-radius: 100%;
      -webkit-border-radius: 100%;
      -moz-border-radius: 100%;
      border: 1px solid #2B2B2B;


      &:hover {
        border: 1px solid goldenrod;

        span {
          color: goldenrod;
        }
      }

      span {
        color: #2B2B2B;
        padding: 10px;
        position: relative;
        cursor: pointer;
      }

      .donate_inner {
        display: none;
        margin: 0;
        list-style: none;
        position: absolute;
        left: 80px;
        top: -40px;
        background: #FFF;
        padding: 10px;
        border: 1px solid #ddd;
        box-shadow: 0 2px 6px rgba(0, 0, 0, .08);
        border-radius: 3px;

        &.show {
          display: block;
        }

        li {
          float: left;
        }

        img {
          width: 100px;
        }

        p {
          text-align: center;
          font-size: 15px;
          color: #D2D2D2;
          line-height: 1rem;
        }
      }

      .donate_inner:after, .donate_inner:before {
        content: "";
        position: absolute;
        left: 0;
        bottom: 45%;
        margin-left: -8px;
        border-top: 8px solid transparent;
        border-bottom: 8px solid transparent;
        border-right: 8px solid #fff;
      }

      .donate_inner:before {
        left: -1px;
        border-right: 8px solid #ddd;
      }

    }

    .post-tags {
      margin: 7px 0 0 20px;
      float: left;
      text-transform: uppercase;

      a:hover {
        color: #ff6d6d;
      }
    }
  }

  .open-message {
    margin: 50px 0;
    position: relative;
    background: #2B2B2B;
    padding: 10px 30px;
    border-radius: 3px;
    font-size: 14px;
    color: #fff;

    &:after {
      content: "";
      border-left: 10px solid transparent;
      border-right: 10px solid transparent;
      border-bottom: 10px solid #2B2B2B;
      position: absolute;
      top: -8px;
      left: 48%;
    }

    p {
      margin: 10px 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    a {
      color: #A0DAD0;
      padding: 0 5px;
    }
  }
}

.comments-head {
  border-top: 1px dashed #ECECEC;
  padding: 15px 0;
  padding-left: 10px;
  margin-bottom: 25px;

  .comments-h-t {
    line-height: 40px;
    padding-bottom: 10px;
    font-size: 15px;

  }
}

/******/
@media (max-width: 800px) {
  .site-content .site-main {
    padding: 30px 0 0 0;
  }

  .an-t {
    display: none;
  }

}

.an-t {
  text-align: center;
  margin: 0px auto;
  font-size: 3rem;
  font-family: arial;
  font-weight: 900;
  color: transparent;
  overflow: hidden;
  line-height: initial;
  -webkit-text-stroke: 2px white;
  background-size: 20px 20px, 20px 20px, 1px 1px;
  background-position: 0 0, 0 0, 0 0;
  -webkit-background-clip: text;
  animation: bg-shift 1s ease-in-out infinite alternate-reverse, swing 2s ease-in-out infinite;
  background: linear-gradient(45deg, #e25c5c, #2b2828, #e25c5c);
  -webkit-text-fill-color: transparent;
  -webkit-background-clip: text;
}

@keyframes bg-shift {
  from {
    background-position: 0 50px;
  }
}

@keyframes swing {
  0% {
    transform-origin: top;
    transform: perspective(550px) rotatex(55deg);
  }

  50% {
    transform: perspective(550px) rotatex(-55deg);
  }

  100% {
    transform-origin: top;
    transform: perspective(550px) rotatex(55deg);

  }
}

.an-t::before {
  content: "Welcome To MG'blog !";
  position: absolute;
  background: linear-gradient(transparent 30%, white, transparent 70%);
  -webkit-background-clip: text;
  -webkit-text-stroke: 1px #efe7b0;
  animation: bg-shift2 2s ease-in-out infinite alternate-reverse;
}

@keyframes bg-shift2 {
  0% {
    background-position: 0 50px;
  }

  50% {

    background-position: 0 -50px;

  }

  100% {
    background-position: 0 50px;
  }
}
.related-post {
  padding: 2rem 0;
  background-color: #f0f2f5;

  .related-title {
    font-weight: bold;
    padding-left: 10px;
    padding-bottom: 1rem;
    color: #363636;
  }

  ul {
    list-style-type: circle;
    padding-left: 30px;

    li {
      cursor: pointer;
      transition: all .3s linear;
      padding-right: 20px;
      letter-spacing: .1rem;
      line-height: 1.8rem;
      font-size: 13px;
      /*text-emphasis: dot;*/
      /*-webkit-text-emphasis-position: under right;*/
      /*text-emphasis-position: under right;*/

      &:hover {
        color: crimson;
      }
    }
  }
}

</style>
<style>
.gt-container .gt-comment-date, .gt-container .gt-comment-text {
  font-size: 12px;
}

.gt-container .markdown-body {
  font-size: 13px !important;
}

.gt-container .gt-header-controls-tip {
  font-size: 12px;
}
</style>
