<template>
    <div class="header">
        <!-- 折叠按钮 -->
        <div class="collapse-btn" @click="collapseChage">
            <i v-if="!collapse" class="el-icon-s-fold"></i>
            <i v-else class="el-icon-s-unfold"></i>
        </div>
        <div class="logo">{{baseForm.nickname}}个人博客后台管理系统</div>
        <div class="header-right">
            <div class="header-user-con">
                <!-- 全屏显示 -->
                <div class="btn-fullscreen" @click="handleFullScreen">
                    <el-tooltip effect="dark" :content="fullscreen ? `取消全屏` : `全屏`" placement="bottom">
                        <i class="el-icon-rank"></i>
                    </el-tooltip>
                </div>
                <!-- 消息中心 -->
                <!-- <div class="btn-bell">
                    <el-tooltip effect="dark" :content="message ? `有${message}条未读消息` : `消息中心`" placement="bottom">
                        <router-link to="/tabs">
                            <i class="el-icon-bell"></i>
                        </router-link>
                    </el-tooltip>
                    <span class="btn-bell-badge" v-if="message"></span>
                </div> -->
                <!-- 用户头像 -->
                <div class="user-avator">
                    <img src="https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=2855204159,1294025145&fm=26&gp=0.jpg" />
                </div>
                <!-- 用户名下拉菜单 -->
                <el-dropdown class="user-name" trigger="click" @command="handleCommand">
                    <span class="el-dropdown-link">
                        {{ baseForm.nickname }}
                        <i class="el-icon-caret-bottom"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <a href="https://github.com/lin-xin/vue-manage-system" target="_blank">
                            <el-dropdown-item>项目仓库</el-dropdown-item>
                        </a>
                        <el-dropdown-item divided command="editPassword">修改密码</el-dropdown-item>
                        <el-dropdown-item divided command="loginout">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </div>
        <el-dialog title="修改密码" :visible.sync="editPwdVisible" width="30%" :close-on-click-modal="false" :before-close="editCancel">
            <el-form :model="pwdForm" ref="pwdFormRef" :rules="pwdFormRules" label-width="100px">
                <el-form-item label="用户名" >
                    <el-input v-model="baseForm.name" disabled></el-input>
                </el-form-item>
                <el-form-item label="原密码" prop="oldPwd">
                    <el-input v-model="pwdForm.oldPwd" type="password" placeholder="请输入原密码"></el-input>
                </el-form-item>
                <el-form-item label="新密码" prop="newPwd">
                    <el-input v-model="pwdForm.newPwd" type="password" id="newkey" placeholder="请输入新密码"></el-input>
                </el-form-item>
                <el-form-item label="确认新密码" prop="checkNewPwd">
                    <el-input v-model="pwdForm.checkNewPwd" type="password" id="newkey1" placeholder="请确认新密码"></el-input>
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
import bus from '../common/bus';
import { updateUserInfo, getUserInfoById } from '@/api/index';
import md5 from 'js-md5';
export default {
    data() {
        /*****检验两次密码是否一致***/
        var validatePass = (rule, value, callback) => {
            if (value === this.pwdForm.oldPwd) {
                callback(new Error('新密码不能与原密码相同'));
            } else {
                if (this.pwdForm.checkNewPwd !== '') {
                    this.$refs.pwdFormRef.validateField('checkNewPwd');
                }
                callback();
            }
        };
        var validatePass2 = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请再次输入密码'));
            } else if (value !== this.pwdForm.newPwd) {
                callback(new Error('两次输入密码不一致!'));
            } else {
                callback();
            }
        };
        return {
            collapse: false,
            fullscreen: false,
            message: 2,
            editPwdVisible: false,
            pwdForm: {},
            baseForm: {},
            pwdFormRules: {
                oldPwd: [
                    {
                        required: true,
                        trigger: 'blur',
                        message: '请输入密码'
                    }
                ],
                newPwd: [
                    {
                        validator: validatePass,
                        trigger: 'blur',
                        required: true
                    }
                ],
                checkNewPwd: [
                    {
                        validator: validatePass2,
                        trigger: 'blur',
                        required: true
                    }
                ]
            }
        };
    },
    created() {
        this.getUserInfo();
    },
    methods: {
        async getUserInfo() {
            const { data: res } = await getUserInfoById(2);
            this.baseForm = res.result_data;
        },
        // 用户名下拉菜单选择事件
        handleCommand(command) {
            if (command == 'loginout') {
                this.$confirm('此操作将退出登录, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                    .then(() => {
                        sessionStorage.removeItem('ms_username');
                        this.$router.push('/login');
                        this.$message({
                            type: 'success',
                            message: '退出成功!'
                        });
                    })
                    .catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消退出'
                        });
                    });
            } else if (command == 'editPassword') {
                this.editPwdVisible = true;
            }
        },
        editCancel() {
            this.editPwdVisible = false;
            this.$refs.pwdFormRef.resetFields();
        },
        editSubmit() {
            this.$refs.pwdFormRef.validate(async valid => {
                if (!valid) return;
                else {
                    let user_ticket = md5(md5(this.baseForm.name.toLowerCase() + md5(this.pwdForm.newPwd)).toLowerCase());
                    const { data: res } = await updateUserInfo({
                        id: this.baseForm.id,
                        name: this.baseForm.name,
                        user_ticket: user_ticket
                    });
                    if(res.error_code === 10000){
                        this.editPwdVisible = false
                        this.$message.success('密码修改成功,请重新登录！')
                        sessionStorage.removeItem('ms_username');
                        this.$router.push('/login');
                    };
                }
            });
        },
        // 侧边栏折叠
        collapseChage() {
            this.collapse = !this.collapse;
            bus.$emit('collapse', this.collapse);
        },
        // 全屏事件
        handleFullScreen() {
            let element = document.documentElement;
            if (this.fullscreen) {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.webkitCancelFullScreen) {
                    document.webkitCancelFullScreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                }
            } else {
                if (element.requestFullscreen) {
                    element.requestFullscreen();
                } else if (element.webkitRequestFullScreen) {
                    element.webkitRequestFullScreen();
                } else if (element.mozRequestFullScreen) {
                    element.mozRequestFullScreen();
                } else if (element.msRequestFullscreen) {
                    // IE11
                    element.msRequestFullscreen();
                }
            }
            this.fullscreen = !this.fullscreen;
        }
    },
    mounted() {
        if (document.body.clientWidth < 1500) {
            this.collapseChage();
        }
    }
};
</script>
<style scoped>
.header {
    position: relative;
    box-sizing: border-box;
    width: 100%;
    height: 70px;
    font-size: 22px;
    color: #fff;
}
.collapse-btn {
    float: left;
    padding: 0 21px;
    cursor: pointer;
    line-height: 70px;
}
.header .logo {
    float: left;
    width: 300px;
    line-height: 70px;
}
.header-right {
    float: right;
    padding-right: 50px;
}
.header-user-con {
    display: flex;
    height: 70px;
    align-items: center;
}
.btn-fullscreen {
    transform: rotate(45deg);
    margin-right: 5px;
    font-size: 24px;
}
.btn-bell,
.btn-fullscreen {
    position: relative;
    width: 30px;
    height: 30px;
    text-align: center;
    border-radius: 15px;
    cursor: pointer;
}
.btn-bell-badge {
    position: absolute;
    right: 0;
    top: -2px;
    width: 8px;
    height: 8px;
    border-radius: 4px;
    background: #f56c6c;
    color: #fff;
}
.btn-bell .el-icon-bell {
    color: #fff;
}
.user-name {
    margin-left: 10px;
}
.user-avator {
    margin-left: 20px;
}
.user-avator img {
    display: block;
    width: 40px;
    height: 40px;
    border-radius: 50%;
}
.el-dropdown-link {
    color: #fff;
    cursor: pointer;
}
.el-dropdown-menu__item {
    text-align: center;
}
</style>
