<template>
    <div class="aricleAdd">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-edit"></i> 新增文章</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-card>
            <div class="form">
                <el-form ref="form" :model="form" :rules="formRules" label-width="80px" >
                    <el-form-item label="文章标题" prop="title">
                        <el-input v-model="form.title" style="width:30%" maxlength="20"></el-input>
                    </el-form-item>
                    <el-form-item label="文章类型">
                        <el-tag
                            style="marginRight:10px"
                            size="medium"
                            :key="index"
                            v-for="(tag, index) in form.classify"
                            closable
                            :disable-transitions="false"
                            @close="handleClose(tag)"
                        >
                            {{ tag }}
                        </el-tag>
                        <el-select v-model="value" @change="selectChange" placeholder="请选择">
                            <el-option v-for="(item, index) in classifyList" :key="index" :label="item" :value="item"> </el-option>
                        </el-select>
                        <el-input
                            class="input-new-tag"
                            v-if="inputVisible"
                            v-model="inputValue"
                            ref="saveTagInput"
                            size="small"
                            @keyup.enter.native="handleInputConfirm"
                            @blur="handleInputConfirm"
                        >
                        </el-input>
                        <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <el-upload
                :show-file-list="false"
                style="display:none"
                :action="imageUrl"
                :on-success="handleSuccess"
                accept="image/jpeg,image/gif,image/png"
            >
                <el-button type="primary"></el-button>
            </el-upload>

            <quill-editor ref="myTextEditor" v-model="content" :options="editorOption"></quill-editor>
            <div class="btn">
                <el-button class="editor-btn" type="primary" @click="submit">提交</el-button>
                <el-button class="editor-btn" type="" @click="clear">重置</el-button>
            </div>
        </el-card>
    </div>
</template>

<script>
import { aricleAdd } from '@/api/index.js';
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';
import { quillEditor } from 'vue-quill-editor';
//富文本编辑器基本配置
const toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'], // toggled buttons
    ['blockquote', 'code-block'],
    [{ header: 1 }, { header: 2 }], // custom button values
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
    [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
    [{ direction: 'rtl' }], // text direction
    [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
    [{ header: [1, 2, 3, 4, 5, 6, false] }],

    [{ color: [] }, { background: [] }], // dropdown with defaults from theme
    [{ font: [] }],
    [{ align: [] }],
    ['link', 'image']
];
export default {
    data() {
        return {
            //标签数组
            classifyList: [
                'Git',
                'svn',
                'javascript',
                'php',
                'css',
                'vue',
                'html',
                'echarts',
                'java',
                'html5',
                'element-ui',
                'iview-ui',
                'python',
                'node.js',
                'c++',
                'c objective-c',
                'golang',
                'shell',
                'swift',
                'c#',
                'ruby',
                'bash',
                'typescript',
                'sass asp.net',
                'less',
                'lua',
                'scala',
                'coffeescript',
                'actionscript',
                'erlang',
                'perl',
                'rust',
                'laravel',
                'spring',
                'django',
                'flask',
                'express',
                'ruby-on-rails',
                'yii',
                'tornado',
                'koa',
                'linux',
                'nginx',
                'apache',
                'docker',
                'ubuntu',
                'centos',
                'tomcat',
                'hadoop',
                'mysql',
                'redis',
                'mongodb',
                'oracle',
                'nosql',
                'memcached',
                'sqlserver',
                'sqlite',
                'postgresql'
            ],
            //文章表单
            form: {
                title: '',
                classify: [],
                type: '0'
            },
            //文章表单验证规则
            formRules: {
                title: [{ required: true, message: '请输入文章标题', trigger: 'blur' }]
            },
            //文本内容
            content: '',
            //富文本编辑器配置
            editorOption: {
                modules: {
                    toolbar: {
                        container: toolbarOptions, // 工具栏
                        handlers: {
                            image: function(value) {
                                if (value) {
                                    //触发el-upload自带的上传组件
                                    document.querySelector('.el-upload input').click();
                                } else {
                                    this.quill.format('image', false);
                                }
                            }
                        }
                    }
                },
                placeholder: 'Hello World'
            },
            //是否展示输入框
            inputVisible: false,
            //输入值
            inputValue: '',
            //选择框值
            value: '',
            //标签
            classify: '',
            //文章内容
            content: '',
            html: '',
            //上传图片后端地址
            imageUrl: 'http://localhost:8081/article/v1/upload'
        };
    },
    components: {
        quillEditor
    },
    methods: {
        //选择框改变时
        selectChange(value) {
            if (!this.form.classify.includes(value)) {
                this.form.classify.push(value);
            }
        },
        //tag标签关闭时
        handleClose(tag) {
            this.form.classify.splice(this.form.classify.indexOf(tag), 1);
        },
        //图片上传成功时
        handleSuccess(res) {
            // 获取富文本组件实例
            let quill = this.$refs.myTextEditor.quill;
            // 如果上传成功
            if (res) {
                var url = 'http://localhost:8081' + res.realName;
                quill.focus();
                quill.insertEmbed(quill.getSelection().index, 'image', url);
                // 调整光标到最后
                quill.setSelection(length + 1);
            } else {
                // 提示信息，需引入Message
                this.$message.error('图片插入失败');
            }
        },
        //文章提交
        submit() {
            this.$refs.form.validate(async valid => {
                if (!valid) return;
                const { data: res } = await aricleAdd({
                    title: this.form.title,
                    type: parseInt(this.form.type),
                    content: this.content,
                    classify: this.form.classify.join(',')
                });
                if (res.error_code === 10000) {
                    this.$message.success('发布文章成功！');
                    //清空表单
                    this.$refs.form.resetFields();
                    this.form.classify = [];
                    this.content = '';
                    this.value = '';
                }
            });
        },
        //重置操作
        clear() {
            this.$refs.form.resetFields();
            this.form.classify = [];
            this.content = '';
            this.value = '';
        },
        //展示tag输入框
        showInput() {
            this.inputVisible = true;
            this.$nextTick(_ => {
                this.$refs.saveTagInput.$refs.input.focus();
            });
        },
        //确认自定义tag
        handleInputConfirm() {
            let inputValue = this.inputValue;
            if (inputValue && !this.form.classify.includes(inputValue)) {
                this.form.classify.push(inputValue);
            }
            this.inputVisible = false;
            this.inputValue = '';
        },
    },
};
</script>

<style lang="scss" scoped>
.button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
}
.input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
}
.btn {
    width: 100%;
}
.editor-btn {
    margin-top: 10px;
}
/deep/ .ql-container{
    min-height: 340px !important;
}
</style>
