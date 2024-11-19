<template>
  <div class="DSTeamInfoEdit">
    <project-panel title="团队信息">
      <template v-slot:header>
        <el-button class="normal-btn" @click="tempSave">保存本区块信息</el-button>
      </template>
      <div class="body-con">
        <!-- 需求单位 -->
        <project-panel title="需求单位" :show-expand='false' class="addcon">
          <template v-slot:header>
            <el-button
              class="normal-btn"
              @click="addCoopDemandUnit"
              icon="el-icon-circle-plus-outline"
            >添加配合需求单位</el-button>
          </template>
          <el-form
            :model="demandLeadForm"
            :rules="demandLeadFormRules"
            label-position='right'
            ref="demandLeadForm"
            label-width="100px">
            <el-row>
              <el-col :span="7">
                <el-form-item
                  label-width="110px"
                  label="牵头需求单位:"
                  prop="organizationCode">
                  <el-tooltip
                    effect="dark"
                    :content="demandLeadForm.organizationName"
                    placement="top-start"
                    size="small"
                    :disabled="!demandLeadForm.organizationName">
                    <el-select
                      v-model="demandLeadForm.organizationCode"
                      placeholder="请选择"
                      @change="changeLeadDemandUnit"
                      :disabled="demandLeadForm.unitDisabled">
                      <el-option
                        v-for="item in leadDemandUnitOptions"
                        :key="item.id"
                        :label="item.organizationName"
                        :value="item.organizationCode"
                        :disabled="item.disabled"
                      ></el-option>
                    </el-select>
                  </el-tooltip>
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item
                  label="项目经理:"
                  prop="leadManager">
                  <div class="row-item" :class="{'error':lDProjectManagerValidSuc}">
                    <div class="tag-wrapper">
                      <template v-if="demandLeadForm.leadManager.userAccount">
                        <el-tag
                          closable
                          @close="deletePerson(0,'demandLeadManager')">
                          <el-tooltip
                            class="item"
                            effect="dark"
                            :content="demandLeadForm.leadManager.userAccount"
                            placement="top-start"
                            size="small">
                            <span> {{ demandLeadForm.leadManager.userName }}</span>
                          </el-tooltip>
                        </el-tag>
                      </template>
                      <span v-else class="placeholder">请选择</span>
                    </div>
                    <span class="add-icon svgfont-adduser" @click="addPerson('demandLeadManager')"></span>
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item
                  label="项目成员:"
                  prop="demandLeadMembers">
                  <div class="row-item" :class="{'error':lDProjectMemberValidSuc}">
                    <div class="tag-wrapper">
                      <template v-if="demandLeadForm.demandLeadMembers.length">
                        <el-tag
                          v-for="(item,index) in demandLeadForm.demandLeadMembers"
                          :key="item.userAccount"
                          closable
                          @close="deletePerson(index,'demandLeadMembers')">
                          <el-tooltip
                            class="item"
                            effect="dark"
                            :content="item.userAccount"
                            placement="top-start"
                            size="small">
                            <span> {{ item.userName }}</span>
                          </el-tooltip>
                        </el-tag>
                      </template>
                      <span v-else class="placeholder">请选择</span>
                    </div>
                    <span class="add-icon svgfont-adduser" @click="addPerson('demandLeadMembers')"></span>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <el-form
            class="tableForm"
            ref="demandCoopForm"
            :model="demandCoopForm"
            :inline="true">
            <el-table :data="demandCoopForm.tableData" style="width: 100%" :border="false">
              <el-table-column
                type="index"
                label="序号"
                align="left"
                width="60px"
                :index="setIndexMethod">
              </el-table-column>
              <el-table-column
                align="left"
                prop="coopOrgCode"
                minwidth="150">
                <template slot="header">
                  <div class="required">
                    <span>配合需求单位</span>
                  </div>
                </template>
                <template slot-scope="scope">
                  <p v-if="scope.row.id!=='addid'">{{scope.row.organizationName}}</p>
                  <el-form-item
                    :prop="'coopOrgCode'+scope.$index"
                    v-if="scope.row.id=='addid'"
                    style="margin-right:0;margin-bottom:0"
                    :rules="setRulesDemand('organizationCode',scope.$index)">
                    <el-tooltip
                      effect="dark"
                      :content="scope.row.organizationName"
                      placement="top-start"
                      size="small"
                      :disabled="!scope.row.organizationName">
                      <el-select
                        v-model="scope.row.organizationCode"
                        placeholder="请选择"
                        clearable
                        @change="changeCoopDemandUnit($event,scope.$index)"
                        :disabled="scope.row.unitDisabled">
                        <el-option
                          v-for="item in coopDemandUnitOptions"
                          :key="item.id"
                          :label="item.organizationName"
                          :value="item.organizationCode"
                          :disabled="item.disabled"
                        ></el-option>
                      </el-select>
                    </el-tooltip>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column
                align="left"
                prop="coopManager"
                minwidth="150">
                <template slot="header">
                  <div class="required">
                    <span>项目经理</span>
                  </div>
                </template>
                <template slot-scope="scope">
                  <p v-if="scope.row.id!=='addid'">
                    <span v-for="user in scope.row.projectTeamList" :key="user.id">
                      <span v-if="user.projectRoleCode === 'PR-PARTNER-DEMAND-MANAGER'">
                        <el-tooltip
                          effect="dark"
                          :content="user.userAccount"
                          placement="top-start"
                          size="small"><span>{{user.userName}}</span></el-tooltip>
                      </span>
                    </span>
                    <!-- {{scope.row.cooperateDemandUnitProjectManger}} -->
                  </p>
                  <el-form-item
                    class="coop"
                    :prop="'coopManager'+scope.$index"
                    v-if="scope.row.id=='addid'"
                    style="margin-right:0;margin-bottom:0"
                    :rules="setRulesDemand('leadManager',scope.$index)">
                    <div class="row-item" :class="{'error':coopDemandManagerValidSuc}">
                      <div class="tag-wrapper">
                        <template v-if="scope.row.leadManager.userAccount">
                          <el-tag
                            closable
                            @close="deletePerson(0,'coopDemandManager')">
                            <el-tooltip
                              class="item"
                              effect="dark"
                              :content="scope.row.leadManager.userAccount"
                              placement="top-start"
                              size="small">
                              <span> {{ scope.row.leadManager.userName }}</span>
                            </el-tooltip>
                          </el-tag>
                        </template>
                        <span v-else class="placeholder">请选择</span>
                      </div>
                      <span class="add-icon svgfont-adduser" @click="addPerson('coopDemandManager',scope.$index,'coopDemandManager'+scope.$index)"></span>
                    </div>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column
                align="left"
                prop="coopDemandMember"
                min-width="200">
                <template slot="header">
                  <div class="required">
                    <span>项目成员</span>
                  </div>
                </template>
                <template slot-scope="scope">
                  <p v-show="scope.row.id!=='addid'">
                    <span v-for="(user,index) in scope.row.projectTeamList" :key="user.id">
                      <span v-if="user.projectRoleCode === 'PR-PARTNER-DEMAND-MEMBER'">
                        <el-tooltip
                          effect="dark"
                          :content="user.userAccount"
                          placement="top-start"
                          size="small"><span>{{user.userName}}</span></el-tooltip>
                        <span v-if="index<scope.row.projectTeamList.length-2">，</span>
                      </span>
                    </span>
                    <!-- {{item.label}}, -->
                  </p>
                  <el-form-item
                    class="xmcy"
                    :prop="'coopDemandMember'+scope.$index"
                    v-if="scope.row.id=='addid'"
                    style="margin-right:0;margin-bottom:0;width:100%"
                    :rules="setRulesDemand('coopDemandMember',scope.$index)">
                    <div class="row-item" :class="{'error':coopDemandMemberValidSuc}">
                      <div class="tag-wrapper">
                        <template v-if="scope.row.projectTeamList.length">
                          <el-tag
                            v-for="(item,index) in scope.row.projectTeamList"
                            :key="item.userAccount"
                            closable
                            @close="deletePerson(index,'coopDemandMember')">
                            <el-tooltip
                              class="item"
                              effect="dark"
                              :content="item.userAccount"
                              placement="top-start"
                              size="small">
                              <span> {{ item.userName }}</span>
                            </el-tooltip>
                          </el-tag>
                        </template>
                        <span v-else class="placeholder">请选择</span>
                      </div>
                      <span class="add-icon svgfont-adduser" @click="addPerson('coopDemandMember',scope.$index,'coopDemandMember'+scope.$index)"></span>
                    </div>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column
                prop="operation"
                label="操作"
                minwidth="100"
                align="center">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    v-if="scope.row.id=='addid'"
                    style="padding-left: 0;padding-right: 0 ;color: #0b82ff;background: 0 0;border-color: transparent;font-size: 14px;"
                    @click="coopDemandUnitAdd(scope.row)">完成</el-button>
                  <el-button size="mini" style="padding-left: 0;padding-right: 0 ;color: #0b82ff;background: 0 0;border-color: transparent;font-size: 14px;" @click="cooperateDemandUnitDel(scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form>
        </project-panel>
        <!-- 承担单位 -->
        <project-panel title="承担单位" :show-expand='false' class="addcon">
          <template v-slot:header>
            <el-button
              class="normal-btn"
              @click="addCoopUndertakeUnit"
              icon="el-icon-circle-plus-outline"
            >添加配合承担单位</el-button>
          </template>
          <el-form
            :model="undertakeLeadForm"
            :rules="undertakeLeadFormRules"
            label-position='right'
            ref="undertakeLeadForm"
            label-width="100px">
            <el-row>
              <el-col :span="7">
                <el-form-item
                  label-width="110px"
                  label="牵头承担单位:"
                  prop="organizationCode">
                  <el-tooltip
                    effect="dark"
                    :content="undertakeLeadForm.organizationName"
                    placement="top-start"
                    size="small"
                    :disabled="!undertakeLeadForm.organizationName">
                    <el-select
                      v-model="undertakeLeadForm.organizationCode"
                      placeholder="请选择"
                      @change="changeLeadUndertakeUnit"
                      :disabled="undertakeLeadForm.unitDisabled">
                      <el-option
                        v-for="item in leadUndertakeUnitOptions"
                        :key="item.id"
                        :label="item.organizationName"
                        :value="item.organizationCode"
                        :disabled="item.disabled"
                      ></el-option>
                    </el-select>
                  </el-tooltip>
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item
                  :label="(projectClass === 'IC_E' || projectClass === 'IC_F' || projectClass === 'IC_G') ? '项目执行经理:' : '项目经理:'"
                  prop="leadManager">
                  <div class="row-item" :class="{'error':undertakeLeadManagerValidSuc}">
                    <div class="tag-wrapper">
                      <template v-if="undertakeLeadForm.leadManager.userAccount">
                        <el-tag
                          v-for="(item,index) in [undertakeLeadForm.leadManager]"
                          :key="item.userAccount"
                          closable
                          @close="deletePerson(index,'undertakeLeadManager')">
                          <el-tooltip
                            class="item"
                            effect="dark"
                            :content="item.userAccount"
                            placement="top-start"
                            size="small">
                            <span> {{ item.userName }}</span>
                          </el-tooltip>
                        </el-tag>
                      </template>
                      <span v-else class="placeholder">请选择</span>
                    </div>
                    <span class="add-icon svgfont-adduser" @click="addPerson('undertakeLeadManager')"></span>
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item
                  label="项目成员:"
                  prop="undertakeLeadMembers">
                  <div class="row-item" :class="{'error':lDProjectMemberValidSuc1}">
                    <div class="tag-wrapper">
                      <template v-if="undertakeLeadForm.undertakeLeadMembers.length">
                        <el-tag
                          v-for="(item,index) in undertakeLeadForm.undertakeLeadMembers"
                          :key="item.userAccount"
                          closable
                          @close="deletePerson(index,'undertakeLeadMembers')">
                          <el-tooltip
                            class="item"
                            effect="dark"
                            :content="item.userAccount"
                            placement="top-start"
                            size="small">
                            <span> {{ item.userName }}</span>
                          </el-tooltip>
                        </el-tag>
                      </template>
                      <span v-else class="placeholder">请选择</span>
                    </div>
                    <span class="add-icon svgfont-adduser" @click="addPerson('undertakeLeadMembers')"></span>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <el-form
            class="tableForm"
            ref="undertakeCoopForm"
            :model="undertakeCoopForm"
            :inline="true">
            <el-table :data="undertakeCoopForm.tableData" style="width: 100%" :border="false">
              <el-table-column
                type="index"
                label="序号"
                align="left"
                width="60px"
                :index="setIndexMethod">
              </el-table-column>
              <el-table-column
                align="left"
                prop="coopOrgCode"
                minwidth="150">
                <template slot="header">
                  <div class="required">
                    <span>配合承担单位</span>
                  </div>
                </template>
                <template slot-scope="scope">
                  <p v-if="scope.row.id!=='addid'">{{scope.row.organizationName}}</p>
                  <el-form-item
                    :prop="'coopOrgCode'+scope.$index"
                    v-if="scope.row.id=='addid'"
                    style="margin-right:0;margin-bottom:0"
                    :rules="setRulesUndertake('organizationCode',scope.$index)">
                    <el-tooltip
                      effect="dark"
                      :content="scope.row.organizationName"
                      placement="top-start"
                      size="small"
                      :disabled="!scope.row.organizationName">
                      <el-select
                        v-model="scope.row.organizationCode"
                        placeholder="请选择"
                        clearable
                        @change="changeCoopUndertakeUnit($event,scope.$index)"
                        :disabled="scope.row.unitDisabled">
                        <el-option
                          v-for="item in coopUndertakeUnitOptions"
                          :key="item.id"
                          :label="item.organizationName"
                          :value="item.organizationCode"
                          :disabled="item.disabled"
                        ></el-option>
                      </el-select>
                    </el-tooltip>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column
                align="left"
                prop="coopManager"
                minwidth="150">
                <template slot="header">
                  <div class="required">
                    <span>项目经理</span>
                  </div>
                </template>
                <template slot-scope="scope">
                  <p v-if="scope.row.id!=='addid'">
                    <span v-for="user in scope.row.projectTeamList" :key="user.id">
                      <span v-if="user.projectRoleCode === 'PR-PARTNER-UNDERTAKER-MANAGER'">
                        <el-tooltip
                          effect="dark"
                          :content="user.userAccount"
                          placement="top-start"
                          size="small" ><span>{{user.userName}}</span></el-tooltip>
                      </span>
                    </span>
                    <!-- {{scope.row.userName}} -->
                  </p>
                  <el-form-item
                    class="coop"
                    :prop="'coopManager'+scope.$index"
                    v-if="scope.row.id=='addid'"
                    style="margin-right:0;margin-bottom:0"
                    :rules="setRulesUndertake('leadManager',scope.$index)">
                    <div class="row-item" :class="{'error':coopUndertakeManagerValidSuc}">
                      <div class="tag-wrapper">
                        <template v-if="scope.row.leadManager.userAccount">
                          <el-tag
                            closable
                            @close="deletePerson(0,'coopUndertakeManager')">
                            <el-tooltip
                              class="item"
                              effect="dark"
                              :content="scope.row.leadManager.userAccount"
                              placement="top-start"
                              size="small">
                              <span> {{ scope.row.leadManager.userName }}</span>
                            </el-tooltip>
                          </el-tag>
                        </template>
                        <span v-else class="placeholder">请选择</span>
                      </div>
                      <span class="add-icon svgfont-adduser" @click="addPerson('coopUndertakeManager',scope.$index,'coopUndertakeManager'+scope.$index)"></span>
                    </div>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column
                align="left"
                prop="coopUndertakeMember"
                min-width="200">
                <template slot="header">
                  <div class="required">
                    <span>项目成员</span>
                  </div>
                </template>
                <template slot-scope="scope">
                  <p v-show="scope.row.id!=='addid'">
                    <span v-for="(user,index) in scope.row.projectTeamList" :key="user.id">
                      <span v-if="user.projectRoleCode === 'PR-PARTNER-UNDERTAKER-MEMBER'">
                        <el-tooltip
                          effect="dark"
                          :content="user.userAccount"
                          placement="top-start"
                          size="small" ><span>{{user.userName}}</span></el-tooltip>
                        <span v-if="index<scope.row.projectTeamList.length-2">，</span></span>
                    </span>
                    <!-- {{item.userName}}, -->
                  </p>
                  <el-form-item
                    class="xmcy"
                    :prop="'coopUndertakeMember'+scope.$index"
                    v-if="scope.row.id=='addid'"
                    style="margin-right:0;margin-bottom:0;width:100%"
                    :rules="setRulesUndertake('coopUndertakeMember',scope.$index)">
                    <div class="row-item" :class="{'error':coopUndertakeMemberValidSuc}">
                      <div class="tag-wrapper">
                        <template v-if="scope.row.projectTeamList.length">
                          <el-tag
                            v-for="(item,index) in scope.row.projectTeamList"
                            :key="item.userAccount"
                            closable
                            @close="deletePerson(index,'coopUndertakeMember')">
                            <el-tooltip
                              class="item"
                              effect="dark"
                              :content="item.userAccount"
                              placement="top-start"
                              size="small">
                              <span> {{ item.userName }}</span>
                            </el-tooltip>
                          </el-tag>
                        </template>
                        <span v-else class="placeholder">请选择</span>
                      </div>
                      <span class="add-icon svgfont-adduser" @click="addPerson('coopUndertakeMember',scope.$index,'coopUndertakeMember'+scope.$index)"></span>
                    </div>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column
                prop="operation"
                label="操作"
                minwidth="100"
                align="center">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    v-if="scope.row.id=='addid'"
                    style="padding-left: 0;padding-right: 0 ;color: #0b82ff;background: 0 0;border-color: transparent;font-size: 14px;"
                    @click="coopUndertakeUnitAdd(scope.row)">完成</el-button>
                  <el-button size="mini" style="padding-left: 0;padding-right: 0 ;color: #0b82ff;background: 0 0;border-color: transparent;font-size: 14px;" @click="cooperateDemandUnitDel1(scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form>
        </project-panel>
        <!-- 联合攻关单位 -->
        <project-panel
          title="联合攻关单位"
          tip='注：战略项目联合攻关单位不超过10个，重点项目联合攻关单位不超过5个'
          :show-expand='false'
          class="addcon">
          <template v-slot:header>
            <el-button
              class="normal-btn"
              @click="addJointUnit"
              icon="el-icon-circle-plus-outline"
            >添加联合攻关单位</el-button>
          </template>
          <el-form
            class="tableForm"
            ref="jointForm"
            :model="jointForm"
            :inline="true">
            <el-table :data="jointForm.tableData" style="width: 100%" :border="false">
              <el-table-column
                type="index"
                label="序号"
                align="left"
                width="60px"
                :index="setIndexMethod">
              </el-table-column>
              <el-table-column
                align="left"
                prop="coopOrgCode"
                minwidth="150">
                <template slot="header">
                  <div class="required">
                    <span>单位名称</span>
                  </div>
                </template>
                <template slot-scope="scope">
                  <p v-if="scope.row.id!=='addid'">{{scope.row.organizationName}}</p>
                  <el-form-item
                    :prop="'coopOrgCode'+scope.$index"
                    v-if="scope.row.id=='addid'"
                    style="margin-right:0;margin-bottom:0"
                    :rules="setRulesJoint('organizationCode',scope.$index)">
                    <el-tooltip
                      effect="dark"
                      :content="scope.row.organizationName"
                      placement="top-start"
                      size="small"
                      :disabled="!scope.row.organizationName">
                      <el-select
                        v-model="scope.row.organizationCode"
                        placeholder="请选择"
                        clearable
                        @change="changeJointUnit($event,scope.$index)">
                        <el-option
                          v-for="item in jointUnitOptions"
                          :key="item.id"
                          :label="item.organizationName"
                          :value="item.organizationCode"
                          :disabled="item.disabled"
                        ></el-option>
                      </el-select>
                    </el-tooltip>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column
                align="left"
                prop="jointManager"
                min-width="200">
                <template slot="header">
                  <div class="required">
                    <span>项目经理</span>
                  </div>
                </template>
                <template slot-scope="scope">
                  <p v-show="scope.row.id!=='addid'">
                    <span v-for="(user,index) in scope.row.projectTeamList" :key="user.id">
                      <el-tooltip
                        effect="dark"
                        :content="user.userAccount"
                        placement="top-start"
                        size="small" ><span>{{user.userName}}</span></el-tooltip>
                      <span v-if="index<scope.row.projectTeamList.length-1">，</span></span>
                    <!-- {{item.userName}}, -->
                  </p>
                  <el-form-item
                    class="xmcy"
                    :prop="'jointManager'+scope.$index"
                    v-if="scope.row.id=='addid'"
                    style="margin-right:0;margin-bottom:0;width:100%"
                    :rules="setRulesJoint('jointManager',scope.$index)">
                    <div class="row-item" :class="{'error':jointManagerValidSuc}">
                      <div class="tag-wrapper">
                        <template v-if="scope.row.projectTeamList.length">
                          <el-tag
                            v-for="(item,index) in scope.row.projectTeamList"
                            :key="item.id"
                            closable
                            @close="deletePerson(index,'jointManager')">
                            <el-tooltip
                              class="item"
                              effect="dark"
                              :content="item.userAccount"
                              placement="top-start"
                              size="small">
                              <span> {{ item.userName }}</span>
                            </el-tooltip>
                          </el-tag>
                        </template>
                        <span v-else class="placeholder">请选择</span>
                      </div>
                      <span class="add-icon svgfont-adduser" @click="addPerson('jointManager',scope.$index,'jointManager'+scope.$index)"></span>
                    </div>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column
                prop="operation"
                label="操作"
                minwidth="100"
                align="center">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    v-if="scope.row.id=='addid'"
                    style="padding-left: 0;padding-right: 0 ;color: #0b82ff;background: 0 0;border-color: transparent;font-size: 14px;"
                    @click="jointUnitAdd(scope.row)">完成</el-button>
                  <el-button size="mini" style="padding-left: 0;padding-right: 0 ;color: #0b82ff;background: 0 0;border-color: transparent;font-size: 14px;" @click="cooperateDemandUnitDel2(scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form>
        </project-panel>
      </div>
    </project-panel>
    <person-select
      :show.sync="personDialogVisible"
      @selected="selectedPersions"
      @judgeMember="judgeMember"
      :judge="judge"
      ref="selectPerson"></person-select>
  </div>
