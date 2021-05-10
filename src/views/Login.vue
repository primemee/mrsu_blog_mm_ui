<template>
    <div class="login">
        <el-card class="loginCard">
            <h1>Mr.Su个人博客登录</h1>
            <el-form ref="userFormRef" :model="userForm" :rules="userFormRules" label-width="55px">
                <el-form-item label="账号" prop="userName">
                    <el-input v-model="userForm.userName" clearable :maxlength="11" placeholder="请输入账号"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="userPwd">
                    <el-input v-model="userForm.userPwd" clearable show-password placeholder="请输入密码"></el-input>
                </el-form-item>
            </el-form>
            <el-button type="primary" size="medium" @click="toLogin">登录</el-button>
        </el-card>
    </div>
</template>

<script>
import { login } from '@/api/login.js';
// import utils from '@/utils/utils.js'
import md5 from 'js-md5';
export default {
    data() {
        return {
            //用户表单对象
            userForm: {
                userName: '',
                userPwd: ''
            },
            //用户表单验证规则
            userFormRules: {
                userName: [
                    { required: true, message: '请输入账号', trigger: 'blur' },
                    { max: 11, message: '长度最大为 11 个字符', trigger: 'blur' }
                ],
                userPwd: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 6, message: '长度最小为 6 个字符', trigger: 'blur' }
                ]
            }
        };
    },
    methods: {
        //登录提交
        toLogin() {
            this.$refs.userFormRef.validate(async valid => {
                if (!valid) return;
                var timestamp = Date.parse(new Date()) / 1000;
                let user_ticket = md5(
                    md5(md5(this.userForm.userName.toLowerCase() + md5(this.userForm.userPwd)).toLowerCase()) + timestamp
                );
                const { data: res } = await login({
                    user_ticket: user_ticket,
                    name: this.userForm.userName,
                    timestamp: timestamp
                });
                if (res.error_code === 10000) {
                    this.$notify({
                        title: '登录成功！',
                        message: '欢迎进入Mr.Su个人博客后台管理系统！',
                        duration: 3000
                    });
                    sessionStorage.setItem('ms_username', this.userForm.userName);
                    this.$router.push('/');
                } else {
                    this.$message.error('用户名或密码错误，请重新登录！');
                    // this.$refs.userFormRef.resetFields()
                }
            });
        }
    }
};
</script>

<style lang="scss" scoped>
.login {
    width: 100%;
    min-height: 550px;
    background: url(../assets/images/loginBg.png) no-repeat;
    background-position: 12% 60px;
    overflow: auto;
    background-size: contain;
    .loginCard {
        margin: 10% auto 0 62%;
        padding: 25px;
        max-width: 300px;
        max-height: 400px;
        text-align: center;
        h1 {
            font-size: 25px;
        }
        .el-form {
            margin-top: 20px;
        }
        .el-input {
            padding-top: 10px;
        }
        .el-button {
            width: 100%;
            margin-top: 30px;
        }
    }
}
</style>
<style lang="scss">
.loginCard {
    .el-input__icon {
        padding-top: 8px;
    }
    .el-form-item__label {
        padding: 4% 12px 0 0;
    }
}
</style>
