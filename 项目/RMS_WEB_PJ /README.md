## 项目说明
- 集中研发项目管理系统-项目全生命周期管理

### 项目启动调试
RMS_WEB_PJ_EXT --------> PJ  
RMS_WEB_MAIN ------> MAIN  
以下简称以上两个工程为PJ和MAIN
- 步骤
```
在PJ工程中执行** npm link **
在MAIN工程中执行 ** npm link @rms/rms-pjclient **
在PJ工程中执行 ** npm run dev **
在MAIN工程中执行 ** npm run dev **