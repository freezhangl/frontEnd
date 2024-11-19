<template>
  <div class="notification-announcement">
    <div class="header">
      <el-tabs
        v-model="tabSelected"
        @tab-click="handleClick">
        <el-tab-pane name="notice">
          <span slot="label">
            <el-badge
              :value="naticeTotal < 100 ? naticeTotal : '99+'">
              重要通知
            </el-badge>
          </span>
        </el-tab-pane>
        <el-tab-pane name="announcement">
          <span slot="label">
            <el-badge
              :value="announcementTotal < 100 ? announcementTotal : '99+'">
              系统公告
            </el-badge>
          </span>
        </el-tab-pane>
      </el-tabs>
      <span class="more" @click="more">
        更多
        <i class="el-icon-arrow-right"></i>
      </span>
    </div>
    <div class="main" v-if="dataList.length">
      <div v-show="tabSelected === 'notice'" class="data-list">
        <div class="list-item" v-for="item in dataList" :key="item.id">
          <div class="item-content" ref="notice">
            <!-- <img class="topIcon" v-if="item.topFlag === 1" src="../../assets/svg/zhiding.svg"> -->
            <i class="topIcon svgfont-zhiding" v-if="item.topFlag === 1"></i>
            <el-link :underline="false" @click="clickAnnunceItem(item)">
              <!--原：跳转到通知详情@click="noticeDetail(item)-->
              <el-tooltip
                :disabled="!item.showToolTip"
                :content="item.announcementTitle"
                effect="dark"
                placement="top">
                <span class="title">{{item.announcementTitle}}</span>
              </el-tooltip>
            </el-link>
          </div>
          <div class="item-date">
            <span>{{item.validStartDate | formatDate('YYYY-MM-DD HH:mm:ss')}}</span>
          </div>
        </div>
      </div>
      <div v-show="tabSelected === 'announcement'" class="data-list">
        <div class="list-item" v-for="item in dataList" :key="item.id">
          <div class="item-content" ref="announcement">
            <i class="topIcon svgfont-zhiding" v-if="item.topFlag === 1"></i>
            <el-link :underline="false" @click="clickAnnunceItem(item)">
              <el-tooltip
                v-if="item.showToolTip"
                :content="item.announcementTitle"
                effect="dark"
                placement="top">
                <span class="title">{{item.announcementTitle}}</span>
              </el-tooltip>
              <span v-else class="title">{{item.announcementTitle}}</span>
            </el-link>
          </div>
          <div class="item-date">
            <span>{{ item.validStartDate | formatDate('YYYY-MM-DD HH:mm:ss')}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="no-data" v-else>
      <div>暂无数据</div>
    </div>
  </div>
</template>

<script>
import API from '../../serve/index'
// import { announcement } from '../../serve/mockData'
import { formatDate, isShowToolTip } from '@lib/common/util/common'
export default {
  name: 'notificationAnnouncement',
  data () {
    return {
      tabSelected: 'notice', //选中的tab
      naticeTotal: 0, //重要通知数量
      announcementTotal: 0, //系统公告数量
      dataList: [], //数据列表
      page: {
        pageNum: 1,
        pageSize: 10
      }
    }
  },

  methods: {
    //更多
    more () {
      if (this.tabSelected === 'notice') {
        this.$router.push({ path: '/home/userAnnouncement', query: { type: '2' } })
        // this.$router.push({ name: 'userAnnounceList', params: { type: '2' } })
      } else {
        this.$router.push({ path: '/home/userAnnouncement', query: { type: '1' } })
        // this.$router.push({ name: 'userAnnounceList', params: { type: '1' } })
      }
    },
    //tab切换
    handleClick (tab) {
      this.tabSelected = tab.name
      this.dataList = []
      if (this.tabSelected === 'notice') {
        this.getNoticeList()
      } else {
        this.getAnnouncementList()
      }
    },
    //获取重要通知数量
    getNoticeNum () {
      API.getNoticeNum()
        .then(res => {
          // console.log(res)
          this.naticeTotal = res
        })
        .catch(err => {
          this.$message({
            message: err.message || '服务器异常，请稍后再试！',
            type: 'error',
            showClose: true
          })
        })
    },
    //获取重要通知列表
    getNoticeList () {
      let params = {}
      params.pageSize = this.page.pageSize
      params.pageNum = this.page.pageNum
      params.announcementTypeCode = '2' // 重要通知
      API.getUserAnnouncement(params)
        .then(res => {
          if (res && res.records) {
            this.dataList = res.records
          } else {
            this.dataList = []
          }
          if (this.dataList.length) {
            this.$nextTick(() => {
              let width = this.$refs.notice[0].offsetWidth
              // console.log('notice', this.$refs.notice, 'width', width)
              this.dataList.forEach(ele => {
                // let width = this.$refs['item-content'][0].offsetWidth
                let show = isShowToolTip(ele.announcementTitle, width - 20)
                this.$set(ele, 'showToolTip', show)
              })
            })
          }
        })
        .catch(err => {
          if (err.selfError) return
          this.$message({
            message: err.message || '服务器异常，请稍后再试！',
            type: 'error',
            showClose: true
          })
        })
    },
    //获取系统公告数量
    getAnnouncementNum (type) {
      API.getUserAnnouncementNum(type)
        .then(res => {
          if (type === '1') {
            this.announcementTotal = res
          } else {
            this.naticeTotal = res
          }
        })
        .catch(err => {
          if (err.selfError) return
          this.$message({
            message: err.message || '服务器异常，请稍后再试！',
            type: 'error',
            showClose: true
          })
        })
    },
    //获取系统公告列表
    getAnnouncementList () {
      let params = {}
      params.pageSize = this.page.pageSize
      params.pageNum = this.page.pageNum
      params.announcementTypeCode = '1' // 系统公告
      API.getUserAnnouncement(params)
        .then(res => {
          if (res && res.records) {
            this.dataList = res.records
          } else {
            this.dataList = []
          }
          if (this.dataList.length) {
            this.$nextTick(() => {
              // console.log('announcement', this.$refs.announcement)
              // let width = this.$refs.announcement.offsetWidth
              let width = this.$refs.announcement[0].offsetWidth
              this.dataList.forEach(ele => {
                // let width = this.$refs['item-content'][1].offsetWidth
                let show = isShowToolTip(ele.announcementTitle, width - 20)
                this.$set(ele, 'showToolTip', show)
              })
            })
          }
        })
        .catch(err => {
          if (err.selfError) return
          this.$message({
            message: err.message || '服务器异常，请稍后再试！',
            type: 'error',
            showClose: true
          })
        })
    },
    clickAnnunceItem (row) {
      let newPage = this.$router.resolve({
        path: `/home/userAnnouncement/userAnnounceDetail/${row.id}`
      })
      window.open(newPage.href, '_blank')
    },
    //跳转通知详情
    noticeDetail (row) {
      let param = [row.id]
      API.updatedNoticeReadFlag(param)
        .then(res => {
          if (res === 1) {
            this.$message({
              message: '标记已读成功',
              type: 'success',
              showClose: true
            })
            this.getNoticeNum()
            this.getNoticeList()
          }
        })
        .catch(err => {
          if (err.selfError) return
          this.$message({
            message: err.message || '服务器异常，请稍后再试！',
            type: 'error'
          })
        })
      let newPage = this.$router.resolve({
        // name: 'importantNoticeDetail',
        path: `/home/importantNotice/importantNoticeDetail`,
        query: {
          noticeTitle: row.noticeTitle,
          sendDate: row.sendDate,
          noticeContent: row.noticeContent
        }
      })
      window.open(newPage.href, '_blank')
      // console.log('href', newPage)
    }
  },

  mounted () {
    // this.getNoticeNum()
    // 获取系统公告数量
    this.getAnnouncementNum('1')
    // 获取重要通知数量
    this.getAnnouncementNum('2')
    this.getNoticeList()
  }
}
</script>

<style lang="scss" scoped>
.notification-announcement {
  .header {
    display: flex;
    justify-content: space-between;
    flex-wrap: nowrap;
    align-items: center;
    height: 43px;
    background: $color-background-normal;
    padding: 0 20px;
    border-radius: 4px 4px 0 0;
    .el-tabs {
      height: 100%;
      /deep/ .el-tabs__header {
        line-height: 43px;
        margin: 0;
        .el-tabs__nav-wrap {
          box-sizing: content-box;
          &::after {
            height: 0;
          }
          .el-tabs__nav {
            padding-right: 50px;
            .el-badge {
               font-weight: 700;
            }
            .el-badge__content.is-fixed {
              top: 15px;
              right: -5px;
            }
          }
        }
      }
    }
    .more{
      cursor: pointer;
      font-weight: normal;
      font-size: 14px;
      color: #9D9D9D;
      .el-icon-arrow-right:before {
        font-size: 10px;
        padding-left: 3px
      }
    }
  }
  .main {
    padding: 16px 20px;
    height: 254px;
    box-sizing: border-box;
    .data-list{
      height: 100%;
      overflow-y: auto;
      .list-item {
        display: flex;
        justify-content: space-between;
        flex-wrap: nowrap;
        height: 20px;
        line-height: 20px;
        padding: 6px 0;
        .item-content {
          // max-width: 294px;
          width: calc(100% - 135px);
          position: relative;
          .topIcon{
            font-size: 14px;
            position: absolute;
            left: 0;
            width: 14px;
            height: 14px;
            top: 0;
            @include color();
          }
          .el-link {
            /*width: 100%;*/
            justify-content: flex-start;
            .el-icon-top {
              color: $color-main;
            }
            margin-left: 18px;
            width: calc(100% - 20px);
            /deep/ .el-link--inner {
              width: 100%;
            }
            .title{
              width: 100%;
              display: inline-block;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              text-align: left;
            }
          }
        }
        .item-date {
          width: 120px;
          margin-right: 10px;

          font-size: 12px;
          color: #999999;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }
  .no-data {
    height: 255px;
    line-height: 255px;
    font-size: 14px;
    color: #999999;
    text-align: center;
  }
}
</style>