</template>
<script>
import projectPanel from '@/controller/components/projectPanel'
import personSelect from '../components/personSelect'
import API from '@/serve/API_groupPlanProject'
import bus from '@/common/bus'
export default {
  components: { projectPanel, personSelect },
  data () {
    let validDemandUserAccount = (rule, value, callback) => {
      if (value && JSON.stringify(value) !== '{}' && value.userAccount) {
        callback()
      } else {
        callback(new Error('请选择牵头需求单位项目经理'))
      }
    }
    let validUndertakeUserAccount = (rule, value, callback) => {
      if (value && JSON.stringify(value) !== '{}' && value.userAccount) {
        callback()
      } else {
        callback(new Error('请选择牵头承担单位项目经理'))
      }
    }
    return {
      // 公共
      judge: '',
      personDialogVisible: false,
      roleType: '', //当前被添加的角色
      // 需求单位
      leadDemandUnitOptions: [], //牵头需求单位 options
      leadDemandManagerOptions: [], //牵头需求单位项目经理 options
      demandLeadForm: { //需求单位 form
        organizationCode: '', //牵头需求单位
        organizationName: '',
        companyCode: '',
        companyName: '',
        leadManager: { userAccount: '' }, //牵头需求单位项目经理
        demandLeadMembers: [] //牵头需求单位项目成员
      },
      demandLeadFormRules: {
        organizationCode: [{ required: true, message: '请选择牵头需求单位', trigger: ['change', 'blur'] }],
        leadManager: [{ validator: validDemandUserAccount, required: true, message: '请选择牵头需求单位项目经理', trigger: ['change', 'blur'] }],
        demandLeadMembers: [{ required: true, message: '请选择牵头需求单位项目成员', trigger: ['change', 'blur'] }]
      },
      demandCoopForm: { //配合需求单位表格
        tableData: [
          // { id: 1, organizationName: '配合需求单位 1', userName: '项目经理 1', projectTeamList: [{ label: '配合需求单位项目成员1', value: '1' }] },
          // { id: 'addid', organizationCode: '', userAccount: '', projectTeamList: [] }
        ]
      },
      demandAddTableRow: { id: 'addid', organizationCode: '', organizationName: '', companyCode: '', companyName: '', leadManager: { userAccount: '' }, projectTeamList: [] }, //新增表格行
      coopDemandUnitOptions: [], //配合需求单位 options
      coopDemandManagerOptions: [], //配合需求单位项目经理 options
      lDProjectMemberValidSuc: false,
      lDProjectManagerValidSuc: false,
      coopDemandMemberValidSuc: false,
      coopDemandManagerValidSuc: false,
      // 承担单位
      leadUndertakeUnitOptions: [], //牵头承担单位 options
      leadUndertakeManagerOptions: [], //牵头承担单位项目经理 options
      undertakeLeadForm: { //承担单位 form
        organizationCode: '', //牵头承担单位
        organizationName: '',
        companyCode: '',
        companyName: '',
        leadManager: { userAccount: '' }, //牵头承担单位项目经理
        undertakeLeadMembers: [] //牵头承担单位项目成员
      },
      undertakeLeadFormRules: {
        organizationCode: [{ required: true, message: '请选择牵头承担单位', trigger: ['change', 'blur'] }],
        leadManager: [{ validator: validUndertakeUserAccount, required: true, message: '请选择牵头承担单位项目经理', trigger: ['change', 'blur'] }],
        undertakeLeadMembers: [{ required: true, message: '请选择牵头承担单位项目成员', trigger: ['change', 'blur'] }]
      },
      undertakeCoopForm: { //配合承担单位表格
        tableData: [
          // { id: 1, organizationName: '配合承担单位 1', userName: '项目经理 1', projectTeamList: [{ label: '配合承担单位项目成员1', value: '1' }] },
          // { id: 'addid', organizationCode: '', userAccount: '', projectTeamList: [] }
        ]
      },
      undertakeAddTableRow: { id: 'addid', organizationCode: '', organizationName: '', companyCode: '', companyName: '', leadManager: { userAccount: '' }, projectTeamList: [] }, //新增表格行
      coopUndertakeUnitOptions: [], //配合承担单位 options
      coopUndertakeManagerOptions: [], //配合承担单位项目经理 options
      lDProjectMemberValidSuc1: false,
      undertakeLeadManagerValidSuc: false,
      coopUndertakeMemberValidSuc: false,
      coopUndertakeManagerValidSuc: false,
      // 联合攻关单位
      jointForm: { //联合攻关单位表格
        tableData: [
          // { id: 1, organizationName: '联合攻关单位 1', projectTeamList: [{ label: '联合攻关项目经理1', value: '1' }] },
          // { id: 'addid', organizationCode: '', projectTeamList: [] }
        ]
      },
      jointAddTableRow: { id: 'addid', organizationCode: '', organizationName: '', companyCode: '', companyName: '', projectTeamList: [] }, //新增表格行
      jointUnitOptions: [], //联合攻关单位 options
      jointManagerValidSuc: false,
      idCount: 0,
      renderNum: 0,
      subprojectInfo: {
        leadDemandUnitList: [], //牵头需求单位
        leadDemandManagerList: [], //牵头需求单位项目经理
        leadUndertakeUnitList: [], //牵头承担单位
        leadUndertakeManagerList: [], //牵头承担单位项目经理
        achDemandUnitList: [], //需求单位
        achUndertakeUnitList: [], //承担单位
        achDemandResponsibleList: [], //成果需求人
        achUndertakeResponsibleList: [] //成果负责人
      }, //子项目信息
      msgMap: {
        leadDemandUnitList: '子项目牵头需求单位',
        leadDemandManagerList: '子项目牵头需求单位经理',
        leadUndertakeUnitList: '子项目牵头承担单位',
        leadUndertakeManagerList: '子项目牵头承担单位经理',
        achDemandUnitList: '成果需求单位',
        achUndertakeUnitList: '成果承担单位',
        achDemandResponsibleList: '成果需求人',
        achUndertakeResponsibleList: '成果负责人'
      }
    }
  },
  props: {
    projectCompanyList: {
      type: Array,
      default: () => []
    },
    //需求非一般支撑包 - 项目类别=关键核心技术攻关IC_B时显示为“项目执行经理”
    projectClass: { type: String, default: '' }
  },
  watch: {
    projectCompanyList (newValue, oldValue) {
      if (newValue && newValue.length) {
        let tempList = JSON.parse(JSON.stringify(newValue))
        tempList.forEach(comp => {
          // element.type 需求方1，承担方2，联合攻关单位3
          if (comp.type === '1') { //需求
            this.setData(comp, 'demand')
          } else if (comp.type === '2') {
            this.setData(comp, 'undertake')
          } else if (comp.type === '3') {
            let tempList = []
            if (comp.projectTeamList) {
              comp.projectTeamList.forEach(user => {
                if (user.projectRoleCode === `PR-UNITE-ASSAULT-MANAGER`) { //项目经理
                  tempList.push(user)
                }
              })
            }
            comp.projectTeamList = tempList
            this.jointForm.tableData.push(comp)
          }
        })
        this.renderNum++
        if (this.renderNum === 4) { //父组件数据处理完，接口获取成功
          this.initAllOptions()
        }
        this.initManageOptions()
        this.changeValue(true)
        // this.demandCoopForm.tableData.push(this.demandAddTableRow)
        // this.undertakeCoopForm.tableData.push(this.undertakeAddTableRow)
        // this.jointForm.tableData.push(this.jointAddTableRow)
      }
    }
  },
  methods: {
    setData (compData, type = 'demand') {
      let upperType = type === 'demand' ? 'DEMAND' : 'UNDERTAKER'
      if (compData.leaderFlag === '1') { //牵头
        this[`${type}LeadForm`] = compData
        //this.getUserList(compData.organizationCode, type, '1')
        this.$set(this[`${type}LeadForm`], 'leadManager', { userAccount: '' })
        this.$set(this[`${type}LeadForm`], `${type}LeadMembers`, [])
        // this[`${type}LeadForm`].leadManager = ''
        // this[`${type}LeadForm`][`${type}LeadMembers`] = []
        if (compData.projectTeamList) {
          compData.projectTeamList.forEach(user => {
            if (user.projectRoleCode === `PR-LEADER-${upperType}-MANAGER`) { //项目经理
              this[`${type}LeadForm`].leadManager = user
            } else if (user.projectRoleCode === `PR-LEADER-${upperType}-MEMBER`) { //项目成员
              this[`${type}LeadForm`][`${type}LeadMembers`].push(user)
            }
          })
        }
      } else { //配合
        let tempList = []
        if (compData.projectTeamList) {
          let manager = []
          compData.projectTeamList.forEach(user => {
            if (user.projectRoleCode === `PR-PARTNER-${upperType}-MEMBER`) { //项目经理、项目成员
              tempList.push(user)
            }
            if (user.projectRoleCode === `PR-PARTNER-${upperType}-MANAGER`) {
              manager.push(user)
            }
          })
          tempList = tempList.concat(manager) //最后放入项目经理，为了计算项目成员的逗号展示
        }
        compData.projectTeamList = tempList
        this[`${type}CoopForm`].tableData.push(compData)
      }
    },
    //设置表格索引
    setIndexMethod (index) {
      if (index < 9) {
        return '0' + (index + 1)
      }
      return index + 1
    },
    async addPerson (roleType, rowindex, prop) {
      if (!this.$store.getters['GROUPPLAN/blockCanEdit']('teamInfo')) {
        //不能编辑不弹框，给提示
        this.changeInfo(true, true)
        return
      }
      this.roleType = roleType
      let params = {}
      params = {
        node: [{
          orgName: '中国移动集团有限公司',
          orgCode: '00000000000000000000'
        }],
        users: [],
        max: 200
      }
      switch (roleType) {
        case 'demandLeadManager'://牵头需求单位项目经理
          if (this.demandLeadForm.organizationCode === '') {
            this.$message({
              type: 'warning',
              message: '请先选择牵头需求单位！',
              showClose: true
            })
            return
          }
          let user = []
          if (this.demandLeadForm.leadManager.userAccount) {
            user = [this.demandLeadForm.leadManager]
          }
          this.judge = 'demand'
          params = {
            node: [this.getOrgNode('demand', '1')],
            users: user,
            disabledUser: this.demandLeadForm.demandLeadMembers,
            max: 1
          }
          break
        case 'demandLeadMembers'://牵头需求单位项目成员
          if (this.demandLeadForm.organizationCode === '') {
            this.$message({
              type: 'warning',
              message: '请先选择牵头需求单位！',
              showClose: true
            })
            return
          }
          this.judge = 'demand'
          params = {
            node: [this.getOrgNode('demand', '1')],
            users: this.demandLeadForm.demandLeadMembers,
            disabledUser: this.demandLeadForm.leadManager
          }
          break
        case 'coopDemandManager'://配合需求单位项目经理
          if (this.demandCoopForm.tableData[rowindex].organizationCode === '') {
            this.$message({
              type: 'warning',
              message: '请先选择配合需求单位！',
              showClose: true
            })
            return true
          }
          this.judge = 'demand'
          params = {
            node: [this.getOrgNode('demand', '0', rowindex)],
            users: this.demandCoopForm.tableData[rowindex].leadManager.userAccount ? [this.demandCoopForm.tableData[rowindex].leadManager] : [],
            disabledUser: this.demandCoopForm.tableData[rowindex].projectTeamList,
            max: 1
          }
          break
        case 'coopDemandMember'://配合需求单位项目成员
          if (this.demandCoopForm.tableData[rowindex].organizationCode === '') {
            this.$message({
              type: 'warning',
              message: '请先选择配合需求单位！',
              showClose: true
            })
            return true
          }
          this.judge = 'demand'
          params = {
            node: [this.getOrgNode('demand', '0', rowindex)],
            users: this.demandCoopForm.tableData[rowindex].projectTeamList,
            disabledUser: this.demandCoopForm.tableData[rowindex].leadManager
          }
          break
        case 'undertakeLeadManager': //牵头承担单位项目经理
          if (this.undertakeLeadForm.organizationCode === '') {
            this.$message({
              type: 'warning',
              message: '请先选择牵头承担单位！',
              showClose: true
            })
            return
          }
          this.judge = 'undertake'
          params = {
            node: [this.getOrgNode('undertake', '1')],
            users: this.undertakeLeadForm.leadManager.userAccount ? [this.undertakeLeadForm.leadManager] : [],
            disabledUser: this.undertakeLeadForm.undertakeLeadMembers,
            max: 1
          }
          break
        case 'undertakeLeadMembers': //牵头承担单位项目成员
          if (this.undertakeLeadForm.organizationCode === '') {
            this.$message({
              type: 'warning',
              message: '请先选择牵头承担单位！',
              showClose: true
            })
            return
          }
          this.judge = 'undertake'
          params = {
            node: [this.getOrgNode('undertake', '1')],
            users: this.undertakeLeadForm.undertakeLeadMembers,
            disabledUser: this.undertakeLeadForm.leadManager
          }
          break
        case 'coopUndertakeManager': //配合承担单位项目经理
          if (this.undertakeCoopForm.tableData[rowindex].organizationCode === '') {
            this.$message({
              type: 'warning',
              message: '请先选择配合承担单位！',
              showClose: true
            })
            return true
          }
          this.judge = 'undertake'
          params = {
            node: [this.getOrgNode('undertake', '0', rowindex)],
            users: this.undertakeCoopForm.tableData[rowindex].leadManager.userAccount ? [this.undertakeCoopForm.tableData[rowindex].leadManager] : [],
            disabledUser: this.undertakeCoopForm.tableData[rowindex].projectTeamList,
            max: 1
          }
          break
        case 'coopUndertakeMember': //配合承担单位项目成员
          if (this.undertakeCoopForm.tableData[rowindex].organizationCode === '') {
            this.$message({
              type: 'warning',
              message: '请先选择配合承担单位！',
              showClose: true
            })
            return true
          }
          this.judge = 'undertake'
          params = {
            node: [this.getOrgNode('undertake', '0', rowindex)],
            users: this.undertakeCoopForm.tableData[rowindex].projectTeamList,
            disabledUser: this.undertakeCoopForm.tableData[rowindex].leadManager
          }
          break
        case 'jointManager': //联合攻关单位项目经理
          if (this.jointForm.tableData[rowindex].organizationCode === '') {
            this.$message({
              type: 'warning',
              message: '请先选择联合攻关单位！',
              showClose: true
            })
            return true
          }
          params = {
            node: [this.getOrgNode('joint', '2', rowindex)],
            users: this.jointForm.tableData[rowindex].projectTeamList
          }
          break
      }
      params.roleType = roleType
      params.users.forEach(ele => {
        ele.uid = ele.userAccount
        ele.chineseName = ele.userName
      })
      this.personDialogVisible = true
      this.$refs.selectPerson.refreshTree(params)
    },
    //获取人员选择组件根节点的信息
    getOrgNode (unitType, isLead, index) {
      let orgInfo = { orgCode: '', orgName: '' }
      let leadTypeUpper = isLead === '1' ? 'Lead' : (isLead === '0' ? 'Coop' : '')
      let leadTypeLower = isLead === '1' ? 'lead' : (isLead === '0' ? 'coop' : 'joint')
      let unitTypeUpper = unitType === 'demand' ? 'Demand' : (unitType === 'undertake' ? 'Undertake' : '')
      // demandLeadForm demandCoopForm jointForm
      // leadDemandUnitOptions leadUndertakeUnitOptions jointUnitOptions
      if (isLead === '1') {
        orgInfo.orgCode = this[`${unitType}${leadTypeUpper}Form`].organizationCode
      } else {
        orgInfo.orgCode = this[`${unitType}${leadTypeUpper}Form`].tableData[index].organizationCode
      }
      this[`${leadTypeLower}${unitTypeUpper}UnitOptions`].some(ele => {
        if (ele.organizationCode === orgInfo.orgCode) {
          orgInfo.orgName = ele.organizationName
          return true
        }
      })
      return orgInfo
    },
    deletePerson (index, roleType) {
      if (!this.$store.getters['GROUPPLAN/blockCanEdit']('teamInfo')) {
        //不能编辑不弹框，给提示
        this.changeInfo(true, true)
        return
      }
      if (index > -1) {
        if (roleType === 'demandLeadManager') { //牵头需求单位项目经理
          if (this.judgeMember(this.demandLeadForm.leadManager.userAccount, 'demand')) return
          this.demandLeadForm.leadManager = {}
          this.validateFieldLDProjectManager()
          this.changeValue()
        }
        if (roleType === 'demandLeadMembers') { //牵头需求单位项目成员
          if (this.judgeMember(this.demandLeadForm.demandLeadMembers[index].userAccount, 'demand')) return
          this.demandLeadForm.demandLeadMembers.splice(index, 1)
          this.setManagerOptions('demandLeadMembers')
          this.validateFieldLDProjectMember()
          this.changeValue()
        }
        if (roleType === 'coopDemandMember') { //配合需求单位项目成员
          if (this.judgeMember(this.demandCoopForm.tableData[this.demandCoopForm.tableData.length - 1].projectTeamList[index].userAccount, 'demand')) return
          this.demandCoopForm.tableData[this.demandCoopForm.tableData.length - 1].projectTeamList.splice(index, 1)
          this.setManagerOptions('coopDemandMember')
          this.validateCoopDemandMember()
          this.changeValue()
        }
        if (roleType === 'coopDemandManager') { //配合需求单位项目经理
          if (this.judgeMember(this.demandCoopForm.tableData[this.demandCoopForm.tableData.length - 1].leadManager.userAccount, 'demand')) return
          this.demandCoopForm.tableData[this.demandCoopForm.tableData.length - 1].leadManager = {}
          this.validateCoopDemandManager()
          this.changeValue()
        }
        if (roleType === 'undertakeLeadManager') { //牵头承担单位项目经理
          if (this.judgeMember(this.undertakeLeadForm.leadManager.userAccount, 'undertake')) return
          this.undertakeLeadForm.leadManager = {}
          this.validateFieldUndertakeLeadManager()
          this.changeValue()
        }
        if (roleType === 'undertakeLeadMembers') { //牵头承担单位项目成员
          if (this.judgeMember(this.undertakeLeadForm.undertakeLeadMembers[index].userAccount, 'undertake')) return
          this.undertakeLeadForm.undertakeLeadMembers.splice(index, 1)
          this.setManagerOptions('undertakeLeadMembers')
          this.validateFieldLDProjectMember1()
          this.changeValue()
        }
        if (roleType === 'coopUndertakeManager') { //配合承担单位项目经理
          if (this.judgeMember(this.undertakeCoopForm.tableData[this.undertakeCoopForm.tableData.length - 1].leadManager.userAccount, 'undertake')) return
          this.undertakeCoopForm.tableData[this.undertakeCoopForm.tableData.length - 1].leadManager = {}
          this.validateCoopUndertakeManager()
          this.changeValue()
        }
        if (roleType === 'coopUndertakeMember') { //配合承担单位项目成员
          if (this.judgeMember(this.undertakeCoopForm.tableData[this.undertakeCoopForm.tableData.length - 1].projectTeamList[index].userAccount, 'undertake')) return
          this.undertakeCoopForm.tableData[this.undertakeCoopForm.tableData.length - 1].projectTeamList.splice(index, 1)
          this.setManagerOptions('coopUndertakeMember')
          this.validateCoopUndertakeMember()
          this.changeValue()
        }
        if (roleType === 'jointManager') { //联合攻关单位项目经理
          this.jointForm.tableData[this.jointForm.tableData.length - 1].projectTeamList.splice(index, 1)
          this.validateJointManager()
          this.changeInfo()
        }
      }
    },
    judgeMember (userAccount, unitType) {
      let flag1 = false
      let flag2 = false
      let flag3 = false
      let flag4 = false
      flag1 = this.subprojectInfo.leadDemandManagerList.some(e => e === userAccount)
      flag2 = this.subprojectInfo.achDemandResponsibleList.some(e => e === userAccount)
      flag3 = this.subprojectInfo.leadUndertakeManagerList.some(e => e === userAccount)
      flag4 = this.subprojectInfo.achUndertakeResponsibleList.some(e => e === userAccount)
      if (flag1 && unitType === 'demand') {
        this.showMessage('leadDemandManagerList')
        return true
      }
      if (flag2 && unitType === 'demand') {
        this.showMessage('achDemandResponsibleList')
        return true
      }
      if (flag3 && unitType === 'undertake') {
        this.showMessage('leadUndertakeManagerList')
        return true
      }
      if (flag4 && unitType === 'undertake') {
        this.showMessage('achUndertakeResponsibleList')
        return true
      }
      return false
    },
    showMessage (role) {
      this.$message({
        message: `该成员为${this.msgMap[role]}，不能删除！`,
        type: 'warning',
        showClose: true
      })
    },
    selectedPersions (persons) {
      let users = []
      let roleCode = ''
      switch (persons.roleType) {
        case 'demandLeadManager':
          roleCode = 'PR-LEADER-DEMAND-MANAGER'
          break
        case 'demandLeadMembers':
          roleCode = 'PR-LEADER-DEMAND-MEMBER'
          break
        case 'coopDemandManager':
          roleCode = 'PR-PARTNER-DEMAND-MANAGER'
          break
        case 'coopDemandMember':
          roleCode = 'PR-PARTNER-DEMAND-MEMBER'
          break
        case 'undertakeLeadManager':
          roleCode = 'PR-LEADER-UNDERTAKER-MANAGER'
          break
        case 'undertakeLeadMembers':
          roleCode = 'PR-LEADER-UNDERTAKER-MEMBER'
          break
        case 'coopUndertakeManager':
          roleCode = 'PR-PARTNER-UNDERTAKER-MANAGER'
          break
        case 'coopUndertakeMember':
          roleCode = 'PR-PARTNER-UNDERTAKER-MEMBER'
          break
        case 'jointManager':
          roleCode = 'PR-UNITE-ASSAULT-MANAGER'
          break
      }
      persons.users.forEach(user => {
        users.push({
          uid: user.uid,
          chineseName: user.chineseName,
          organizationCode: user.orgCode || user.organizationCode,
          companyCode: user.companyCode,
          userName: user.chineseName,
          employeeNum: user.employeeNum,
          userAccount: user.uid,
          projectRoleCode: roleCode
        })
      })
      if (persons.roleType === 'demandLeadManager') {
        this.demandLeadForm.leadManager = users[0]
        this.validateFieldLDProjectManager()
        this.changeValue()
      }
      if (persons.roleType === 'demandLeadMembers') {
        this.demandLeadForm.demandLeadMembers = users
        this.setManagerOptions('demandLeadMembers')
        this.validateFieldLDProjectMember()
        this.changeValue()
      }
      if (persons.roleType === 'coopDemandManager') {
        this.demandCoopForm.tableData[this.demandCoopForm.tableData.length - 1].leadManager = users[0]
        this.validateCoopDemandManager()
        this.changeValue()
      }
      if (persons.roleType === 'coopDemandMember') {
        this.demandCoopForm.tableData[this.demandCoopForm.tableData.length - 1].projectTeamList = users
        this.setManagerOptions('coopDemandMember')
        this.validateCoopDemandMember()
        this.changeValue()
      }
      if (persons.roleType === 'undertakeLeadManager') {
        this.undertakeLeadForm.leadManager = users[0]
        this.validateFieldUndertakeLeadManager()
        this.changeValue()
      }
      if (persons.roleType === 'undertakeLeadMembers') {
        this.undertakeLeadForm.undertakeLeadMembers = users
        this.setManagerOptions('undertakeLeadMembers')
        this.validateFieldLDProjectMember1()
        this.changeValue()
      }
      if (persons.roleType === 'coopUndertakeManager') {
        this.undertakeCoopForm.tableData[this.undertakeCoopForm.tableData.length - 1].leadManager = users[0]
        this.validateCoopUndertakeManager()
        this.changeValue()
      }
      if (persons.roleType === 'coopUndertakeMember') {
        this.undertakeCoopForm.tableData[this.undertakeCoopForm.tableData.length - 1].projectTeamList = users
        this.setManagerOptions('coopUndertakeMember')
        this.validateCoopUndertakeMember()
        this.changeValue()
      }
      if (persons.roleType === 'jointManager') {
        this.jointForm.tableData[this.jointForm.tableData.length - 1].projectTeamList = users
        this.validateJointManager()
        this.changeInfo()
      }
    },
    validateFieldLDProjectMember () { //单独校验需求单位 3 个表单项目成员
      this.$refs.demandLeadForm.validateField('demandLeadMembers', (error) => {
        if (error !== '') {
          this.lDProjectMemberValidSuc = true
        } else {
          this.lDProjectMemberValidSuc = false
        }
      })
    },
    validateFieldLDProjectManager () { //单独校验需求单位项目经理
      this.$refs.demandLeadForm.validateField('leadManager', (error) => {
        if (error !== '') {
          this.lDProjectManagerValidSuc = true
        } else {
          this.lDProjectManagerValidSuc = false
        }
      })
    },
    validateCoopDemandMember () { //单独校验配合需求单位项目成员
      if (this.demandCoopForm.tableData.length > 0) {
        let hasAddRow = this.demandCoopForm.tableData.some(item => {
          return item.id === 'addid'
        })
        if (hasAddRow) {
          let tableData = this.demandCoopForm.tableData
          let members = tableData[tableData.length - 1].projectTeamList.filter(ele => ele.projectRoleCode === 'PR-PARTNER-DEMAND-MEMBER')
          if (members.length === 0) {
            this.coopDemandMemberValidSuc = true
            return false
          } else {
            this.coopDemandMemberValidSuc = false
            return true
          }
        }
      }
      return true
    },
    validateCoopDemandManager () { //单独校验配合需求单位项目经理
      if (this.demandCoopForm.tableData.length > 0) {
        let hasAddRow = this.demandCoopForm.tableData.some(item => {
          return item.id === 'addid'
        })
        if (hasAddRow) {
          let tableData = this.demandCoopForm.tableData
          let members = [tableData[tableData.length - 1].leadManager].filter(ele => ele.projectRoleCode === 'PR-PARTNER-DEMAND-MANAGER')
          if (members.length === 0) {
            this.coopDemandManagerValidSuc = true
            return false
          } else {
            this.coopDemandManagerValidSuc = false
            return true
          }
        }
      }
      return true
    },
    validateFieldUndertakeLeadManager () { //单独校验承担单位项目经理
      this.$refs.undertakeLeadForm.validateField('leadManager', (error) => {
        if (error !== '') {
          this.undertakeLeadManagerValidSuc = true
        } else {
          this.undertakeLeadManagerValidSuc = false
        }
      })
    },
    validateFieldLDProjectMember1 () { //单独校验承担单位 3 个表单项目成员
      this.$refs.undertakeLeadForm.validateField('undertakeLeadMembers', (error) => {
        if (error !== '') {
          this.lDProjectMemberValidSuc1 = true
        } else {
          this.lDProjectMemberValidSuc1 = false
        }
      })
    },
    validateCoopUndertakeManager () { //单独校验配合承担单位项目成员
      if (this.undertakeCoopForm.tableData.length > 0) {
        let hasAddRow = this.undertakeCoopForm.tableData.some(item => {
          return item.id === 'addid'
        })
        if (hasAddRow) {
          let tableData = this.undertakeCoopForm.tableData
          let members = [tableData[tableData.length - 1].leadManager].filter(ele => ele.projectRoleCode === 'PR-PARTNER-UNDERTAKER-MANAGER')
          if (members.length === 0) {
            this.coopUndertakeManagerValidSuc = true
            return false
          } else {
            this.coopUndertakeManagerValidSuc = false
            return true
          }
        }
      }
      return true
    },
    validateCoopUndertakeMember () { //单独校验配合承担单位项目成员
      if (this.undertakeCoopForm.tableData.length > 0) {
        let hasAddRow = this.undertakeCoopForm.tableData.some(item => {
          return item.id === 'addid'
        })
        if (hasAddRow) {
          let tableData = this.undertakeCoopForm.tableData
          let members = tableData[tableData.length - 1].projectTeamList.filter(ele => ele.projectRoleCode === 'PR-PARTNER-UNDERTAKER-MEMBER')
          if (members.length === 0) {
            this.coopUndertakeMemberValidSuc = true
            return false
          } else {
            this.coopUndertakeMemberValidSuc = false
            return true
          }
        }
      }
      return true
    },
    validateJointManager () { //单独校验联合攻关单位项目经理
      if (this.jointForm.tableData.length > 0) {
        let hasAddRow = this.jointForm.tableData.some(item => {
          return item.id === 'addid'
        })
        if (hasAddRow) {
          let tableData = this.jointForm.tableData
          let members = tableData[tableData.length - 1].projectTeamList.filter(ele => ele.projectRoleCode === 'PR-UNITE-ASSAULT-MANAGER')
          if (members.length === 0) {
            this.jointManagerValidSuc = true
          } else {
            this.jointManagerValidSuc = false
          }
        }
      }
    },
    setRulesDemand (prop, rowindex) { // 设置表单必填校验 - 需求配合单位
      if (prop === 'coopDemandMember') return
      let temp = this.demandCoopForm.tableData[rowindex][prop]
      if (prop === 'leadManager') {
        temp = temp.userAccount
      }
      let checkEmpty = (rule, value, callback) => {
        if (temp === '') {
          callback(new Error('该项不能为空'))
        } else {
          callback()
        }
      }
      let rules = [
        { validator: checkEmpty, required: true, message: '该项不能为空', trigger: ['blur', 'change'] }
      ]
      return rules
    },
    setRulesUndertake (prop, rowindex) { // 设置表单必填校验 - 承担配合单位
      if (prop === 'coopUndertakeMember') return
      let temp = this.undertakeCoopForm.tableData[rowindex][prop]
      if (prop === 'leadManager') {
        temp = temp.userAccount
      }
      let checkEmpty = (rule, value, callback) => {
        if (temp === '') {
          callback(new Error('该项不能为空'))
        } else {
          callback()
        }
      }
      let rules = [
        { validator: checkEmpty, required: true, message: '该项不能为空', trigger: ['blur', 'change'] }
      ]
      return rules
    },
    setRulesJoint (prop, rowindex) { // 设置表单必填校验 - 联合攻关单位
      if (prop === 'jointManager') return
      let temp = this.jointForm.tableData[rowindex][prop]
      let checkEmpty = (rule, value, callback) => {
        if (temp === '') {
          callback(new Error('该项不能为空'))
        } else {
          callback()
        }
      }
      let rules = [
        { validator: checkEmpty, required: true, message: '该项不能为空', trigger: ['blur', 'change'] }
      ]
      return rules
    },
    async tempSave () {
      let params = await this.validate()
      if (params) {
        API.editProjectTeamD(params)
          .then(res => {
            this.$message({
              type: 'success',
              message: '团队信息保存成功',
              showClose: true
            })
            this.$emit('saveTeamInfo', true)
            bus.$emit('demandLeadForm', JSON.parse(JSON.stringify(this.demandLeadForm)))
            // bus.$emit('demandLeadFormManager', JSON.parse(JSON.stringify(this.demandLeadForm.leadManager)))
            bus.$emit('demandCoopForm', JSON.parse(JSON.stringify(this.demandCoopForm.tableData)))
            bus.$emit('undertakeLeadForm', JSON.parse(JSON.stringify(this.undertakeLeadForm)))
            bus.$emit('cooUndertakeLeadForm', JSON.parse(JSON.stringify(this.undertakeCoopForm.tableData)))

            this.changeInfo(false)
          })
          .catch(e => {
            if (e.selfError) return
            if (e.message) {
              this.$message({
                message: e.message || '团队信息保存失败！',
                type: 'error',
                showClose: true
              })
            }
          })
      }
    },
    async validate () {
      return new Promise((resolve, reject) => {
        let flag = true //默认可以保存
        this.$refs.demandLeadForm.validate(valid => { //校验需求单位3个输入框
          if (!valid) {
            flag = false
          }
        })
        this.validateFieldLDProjectMember()
        if (!this.validateCoopDemandMember()) {
          flag = false
        }
        if (!this.validateCoopDemandManager()) {
          flag = false
        }
        this.$refs.demandCoopForm.validate(valid => { //校验配合需求单位表格
          if (!valid) {
            flag = false
          }
        })
        this.$refs.undertakeLeadForm.validate(valid => { //校验承担单位3个输入框
          if (!valid) {
            flag = false
          }
        })
        this.validateFieldLDProjectMember1()
        if (!this.validateCoopUndertakeMember()) {
          flag = false
        }
        if (!this.validateCoopUndertakeManager()) {
          flag = false
        }
        this.$refs.undertakeCoopForm.validate(valid => { //校验配合需求单位表格
          if (!valid) {
            flag = false
          }
        })
        this.$refs.jointForm.validate(valid => { //校验联合攻关单位表格
          if (!valid) {
            flag = false
          }
        })
        this.validateJointManager()
        if (this.jointManagerValidSuc) {
          resolve(false)
          return false
        }
        if (flag) {
          let params = this.getSubmitData()
          resolve(params)
        } else {
          resolve(false)
          return false
        }
      })
    },
    getSubmitData () {
      let params = {
        projectCode: this.$route.params.projectCode,
        projectCompanyList: []
      }
      let DLTeamList = []
      if (this.demandLeadForm.leadManager.userAccount) {
        DLTeamList = [this.demandLeadForm.leadManager, ...this.demandLeadForm.demandLeadMembers]
      } else {
        DLTeamList = [...this.demandLeadForm.demandLeadMembers]
      }
      let demandLead = {
        organizationCode: this.demandLeadForm.organizationCode,
        organizationName: this.demandLeadForm.organizationName,
        companyCode: this.demandLeadForm.companyCode,
        companyName: this.demandLeadForm.companyName,
        type: '1', // 需求方1，承担方2，联合攻关单位3
        leaderFlag: '1', //牵头1，配合0
        projectTeamList: DLTeamList //人员
      }
      let ULprojectTeamList = []
      if (this.undertakeLeadForm.leadManager.userAccount) {
        ULprojectTeamList = [this.undertakeLeadForm.leadManager, ...this.undertakeLeadForm.undertakeLeadMembers]
      } else {
        ULprojectTeamList = [...this.undertakeLeadForm.undertakeLeadMembers]
      }
      let undertakeLead = {
        organizationCode: this.undertakeLeadForm.organizationCode,
        organizationName: this.undertakeLeadForm.organizationName,
        companyCode: this.undertakeLeadForm.companyCode,
        companyName: this.undertakeLeadForm.companyName,
        type: '2', // 需求方1，承担方2，联合攻关单位3
        leaderFlag: '1', //牵头1，配合0
        projectTeamList: ULprojectTeamList //人员
      }
      let demandCoop = this.analyseCoopNewRow(this.demandCoopForm, this.coopDemandUnitOptions, this.coopDemandManagerOptions, 'PR-PARTNER-DEMAND-MANAGER', '1')
      let undertakeCoop = this.analyseCoopNewRow(this.undertakeCoopForm, this.coopUndertakeUnitOptions, this.coopUndertakeManagerOptions, 'PR-PARTNER-UNDERTAKER-MANAGER', '2')
      let joint = this.analyseJointNewRow()
      let tempCompanyList = [
        demandLead, undertakeLead, ...demandCoop, ...undertakeCoop, ...joint
      ]
      tempCompanyList.forEach(ele => {
        if (ele.id && (ele.id.indexOf('newRow') > -1 || ele.id.indexOf('addid') > -1)) {
          ele.id = ''
        }
      })
      params.projectCompanyList = tempCompanyList
      return params
    },
    analyseCoopNewRow (form, unitOptions, manageOptions, projectRoleCode, type) {
      let temp = JSON.parse(JSON.stringify(form.tableData))
      temp.some(ele => {
        if (ele.id === 'addid') {
          unitOptions.some(unit => {
            if (unit.organizationCode === ele.organizationCode) {
              ele.organizationName = unit.organizationName
              ele.companyCode = unit.companyCode
              ele.companyName = unit.companyName
              return true
            }
          })
          // manageOptions.some(user => {
          //   if (user.userAccount === ele.leadManager.userAccount) {
          //     user.projectRoleCode = projectRoleCode
          //     ele.projectTeamList.push(user)
          //     return true
          //   }
          // })
          ele.projectTeamList.push(ele.leadManager)
          ele.type = type
          ele.leaderFlag = '0'
          return true
        }
      })
      return temp
    },
    analyseJointNewRow () {
      let temp = JSON.parse(JSON.stringify(this.jointForm.tableData))
      temp.some(ele => {
        if (ele.id === 'addid') {
          this.jointUnitOptions.some(unit => {
            if (unit.organizationCode === ele.organizationCode) {
              ele.organizationName = unit.organizationName
              ele.companyCode = unit.companyCode
              ele.companyName = unit.companyName
              return true
            }
          })
          ele.type = '3'
          return true
        }
      })
      return temp
    },
    addCoopDemandUnit () { //添加配合需求单位
      if (!this.$store.getters['GROUPPLAN/blockCanEdit']('teamInfo')) {
        //不能编辑不弹框，给提示
        this.changeInfo(true, true)
        return
      }
      let flag = this.demandCoopForm.tableData.some((item, index) => {
        return item.id === 'addid'
      })
      if (flag) {
        this.$message({
          type: 'warning',
          message: '请保存当前的新增数据!',
          showClose: true
        })
      } else {
        this.demandAddTableRow = { id: 'addid', organizationCode: '', organizationName: '', companyCode: '', companyName: '', leadManager: { userAccount: '' }, projectTeamList: [] }
        this.coopDemandMemberValidSuc = false
        this.demandCoopForm.tableData.push(this.demandAddTableRow)
      }
    },
    addCoopUndertakeUnit () { //添加配合承担单位
      if (!this.$store.getters['GROUPPLAN/blockCanEdit']('teamInfo')) {
        //不能编辑不弹框，给提示
        this.changeInfo(true, true)
        return
      }
      let flag = this.undertakeCoopForm.tableData.some((item, index) => {
        return item.id === 'addid'
      })
      if (flag) {
        this.$message({
          type: 'warning',
          message: '请保存当前的新增数据!',
          showClose: true
        })
      } else {
        this.undertakeAddTableRow = { id: 'addid', organizationCode: '', organizationName: '', companyCode: '', companyName: '', leadManager: { userAccount: '' }, projectTeamList: [] }
        this.coopUndertakeMemberValidSuc = false
        this.undertakeCoopForm.tableData.push(this.undertakeAddTableRow)
      }
    },
    addJointUnit () { //添加联合攻关单位
      if (!this.$store.getters['GROUPPLAN/blockCanEdit']('teamInfo')) {
        //不能编辑不弹框，给提示
        this.changeInfo(true, true)
        return
      }
      let flag = this.jointForm.tableData.some((item, index) => {
        return item.id === 'addid'
      })
      if (flag) {
        this.$message({
          type: 'warning',
          message: '请保存当前的新增数据!',
          showClose: true
        })
      } else {
        this.jointAddTableRow = { id: 'addid', organizationCode: '', organizationName: '', companyCode: '', companyName: '', projectTeamList: [] }
        this.jointManagerValidSuc = false
        this.jointForm.tableData.push(this.jointAddTableRow)
      }
    },
    coopDemandUnitAdd (row) { //配合需求单位点击完成新增
      this.validateCoopDemandMember()
      this.validateCoopDemandManager()
      this.$refs.demandCoopForm.validate(valid => { //校验需求单位表格
        if (valid) {
          if (this.coopDemandMemberValidSuc) return
          if (this.coopDemandManagerValidSuc) return
          let newRow = Object.assign({}, this.demandAddTableRow)
          newRow.id = 'newRow' + this.idCount
          this.coopDemandUnitOptions.some(unit => {
            if (unit.organizationCode === newRow.organizationCode) {
              newRow.organizationName = unit.organizationName
              newRow.companyCode = unit.companyCode
              newRow.companyName = unit.companyName
              return true
            }
          })
          // this.coopDemandManagerOptions.some(user => {
          //   if (user.userAccount === newRow.leadManager.userAccount) {
          //     user.projectRoleCode = 'PR-PARTNER-DEMAND-MANAGER'
          //     newRow.projectTeamList.push(user)
          //     return true
          //   }
          // })
          newRow.projectTeamList.push(newRow.leadManager)
          newRow.type = '1'
          newRow.leaderFlag = '0'
          this.demandCoopForm.tableData.pop()
          this.demandCoopForm.tableData.push(newRow)
          this.idCount++
          this.demandAddTableRow = { id: 'addid', organizationCode: '', organizationName: '', companyCode: '', companyName: '', leadManager: { userAccount: '' }, projectTeamList: [] }
          this.coopDemandManagerOptions = []
          this.setOptionDisabled('leadDeamndUnit')
          this.setOptionDisabled('coopDeamndUnit')
        }
      })
    },
    coopUndertakeUnitAdd (row) { //配合承担单位点击完成新增
      this.validateCoopUndertakeMember()
      this.validateCoopUndertakeManager()
      this.$refs.undertakeCoopForm.validate(valid => { //校验承担单位表格
        if (valid) {
          if (this.coopUndertakeMemberValidSuc) return
          if (this.coopUndertakeManagerValidSuc) return
          let newRow = Object.assign({}, this.undertakeAddTableRow)
          newRow.id = 'newRow' + this.idCount
          this.coopUndertakeUnitOptions.some(unit => {
            if (unit.organizationCode === newRow.organizationCode) {
              newRow.organizationName = unit.organizationName
              newRow.companyCode = unit.companyCode
              newRow.companyName = unit.companyName
              return true
            }
          })
          // this.coopUndertakeManagerOptions.some(user => {
          //   if (user.userAccount === newRow.leadManager.userAccount) {
          //     user.projectRoleCode = 'PR-PARTNER-UNDERTAKER-MANAGER'
          //     newRow.projectTeamList.push(user)
          //     return true
          //   }
          // })
          newRow.projectTeamList.push(newRow.leadManager)
          newRow.type = '2'
          newRow.leaderFlag = '0'
          this.undertakeCoopForm.tableData.pop()
          this.undertakeCoopForm.tableData.push(newRow)
          this.idCount++
          this.undertakeAddTableRow = { id: 'addid', organizationCode: '', organizationName: '', companyCode: '', companyName: '', leadManager: { userAccount: '' }, projectTeamList: [] }
          this.coopUndertakeManagerOptions = []
          this.setOptionDisabled('coopUndertakeUnit')
          this.setOptionDisabled('leadUndertakeUnit')
        }
      })
    },
    jointUnitAdd (row) { //联合攻关单位点击完成新增
      this.validateJointManager()
      this.$refs.jointForm.validate(valid => { //校验承担单位表格
        if (valid) {
          if (this.jointManagerValidSuc) return
          let newRow = Object.assign({}, this.jointAddTableRow)
          newRow.id = 'newRow' + this.idCount
          this.jointUnitOptions.some(unit => {
            if (unit.organizationCode === newRow.organizationCode) {
              newRow.organizationName = unit.organizationName
              newRow.companyCode = unit.companyCode
              newRow.companyName = unit.companyName
              return true
            }
          })
          newRow.type = '3'
          newRow.leaderFlag = '0'
          this.jointForm.tableData.pop()
          this.jointForm.tableData.push(newRow)
          this.idCount++
          this.jointAddTableRow = { id: 'addid', organizationCode: '', organizationName: '', companyCode: '', companyName: '', projectTeamList: [] }
          this.setOptionDisabled('jointUnit')
        }
      })
    },
    cooperateDemandUnitDel (row) { //配合需求单位删除
      if (!this.$store.getters['GROUPPLAN/blockCanEdit']('teamInfo')) {
        //不能编辑不弹框，给提示
        this.changeInfo(true, true)
        return
      }
      this.$confirm('一旦确定删除，结果将无法撤回，请谨慎考虑。', '确定要删除吗？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false,
        customClass: 'self-message-box-delete',
        cancelButtonClass: 'self-message-box-delete-cancel',
        confirmButtonClass: 'self-message-box-delete-confirm'
      })
        .then(() => {
          this.demandCoopForm.tableData.some((item, index) => {
            if (row.id === item.id) {
              if (this.judgeUnit(this.demandCoopForm.tableData[index], 'demand')) return true
              this.demandCoopForm.tableData.splice(index, 1)
              this.$refs.demandCoopForm.clearValidate()
              return true
            }
          })
          this.setOptionDisabled('leadDeamndUnit')
          this.setOptionDisabled('coopDeamndUnit')
          this.changeValue()
        })
        .catch((e) => {
          this.$message({
            type: 'info',
            message: '已取消删除!',
            showClose: true
          })
        })
    },
    cooperateDemandUnitDel1 (row) { //配合承担单位删除
      if (!this.$store.getters['GROUPPLAN/blockCanEdit']('teamInfo')) {
        //不能编辑不弹框，给提示
        this.changeInfo(true, true)
        return
      }
      this.$confirm('一旦确定删除，结果将无法撤回，请谨慎考虑。', '确定要删除吗？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false,
        customClass: 'self-message-box-delete',
        cancelButtonClass: 'self-message-box-delete-cancel',
        confirmButtonClass: 'self-message-box-delete-confirm'
      })
        .then(() => {
          this.undertakeCoopForm.tableData.some((item, index) => {
            if (row.id === item.id) {
              if (this.judgeUnit(this.undertakeCoopForm.tableData[index], 'undertake')) return true
              this.undertakeCoopForm.tableData.splice(index, 1)
              this.$refs.undertakeCoopForm.clearValidate()
              return true
            }
          })
          this.setOptionDisabled('leadUndertakeUnit')
          this.setOptionDisabled('coopUndertakeUnit')
          this.changeValue()
        })
        .catch((e) => {
          this.$message({
            type: 'info',
            message: '已取消删除!',
            showClose: true
          })
        })
    },
    cooperateDemandUnitDel2 (row) { //联合攻关单位删除
      if (!this.$store.getters['GROUPPLAN/blockCanEdit']('teamInfo')) {
        //不能编辑不弹框，给提示
        this.changeInfo(true, true)
        return
      }
      this.$confirm('一旦确定删除，结果将无法撤回，请谨慎考虑。', '确定要删除吗？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false,
        customClass: 'self-message-box-delete',
        cancelButtonClass: 'self-message-box-delete-cancel',
        confirmButtonClass: 'self-message-box-delete-confirm'
      })
        .then(() => {
          this.jointForm.tableData.some((item, index) => {
            if (row.id === item.id) {
              this.jointForm.tableData.splice(index, 1)
              this.$refs.jointForm.clearValidate()
              return true
            }
          })
          this.setOptionDisabled('jointUnit')
          this.changeValue()
        })
        .catch((e) => {
          this.$message({
            type: 'info',
            message: '已取消删除!',
            showClose: true
          })
        })
    },
    judgeUnit (org, unitType) {
      let flag1 = false
      let flag2 = false
      let flag3 = false
      let flag4 = false
      flag1 = this.subprojectInfo.leadDemandUnitList.some(e => e === org.organizationCode)
      flag2 = this.subprojectInfo.achDemandUnitList.some(e => e === org.organizationCode)
      flag3 = this.subprojectInfo.leadUndertakeUnitList.some(e => e === org.organizationCode)
      flag4 = this.subprojectInfo.achUndertakeUnitList.some(e => e === org.organizationCode)
      if (flag1 && unitType === 'demand') {
        this.showUnitMessage('leadDemandUnitList', org)
        return true
      }
      if (flag2 && unitType === 'demand') {
        this.showUnitMessage('achDemandUnitList', org)
        return true
      }
      if (flag3 && unitType === 'undertake') {
        this.showUnitMessage('leadUndertakeUnitList', org)
        return true
      }
      if (flag4 && unitType === 'undertake') {
        this.showUnitMessage('achUndertakeUnitList', org)
        return true
      }
      return false
    },
    showUnitMessage (role, org) {
      this.$message({
        message: `${org.organizationName}为${this.msgMap[role]}，不能删除！`,
        type: 'warning',
        showClose: true
      })
    },
    //获取需求方和承担方清单
    getEmployerUndertaker (orgType) {
      API.getEmployerUndertaker({ orgType: orgType })
        .then(res => {
          if (res) {
            let companyList = []
            res.forEach(ele => {
              let company = {
                id: ele.id,
                organizationCode: ele.orgCode,
                organizationName: ele.orgName,
                companyCode: ele.companyCode,
                companyName: ele.companyName,
                disabled: false
              }
              companyList.push(company)
            })
            if (orgType === '1') { //需求方
              this.leadDemandUnitOptions = JSON.parse(JSON.stringify(companyList))
              this.coopDemandUnitOptions = JSON.parse(JSON.stringify(companyList))
            } else if (orgType === '2') { //承担方
              this.leadUndertakeUnitOptions = JSON.parse(JSON.stringify(companyList))
              this.coopUndertakeUnitOptions = JSON.parse(JSON.stringify(companyList))
            }
            this.renderNum++
            if (this.renderNum === 4) { //父组件数据处理完，接口获取成功
              this.initAllOptions()
            }
          }
        })
        .catch(e => {
          if (e.selfError) return
          if (e.message) {
            this.$message({
              message: e.message || '获取需求方承担方清单失败！',
              type: 'error',
              showClose: true
            })
          }
        })
    },
    //联合攻关单位列表，57家一级单位
    getJointUnitList () {
      API.provinceAbbr()
        .then(res => {
          if (res) {
            let companyList = []
            res.forEach(ele => {
              let company = {
                id: ele.id,
                organizationCode: ele.orgCode,
                organizationName: ele.orgName,
                companyCode: ele.abbr,
                companyName: ele.companyName,
                disabled: false
              }
              companyList.push(company)
            })
            this.jointUnitOptions = companyList
            this.renderNum++
            if (this.renderNum === 4) { //父组件数据处理完，接口获取成功
              this.initAllOptions()
            }
          }
        })
        .catch(e => {
          if (e.selfError) return
          if (e.message) {
            this.$message({
              message: e.message || '获取省端独立域列表失败！',
              type: 'error',
              showClose: true
            })
          }
        })
    },
    //获取项目经理列表
    getUserList (orgCode, unitType, isLead, userNameLike = '') {
      let params = {
        orgCode: orgCode,
        userNameLike: userNameLike,
        inSub: 1,
        pageNum: 1,
        pageSize: 50
      }
      API.allUserPageByorgCode(params)
        .then(res => {
          if (!res || !res.records) return
          let userList = []
          res.records.forEach(ele => {
            let user = {
              organizationCode: ele.orgCode,
              companyCode: ele.companyCode,
              userName: ele.chineseName,
              employeeNum: ele.employeeNum,
              userAccount: ele.uid,
              disabled: false
            }
            userList.push(user)
          })
          if (unitType === 'demand') {
            if (isLead === '1') {
              this.leadDemandManagerOptions = JSON.parse(JSON.stringify(userList))
              let temp = this.demandLeadForm.leadManager
              let flag = this.leadDemandManagerOptions.some(ele => ele.userAccount === temp.userAccount)
              if (temp.userAccount && !flag) {
                this.leadDemandManagerOptions.unshift({
                  organizationCode: temp.organizationCode,
                  companyCode: temp.companyCode,
                  userName: temp.userName,
                  employeeNum: temp.employeeNum,
                  userAccount: temp.userAccount,
                  disabled: false
                })
              }
            } else {
              this.coopDemandManagerOptions = JSON.parse(JSON.stringify(userList))
            }
          } else if (unitType === 'undertake') {
            if (isLead === '1') {
              this.leadUndertakeManagerOptions = JSON.parse(JSON.stringify(userList))
              let temp = this.undertakeLeadForm.leadManager
              let flag = this.leadUndertakeManagerOptions.some(ele => ele.userAccount === temp.userAccount)
              if (temp.userAccount && !flag) {
                this.leadUndertakeManagerOptions.unshift({
                  organizationCode: temp.organizationCode,
                  companyCode: temp.companyCode,
                  userName: temp.userName,
                  employeeNum: temp.employeeNum,
                  userAccount: temp.userAccount,
                  disabled: false
                })
              }
            } else {
              this.coopUndertakeManagerOptions = JSON.parse(JSON.stringify(userList))
            }
          }
          this.initManageOptions()
        })
        .catch(e => {
          if (e.selfError) return
          if (e.message) {
            this.$message({
              message: e.message || '获取用户列表失败！',
              type: 'error',
              showClose: true
            })
          }
        })
    },
    //牵头需求单位变化
    changeLeadDemandUnit (val) {
      this.demandLeadForm.leadManager = { userAccount: '' }
      this.demandLeadForm.demandLeadMembers = []
      if (!val) {
        this.leadDemandManagerOptions = []
        this.setOptionDisabled('leadDeamndUnit')
        this.setOptionDisabled('coopDeamndUnit')
      } else {
        this.setOptionDisabled('leadDeamndUnit')
        this.leadDemandUnitOptions.some(ele => {
          if (ele.organizationCode === val) {
            this.demandLeadForm.organizationName = ele.organizationName
            this.demandLeadForm.companyCode = ele.companyCode
            this.demandLeadForm.companyName = ele.companyName
            return true
          }
        })
        //this.getUserList(this.demandLeadForm.organizationCode, 'demand', '1')
      }
      this.changeValue()
    },
    //配合需求单位变化
    changeCoopDemandUnit (val, index) {
      this.demandCoopForm.tableData[index].organizationName = ''
      this.demandCoopForm.tableData[index].leadManager = { userAccount: '' }
      this.demandCoopForm.tableData[index].projectTeamList = []
      if (!val) {
        this.coopDemandManagerOptions = []
        this.setOptionDisabled('leadDeamndUnit')
        this.setOptionDisabled('coopDeamndUnit')
      } else {
        this.coopDemandUnitOptions.some(ele => {
          if (ele.organizationCode === val) {
            this.demandCoopForm.tableData[index].organizationName = ele.organizationName
            return true
          }
        })
        this.setOptionDisabled('coopDeamndUnit')
        //this.getUserList(this.demandCoopForm.tableData[index].organizationCode, 'demand', '0')
      }
      this.changeValue()
    },
    //牵头承担单位变化
    changeLeadUndertakeUnit (val) {
      this.$message({
        type: 'warning',
        message: '单位变更需要及时修改项目负责人和责任领导',
        showClose: true
      })
      this.undertakeLeadForm.leadManager = { userAccount: '' }
      this.undertakeLeadForm.undertakeLeadMembers = []
      if (!val) {
        this.leadUndertakeManagerOptions = []
        this.setOptionDisabled('leadUndertakeUnit')
        this.setOptionDisabled('coopUndertakeUnit')
      } else {
        this.setOptionDisabled('leadUndertakeUnit')
        this.leadUndertakeUnitOptions.some(ele => {
          if (ele.organizationCode === val) {
            this.undertakeLeadForm.organizationName = ele.organizationName
            this.undertakeLeadForm.companyCode = ele.companyCode
            this.undertakeLeadForm.companyName = ele.companyName
            return true
          }
        })
        //this.getUserList(this.undertakeLeadForm.organizationCode, 'undertake', '1')
      }
      this.changeValue()
    },
    //配合承担单位变化
    changeCoopUndertakeUnit (val, index) {
      this.undertakeCoopForm.tableData[index].organizationName = ''
      this.undertakeCoopForm.tableData[index].leadManager = { userAccount: '' }
      this.undertakeCoopForm.tableData[index].projectTeamList = []
      if (!val) {
        this.coopUndertakeManagerOptions = []
        this.setOptionDisabled('leadUndertakeUnit')
        this.setOptionDisabled('coopUndertakeUnit')
      } else {
        this.coopUndertakeUnitOptions.some(ele => {
          if (ele.organizationCode === val) {
            this.undertakeCoopForm.tableData[index].organizationName = ele.organizationName
            return true
          }
        })
        this.setOptionDisabled('coopUndertakeUnit')
        //this.getUserList(this.undertakeCoopForm.tableData[index].organizationCode, 'undertake', '0')
      }
      this.changeValue()
    },
    //联合攻关单位变化
    changeJointUnit (val, index) {
      this.setOptionDisabled('jointUnit')
      this.jointForm.tableData[index].projectTeamList = []
      this.jointForm.tableData[index].organizationName = ''
      this.jointUnitOptions.some(ele => {
        if (ele.organizationCode === val) {
          this.jointForm.tableData[index].organizationName = ele.organizationName
          return true
        }
      })
      this.changeInfo()
    },
    //牵头需求单位项目经理变化
    changeDemandLeadManager (val) {
      if (val) {
        this.leadDemandManagerOptions.some(ele => {
          if (ele.userAccount === val) {
            let tempUser = Object.assign({}, ele)
            tempUser.projectRoleCode = 'PR-LEADER-DEMAND-MANAGER'
            this.demandLeadForm.leadManager = tempUser
            return true
          }
        })
      } else {
        this.setManagerOptions('demandLeadMembers')
      }
      this.changeValue()
    },
    //牵头承担单位项目经理变化
    changeUndertakeLeadManager (val) {
      if (val) {
        this.leadUndertakeManagerOptions.some(ele => {
          if (ele.userAccount === val) {
            let tempUser = Object.assign({}, ele)
            tempUser.projectRoleCode = 'PR-LEADER-UNDERTAKER-MANAGER'
            this.undertakeLeadForm.leadManager = tempUser
            return true
          }
        })
      } else {
        this.setManagerOptions('undertakeLeadMembers')
      }
      this.changeValue()
    },
    //设置单位列表的禁用选项
    setOptionDisabled (type) {
      let options = []
      let orgs = []
      switch (type) {
        case 'leadDeamndUnit':
          options = this.coopDemandUnitOptions
          orgs.push(this.demandLeadForm.organizationCode)
          this.demandCoopForm.tableData.forEach(ele => {
            orgs.push(ele.organizationCode)
          })
          break
        case 'coopDeamndUnit':
          options = this.leadDemandUnitOptions
          orgs.push(this.demandLeadForm.organizationCode)
          this.demandCoopForm.tableData.forEach(ele => {
            orgs.push(ele.organizationCode)
          })
          break
        case 'leadUndertakeUnit':
          options = this.coopUndertakeUnitOptions
          orgs.push(this.undertakeLeadForm.organizationCode)
          this.undertakeCoopForm.tableData.forEach(ele => {
            orgs.push(ele.organizationCode)
          })
          break
        case 'coopUndertakeUnit':
          options = this.leadUndertakeUnitOptions
          orgs.push(this.undertakeLeadForm.organizationCode)
          this.undertakeCoopForm.tableData.forEach(ele => {
            orgs.push(ele.organizationCode)
          })
          break
        case 'jointUnit':
          options = this.jointUnitOptions
          this.jointForm.tableData.forEach(ele => {
            orgs.push(ele.organizationCode)
          })
          break
      }
      options.forEach(ele => {
        let flag = orgs.some(orgCode => orgCode === ele.organizationCode)
        ele.disabled = flag
      })
    },
    //初始化单位列表的禁用选项
    initAllOptions () {
      this.setOptionDisabled('leadDeamndUnit')
      this.setOptionDisabled('coopDeamndUnit')
      this.setOptionDisabled('leadUndertakeUnit')
      this.setOptionDisabled('coopUndertakeUnit')
      this.setOptionDisabled('jointUnit')
    },
    //设置项目经理的禁用选项
    setManagerOptions (type) {
      let options = []
      let users = []
      switch (type) {
        case 'demandLeadMembers':
          options = this.leadDemandManagerOptions
          this.demandLeadForm.demandLeadMembers.forEach(ele => {
            users.push(ele.userAccount)
          })
          break
        case 'coopDemandMember':
          options = this.coopDemandManagerOptions
          if (this.demandCoopForm.tableData.length) {
            this.demandCoopForm.tableData[this.demandCoopForm.tableData.length - 1].projectTeamList.forEach(ele => {
              users.push(ele.userAccount)
            })
          }
          break
        case 'undertakeLeadMembers':
          options = this.leadUndertakeManagerOptions
          this.undertakeLeadForm.undertakeLeadMembers.forEach(ele => {
            users.push(ele.userAccount)
          })
          break
        case 'coopUndertakeMember':
          options = this.coopUndertakeManagerOptions
          if (this.undertakeCoopForm.tableData.length) {
            this.undertakeCoopForm.tableData[this.undertakeCoopForm.tableData.length - 1].projectTeamList.forEach(ele => {
              users.push(ele.userAccount)
            })
          }
          break
      }
      options.forEach(ele => {
        let flag = users.some(userAccount => userAccount === ele.userAccount)
        ele.disabled = flag
      })
    },
    initManageOptions () {
      this.setManagerOptions('demandLeadMembers')
      this.setManagerOptions('coopDemandMember')
      this.setManagerOptions('undertakeLeadMembers')
      this.setManagerOptions('coopUndertakeMember')
    },
    //有信息发生修改
    changeInfo (edited = true, msg = false) {
      let params = {
        curBlock: 'teamInfo',
        hasEdited: edited,
        onlyShowMsg: msg
      }
      bus.$emit('groupPlanProjectEdit', params)
    },
    //传给子项目做联动
    changeValue (isInit = false) {
      if (!isInit) { //不是初始化时才执行
        this.changeInfo()
      }
      this.$nextTick(() => {
        let data = this.getSubmitData()
        bus.$emit('changeTeamInfo', data)
      })
    },
    addEventListener () {
      bus.$on('updateSubprojectInfo', data => {
        this.subprojectInfo = data

        let deamndUnitFlag = this.judgeIn([data.leadDemandUnitList, data.achDemandUnitList], this.demandLeadForm.organizationCode)
        let undertakeUnitFlag = this.judgeIn([data.leadUndertakeUnitList, data.achUndertakeUnitList], this.undertakeLeadForm.organizationCode)

        let deamndUserFlag = this.judgeIn([data.leadDemandManagerList, data.achDemandResponsibleList], this.demandLeadForm.leadManager.userAccount)
        let undertakeUserFlag = this.judgeIn([data.leadUndertakeManagerList, data.achUndertakeResponsibleList], this.undertakeLeadForm.leadManager.userAccount)

        this.$set(this.demandLeadForm, 'unitDisabled', deamndUnitFlag)
        this.$set(this.undertakeLeadForm, 'unitDisabled', undertakeUnitFlag)
        this.$set(this.demandLeadForm.leadManager, 'disabled', deamndUserFlag)
        this.$set(this.undertakeLeadForm.leadManager, 'disabled', undertakeUserFlag)
        this.demandCoopForm.tableData.some(ele => {
          if (ele.id === 'addid') {
            this.$set(ele, 'unitDisabled', ele.organizationCode && this.judgeIn([data.leadDemandUnitList, data.achDemandUnitList], ele.organizationCode))
            if (ele.leadManager.userAccount) {
              this.$set(ele, 'disabled', ele.leadManager.userAccount && this.judgeIn([data.leadDemandManagerList, data.achDemandResponsibleList], ele.leadManager.userAccount))
            }
            return true
          }
        })
        this.undertakeCoopForm.tableData.some(ele => {
          if (ele.id === 'addid') {
            this.$set(ele, 'unitDisabled', ele.organizationCode && this.judgeIn([data.leadUndertakeUnitList, data.achUndertakeUnitList], ele.organizationCode))
            if (ele.leadManager.userAccount) {
              this.$set(ele, 'disabled', ele.leadManager.userAccount && this.judgeIn([data.leadUndertakeManagerList, data.achUndertakeResponsibleList], ele.leadManager.userAccount))
            }
            return true
          }
        })
      })
    },
    judgeIn (arr, value) {
      let flag = false
      arr.some(ele => {
        flag = ele.some(code => code === value)
        if (flag) {
          return true
        }
      })
      return flag
    }
  },
  created () {
    this.getEmployerUndertaker('1')//需求方单位清单
    this.getEmployerUndertaker('2')//承担方单位清单
    this.getJointUnitList()//联合攻关单位
    this.addEventListener()
  }
}
</script>
<style lang="scss" scoped>
.project-panel .panel-body {
  margin-bottom: 0;
}
.DSTeamInfoEdit /deep/{
  .project-panel .panel-body{
    margin-bottom: 0;
  }
  .xmcy .el-form-item__content {
    display: inline-block;
    vertical-align: top;
     width: 100%;
  }
   .row-item{
     box-sizing: border-box;
     margin-top: 3px;
      min-height: 30px;
      line-height: 30px;
      border: 1px solid #E5E5E5;
      border-radius: 2px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      &.error{
        border: 1px solid red;
      }
      .el-tag{
        background: none;
        border: none;
        font-size: 12px;
        color: #333;
        height: 29px;
        /deep/ .el-tag__close{
          color: #999;
          &:hover{
            background: none !important;
          }
        }
      }
      .add-icon{
        flex-shrink: 0;
        text-align: center;
        width: 30px;
        margin: auto 0;
        @include color();
        cursor: pointer;
      }
      .placeholder{
        color: #999;
        padding-left: 10px;
      }
    }
    .el-form-item .el-input__inner{
      width : 100%;
    }
    .el-select{
      width:100%;
    }
     .addcon{
       border: 1px solid #E9E9E9;
       margin-bottom: 20px;
       &:last-child{
         margin-bottom: 0;
       }
    }
    .required span{
      position: relative;
        &::before{
          // font-size: 20px;
          color: red;
          content: '*';
          position: absolute;
          left: -10px;
          top: 0px;
      }
    }
    .tableForm{
      border: 1px solid #E9E9E9;
      border-bottom: none;
    }
    .el-form-item.coop{
      width:100%;
      /deep/{
      .el-form-item__content{
        width:100%;
        .row-item{
        width:100%;
        }
        }
      }
    }
}
</style>
