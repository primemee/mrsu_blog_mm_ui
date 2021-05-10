<template>
    <div class="aboutMe">
        <!-- 顶部面包屑 -->
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item> <i class="el-icon-lx-people"></i> 关于我 </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="aboutMeContent">
            <el-card>
                <div class="baseInfo" id="baseInfo">
                    <h3>基本信息</h3>
                    <el-form :model="baseForm" label-width="80px">
                        <el-row style="marginTop:10px">
                            <el-col :span="12">
                                <el-form-item label="用户名" prop="name">
                                    <el-input disabled style="width:60%" v-model="baseForm.name"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="昵称" prop="nickname">
                                    <el-input disabled style="width:60%" v-model="baseForm.nickname"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="邮箱" prop="email">
                                    <el-input disabled style="width:60%" v-model="baseForm.email"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="QQ" prop="qq">
                                    <el-input disabled style="width:60%" v-model="baseForm.qq"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-form-item label="个人简介" prop="content">
                            <el-input disabled style="width:81.5%" type="textarea" :rows="3" v-model="baseForm.content"></el-input>
                        </el-form-item>
                    </el-form>
                    <el-button class="editBtn" type="primary" @click="isShowEditDialog">编辑基本信息</el-button>
                </div>
            </el-card>

            <el-card class="workInfo" id="workInfo">
                <div>
                    <h3>工作经历</h3>
                    <h4>2020.11~今 中电福富信息科技有限公司</h4>
                    <p>前端开发工程师实习生</p>
                </div>
            </el-card>
            <el-card class="projectInfo" id="projectInfo">
                <div>
                    <h3>项目经历</h3>
                    <h4>电商后台管理系统</h4>
                    <p>
                        1. 项目简介：本项目基于 vue 和 element-ui 实现，使用网络视频课程中提供的数据接口完成了电商后台管理的基
                        本页面（登录页、后台管理页，数据的增删改查等）
                    </p>
                    <p>2. 项目亮点：</p>
                    <ul class="ulc">
                        <li>
                            使用了大量 Element UI 组件快速构建页面，如：Layout 布局、Icon 图标、Form 表单、Message 消息提示、 Container
                            布局容器、Input 输入框、NavMenu 导航菜单等
                        </li>
                        <li>使用了 Vue Router 进行前端路由跳转，登录路由导航等</li>
                        <li>使用了 sessionStorage 存储用户登录的 token</li>
                        <li>使用 axios 配置网络数据请求接口</li>
                    </ul>
                    <p>3.涉及技术：Vue、Vue Router、axios、Element 等</p>
                </div>
            </el-card>
            <el-card class="projectInfo">
                <div>
                    <h4>仿网易云音乐</h4>
                    <p>
                        1. 项目简介：本项目是本人在自学完成小撩买菜 APP 后进行的练手项目，使用 vue 组件化思想，网易云音乐提供
                        的数据接口完成了仿网易云音乐的基本页面（真实手机号密码或验证码登录、发现页、我的、电台、视频、搜索）
                    </p>
                    <p>2. 项目亮点：</p>
                    <ul class="ulc">
                        <li>
                            使用了大量 Vant UI 组件快速构建页面，如：Layout 布局、Icon 图标、Search 搜索、Grid 宫格、Cell 单元格、 Field
                            输入框、Tab 标签页、Sticky 粘性布局、Progress 进度条、Toast 提示等
                        </li>
                        <li>使用了 Vue Router 进行前端路由跳转，登录路由导航等</li>
                        <li>使用了 localStorage 存储用户登录的 token</li>
                        <li>使用 Vuex 完成用户信息的添加、删除</li>
                        <li>
                            使用了封装思想，封装 axios 网络数据请求接口；封装其他主页面可复用的顶部导航栏、单首歌曲、歌单详情、
                            播放歌曲页、视频列表等组件，易于使用和维护
                        </li>
                        <li>使用 Vant-Loading 页面加载，Lazyload 图片懒加载</li>
                    </ul>
                    <p>3.涉及技术：Vue、Vue Router、Vuex、axios、Vant、Swiper 等</p>
                </div>
            </el-card>
        </div>
        <el-dialog title="编辑基本信息" :visible.sync="editDialogVisible" width="30%" :close-on-click-modal="false" :before-close="editCancel">
            <el-form ref="editFormRef" :model="editForm" :rules="editFormRules" label-width="80px">
                <el-form-item label="用户名" prop="name">
                    <el-input v-model="editForm.name"></el-input>
                </el-form-item>
                <el-form-item label="昵称" prop="nickname">
                    <el-input v-model="editForm.nickname"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="editForm.email"></el-input>
                </el-form-item>
                <el-form-item label="QQ" prop="qq">
                    <el-input v-model="editForm.qq"></el-input>
                </el-form-item>
                <el-form-item label="简介" prop="content">
                    <el-input type="textarea" v-model="editForm.content" :rows="3"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editCancel">取 消</el-button>
                <el-button type="primary" @click="editSubmit">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { updateUserInfo, getUserInfoById } from '@/api/index.js';
export default {
    data() {
        return {
            editDialogVisible: false,//编辑对话框是否显示
            //编辑表单对象
            editForm: {
                name: '',
                nickname: '',
                email: '',
                qq: '',
                content: ''
            },
            //基本信息对象
            baseForm: {},
            //编辑表单验证规则
            editFormRules: {
                name: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
                nickname: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
                email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
                qq: [{ required: true, message: '请输入QQ', trigger: 'blur' }],
                content: [{ required: true, message: '请输入简介', trigger: 'blur' }]
            }
        };
    },
    created() {
        this.getUserInfo();
    },
    methods: {
        //请求个人信息数据
        async getUserInfo() {
            const { data: res } = await getUserInfoById(2);
            this.editForm = res.result_data;
            this.baseForm = JSON.parse(JSON.stringify(this.editForm));
        },
        //是否展示编辑对话框
        isShowEditDialog() {
            this.editDialogVisible = true;
        },
        //编辑提交
        async editSubmit() {
            this.$refs.editFormRef.validate(async valid => {
                if (!valid) return;
                else{
                  const { data: res } = await updateUserInfo(this.editForm);
                if (res.error_code === 10000) {
                    this.editDialogVisible = false;
                    this.getUserInfo();
                    this.$message.success('修改基本信息成功！');
                }
                }
                
            });
        },
        //编辑对话框关闭
        editCancel(){
          this.editDialogVisible = false
          this.$refs.editFormRef.resetFields()
        }
    }
};
</script>

<style lang="scss">
.aboutMe {
    .workInfo,
    .projectInfo {
        margin-top: 10px;
    }
    .ulc {
        margin-left: 20px;
        margin-top: 10px;
    }
    .baseInfo {
        position: relative;
        .editBtn {
            position: absolute;
            right: 0;
            top: 0;
        }
    }
}
</style>
