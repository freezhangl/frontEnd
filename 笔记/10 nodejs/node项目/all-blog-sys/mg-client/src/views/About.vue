<template>
  <div class="about">
    <div class="site-content grid-line">
      <div class="content-warp">
        <div class="about-site about-info">
          <section-title><span class="iconfont icon-wodeshuiguoicon-"></span>关于博主</section-title>
          <div class="info-card" v-for="item in aboutUser" :key="item.id">
            <mk-md-editor class="md-edit" mode="preview" v-model="item.about_content"/>
          </div>
        </div>
        <div class="about-me about-info">
          <section-title id="Guestbook"><span class="iconfont icon-wodeshuiguoicon-"></span>给我私信</section-title>
          <div class="info-card">
            <el-form :model="ruleForm" v-loading="loading" :rules="rules" ref="ruleForm" label-width="80px"
                     class="demo-ruleForm">
              <el-form-item label="邮箱" prop="email">
                <el-input v-model="ruleForm.email"
                          maxlength="32"
                          show-word-limit></el-input>
              </el-form-item>
              <el-form-item label="内容" prop="content">
                <el-input type="textarea" v-model="ruleForm.content"
                          maxlength="255"
                          show-word-limit></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" size="mini" @click="submitForm('ruleForm')">提交</el-button>
                <el-button size="mini" @click="resetForm('ruleForm')">重置</el-button>
              </el-form-item>
              <el-form-item>
                <p>🤸‍♀️🤸‍♂️邮箱只是作为博主回复私信渠道</p>
                <p>🤸‍♀️🤸‍♂️您的私信不会展示在这里，只有博主会看到...</p>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <div class="about-me about-info">
          <section-title id="Guestbook1"><span class="iconfont icon-wodeshuiguoicon-"></span>在线留言（💬{{ messageCount }}）
          </section-title>
          <div class="info-card">
            <div class="site-text">
              🌏MG′blog 留言板
            </div>
            <!--            <p class="tips">留言暂不支持回复，如需回复请私信我哦</p>-->
            <div>
              <el-input v-model="userEmail" placeholder="邮箱" style="margin-bottom: .5rem"></el-input>
              <comment-message-editor style="font-size: 13px;line-height: 20px"
                                      :inline="false"
                                      :key="tempKey"
                                      buttonText="提交"
                                      @focus=""
                                      @submit="toSubmitMessage"
              ></comment-message-editor>
            </div>
            <div class="message-board">

              <el-timeline v-if="messageList.length>0">
                <el-timeline-item
                  v-for="(item,index) in messageList"
                  :key="item.index"
                  :timestamp="item.publishTime | parseTime"
                  placement="top">
                  <el-card>

                    <div class="mes-info" :class="{'mes-info-isadmin':item.isAdmin}"
                         v-html="item.content"></div>
                    <p class="mes-user" v-if="item.isAdmin"><span title="查看管理员主页"><a target="_blank"
                                                                                     href="https://gitee.com/Z568_568">👷‍♂️【管理员】</a></span>
                      提交于 {{ item.createdAt }}</p>
                    <p class="mes-user" v-if="!item.isAdmin">👨‍🔬{{ item.nickname }} 提交于 {{ item.createdAt }}</p>
                  </el-card>
                </el-timeline-item>
                <!--加载更多-->
                <div class="more" v-if="hasNextPage">
                  <div class="more-btn" @click="loadMore">More</div>
                </div>
              </el-timeline>
              <el-empty description="暂无留言" v-else></el-empty>
            </div>
          </div>
        </div>
        <div class="dialog" v-if="show">
          <div><i class="el-icon-info"></i>{{ msg }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import sectionTitle from '@/components/section-title'
import {getMessageCreate} from "../api/friends";
import {dirAboutList} from "../api/website";
import MkMdEditor from "../components/md-editor";
import commentMessageEditor from 'comment-message-editor'
import {websiteMessageCreate, websiteMessageList} from "../api/website.message";
import {formatTime} from "../utils";

export default {
  name: "About",
  data() {
    return {
      tempKey: 0,
      aboutUser: [],
      list: [],
      messageList: [],
      content: '',
      loading: false,
      show: false,
      hasNextPage: false,
      messageCount: 0,
      msg: '提示信息',
      query: {
        //查询推荐并且按是否顶置查询
        params: {},
        limit: 10,//每页条数
        offset: 1,//当前页
        sort: {
          prop: 'createdAt',
          order: 'desc',
        }
      },
      userEmail: '',
      ruleForm: {
        email: '',
        content: ''
      },
      rules: {
        email: [
          {required: true, message: '请输入邮箱地址', trigger: 'blur'},
          {type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change']}
        ],
        content: [
          {required: true, message: '请输入您的留言内容', trigger: 'blur'}
        ]
      }
    }
  },
  components: {
    MkMdEditor,
    commentMessageEditor,
    sectionTitle
  },
  created() {
    this.getAboutUser()
    this.getMessageData()
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true
          getMessageCreate(this.ruleForm).then(res => {
            this.loading = false
            this.show = true
            this.msg = '留言成功,博主会以邮件回复你哦！'
            setTimeout(() => {
              this.show = false
            }, 3000)
            this.$refs['ruleForm'].resetFields();
          }).catch(err => {
            this.show = true
            this.msg = '网络错误！'
            setTimeout(() => {
              this.show = false
            }, 1300)
            this.loading = false
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    getAboutUser() {
      dirAboutList().then(res => {
        this.aboutUser = res.data
      })
    },
    loadMore() {
      this.query.offset += 1
      this.getMessageData(true)
    },

    getMessageData(more) {
      websiteMessageList(this.query).then(res => {
        let datas = res.data
        for (const data of datas) {
          data.publishTime = data.createdAt
          data.createdAt = formatTime(new Date(data.createdAt).getTime(), '')
        }
        if (more) {
          for (const data of datas) {
            this.messageList.push(data)
          }
        } else {
          this.messageList = datas
        }

        this.hasNextPage = this.messageList.length < res.count
        this.messageCount = res.count
      })
    },
    //提交评论
    toSubmitMessage(val) {
      if (!this.userEmail) return this.$message({
        message: '邮箱不能为空！',
        type: 'error'
      });

      let R = /^\w+((.\w+)|(-\w+))@[A-Za-z0-9]+((.|-)[A-Za-z0-9]+).[A-Za-z0-9]+$/
      if (!R.test(this.userEmail)) {
        return this.$message({
          message: '邮箱格式错误！',
          type: 'error'
        });
      }
      if (!val) return this.$message({
        message: '内容不能为空！',
        type: 'error'
      });
      let p = {
        content: val,
        email: this.userEmail,
        img: 'https://xsgames.co/randomusers/assets/avatars/male/24.jpg',
        isAdmin: false,
        nickname: 'Ned Himmelsbach'
      }
      websiteMessageCreate(p).then(res => {
        this.$message({
          message: '留言成功！',
          type: 'success'
        });
        this.tempKey += 1
        this.getMessageData()
      }).catch(err => {
        this.$message({
          message: '留言失败！',
          type: 'error'
        });
      })
    },
  },

}
</script>
<style scoped lang="less">
.about {
  padding-top: 40px;
}

.content-warp {
  margin-top: 80px;

  .about-info {
    margin: 30px 0;

    span {
      color: red;
      margin-right: 10px;
    }

    .info-card {
      min-height: 100px;
      padding: 20px;
      border-radius: 3px;
      margin: 30px 0 50px 0;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

      p {
        line-height: 1.7rem;
      }

      .tips {
        font-size: .5rem;
        line-height: 1rem;
        padding-bottom: .8rem;
        padding-left: 1rem;
      }

      .site-text {
        font-size: 0.9rem;
        font-weight: bold;
        margin-bottom: 15px;
      }

      .message-board {
        margin-top: 30px;

        .mes-info {
          padding: 8px;
          padding-bottom: 15px;
          line-height: 24px;


        }

        .mes-user {
          border-top: 1px dashed #eee;
          padding: 5px 5px 0 5px;
          font-size: 12px;
          color: #CCCCCC;
          display: flex;
          justify-content: flex-start;
          align-items: center;

          span {
            color: #ff6d6d;
            margin-right: 1px;

            &:hover {
              color: #faa8a8;
            }
          }
        }
      }
    }
  }

  .contactForm {
    width: 100%;
    padding: 20px;

    .form-item {
      align-items: center;
      display: flex;

      &:not(:last-child) {
        margin-bottom: 20px;
      }

      label {
        width: 80px;
      }

      .v {
        min-height: 40px;
        line-height: 20px;
        border-radius: 3px;
        padding: 2px 10px;
        outline: none;
        border: 1px solid #8fd0cc;
        width: 100%;
        resize: vertical;
      }

      button {
        width: 100px;
        height: 40px;
        border-radius: 3px;
        outline: 0;
        border-style: none;
        cursor: pointer;
        background-color: #409eff;
        color: white;

        &:hover {
          opacity: 0.8;
        }
      }
    }
  }
}

/*******/
@media (max-width: 800px) {
  .content-warp {
    margin-top: 0;
  }
}
</style>
<style lang="less">
.mes-info {
  font-size: 14px;
  //font-family: miranafont, "Hiragino Sans GB", STXihei, "Microsoft YaHei", SimSun, sans-serif !important;

  span, p, div {
    font-size: inherit !important;
    font-family: inherit !important;
  }

  &-isadmin {
    color: rgb(220 3 3);

    span, p, div {
      color: inherit !important;
      font-size: inherit !important;
    }
  }

  pre {
    overflow: auto;
    padding: 5px;
    border-radius: 5px;
  }
}

.dialog {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #fff;
  padding: 20px;
  border-radius: 5px;
  font-size: 13px;
  transition: all .5s ease-in-out;
  background: #bdc3c7;
  background: -webkit-linear-gradient(to right, #b5babf, #bdc3c7);
  background: linear-gradient(to right, #b5babf, #bdc3c7);

  .el-icon-info {
    margin-right: 5px;
  }

}

.more {
  margin: 50px 0;

  .more-btn {
    width: 100px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    color: #ADADAD;
    border: 1px solid #ADADAD;
    border-radius: 20px;
    margin: 0 auto;
    cursor: pointer;

    &:hover {
      color: #8fd0cc;
      border: 1px dashed #8fd0cc;
    }
  }
}

</style>
