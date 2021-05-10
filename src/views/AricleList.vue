<template>
    <div class="aricleList">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item> <i class="el-icon-lx-cascades"></i> 文章管理 </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-form ref="formSearRef" :model="searchForm" label-width="80px">
                    <el-row justify="space-around" type="flex">
                        <el-col :span="5">
                            <el-form-item label="文章ID" prop="id">
                                <el-input v-model="searchForm.id" clearable placeholder="请输入文章ID" style="width:100%"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="5">
                            <el-form-item label="文章标题" prop="title">
                                <el-input v-model="searchForm.title" clearable placeholder="请输入文章标题" style="width:100%"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="9">
                            <el-form-item label="发布时间">
                                <el-date-picker
                                    v-model="accDate"
                                    type="daterange"
                                    align="right"
                                    unlink-panels
                                    range-separator="至"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期"
                                    :picker-options="pickerOptions"
                                >
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="1">
                            <el-button type="primary" @click="handleSearch">搜索</el-button>
                        </el-col>
                        <el-col :span="2">
                            <el-button type="infor" @click="handleClear">重置</el-button>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
            <el-table
                :data="blogBaseList"
                border
                stripe
                class="table"
                ref="multipleTable"
                :height="tableHeight"
                header-cell-class-name="table-header"
                v-loading="showLoading"
            >
                <el-table-column type="index" width="55" align="center"></el-table-column>
                <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
                <el-table-column label="标题" align="center" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <p style="color:rgb(32, 160, 255);cursor: pointer;" @click="getArticledetail(scope.row.id)">
                            {{ scope.row.title }}
                        </p>
                    </template>
                </el-table-column>
                <el-table-column label="文章标签" align="center" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <div v-if="scope.row.classify != ''">
                            <el-tag
                                v-for="(item, index) in scope.row.classify.split(',')"
                                type="danger"
                                :key="index"
                                style="marginRight:5px"
                            >
                                {{ item }}</el-tag
                            >
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="阅读量" sortable width="100" prop="number" align="center"> </el-table-column>
                <el-table-column label="发布时间" width="170" align="center">
                    <template slot-scope="scope">{{ (parseInt(scope.row.create_time) * 1000) | formatDate }}</template>
                </el-table-column>
                <el-table-column label="修改时间" width="100" align="center">
                    <template slot-scope="scope">{{ (parseInt(scope.row.update_time) * 1000) | diffTime }}</template>
                </el-table-column>
                <el-table-column label="状态" width="100" align="center">
                    <template slot-scope="scope">
                        <el-tag @click="statusChange(scope.row)" style="cursor: pointer;" v-if="scope.row.status === 0">{{
                            scope.row.status === 0 ? '允许展示' : ''
                        }}</el-tag>
                        <el-tag @click="statusChange(scope.row)" style="cursor: pointer;" v-else type="danger">{{
                            scope.row.status === 1 ? '已禁止' : ''
                        }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)"
                            >删除</el-button
                        >
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                    background
                    layout="total, prev, pager, next, jumper"
                    :current-page="currentPage"
                    :page-size="PageSize"
                    :total="articleNum"
                    @current-change="handlePageChange"
                ></el-pagination>
            </div>
        </div>

        <!-- 详情对话框 -->
        <el-dialog fullscreen title="文章详情" :visible.sync="detailVisible" width="50%" :close-on-click-modal="false">
            <el-form :model="detailForm" label-width="80px">
                <el-form-item label="文章标题" prop="title" align="left" style="marginLeft:25%">
                    <el-input v-model="detailForm.title" style="width:50%" disabled maxlength="20"></el-input>
                </el-form-item>
                <el-form-item label="文章标签" align="left" show-overflow-tooltip style="marginLeft:25%">
                    <div v-if="detailForm.classify != ''">
                        <el-tag v-for="(item, index) in detailForm.classify" type="danger" :key="index" style="marginRight:5px">
                            {{ item }}</el-tag
                        >
                    </div>
                </el-form-item>
                <el-divider></el-divider>
                <div class="quill-editor ql-container ql-snow no-b" style="marginLeft:25%;marginRight:25%">
                    <div class="ql-editor" v-html="detailForm.content"></div>
                </div>
            </el-form>
        </el-dialog>

        <!-- 编辑弹出框 -->
        <el-dialog fullscreen title="编辑文章" :visible.sync="editVisible" width="50%">
            <el-form :model="editForm" :rules="editFormRules" label-width="80px">
                <el-form-item label="文章标题" prop="title" align="left" style="marginLeft:25%">
                    <el-input v-model="editForm.title" style="width:50%" maxlength="20"></el-input>
                </el-form-item>
                <el-form-item label="文章标签" align="left" style="marginLeft:25%">
                    <el-tag
                        style="marginRight:10px"
                        size="medium"
                        :key="index"
                        v-for="(tag, index) in editForm.classify"
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
                        style="width:22.5%;marginLeft:10px"
                        v-if="inputVisible"
                        v-model="inputValue"
                        ref="saveTagInput"
                        size="small"
                        @keyup.enter.native="handleInputConfirm"
                        @blur="handleInputConfirm"
                    >
                    </el-input>
                    <el-button v-else class="button-new-tag" style="marginLeft:10px" size="small" @click="showInput">+ New Tag</el-button>
                </el-form-item>
                <el-divider></el-divider>
                <el-upload
                    :show-file-list="false"
                    style="display:none"
                    :action="imageUrl"
                    :on-success="handleSuccess"
                    accept="image/jpeg,image/gif,image/png"
                >
                    <el-button type="primary"></el-button>
                </el-upload>
                <quill-editor
                    ref="myTextEditor"
                    style="marginLeft:25%;marginRight:25%"
                    v-model="editContent"
                    :options="editorOption"
                ></quill-editor>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
// import { fetchData } from '../../api/index';
import { getArticleList, getArticleListById, aricleDelById, aricleUpdate } from '../api/index';
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
    ['link', 'image'],
];
export default {
    data() {
        return {
            //编辑对话框是否展示
            editVisible: false,
            //详情对话框是否展示
            detailVisible: false,
            //表格高度
            tableHeight: 50,
            //搜索表单
            searchForm: {
                id: '',
                title: '',
                start_date: '',
                end_date: ''
            },
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
                '缓存 负载均衡',
                'unix',
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
            //编辑文章内容
            editContent: '',
            //上传图片后端地址
            imageUrl: 'http://localhost:8081/article/v1/upload',
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
            //编辑表单对象
            editForm: {
                title: '',
                classify: [],
                type: '0'
            },
            //编辑表单规则
            editFormRules: {
                title: [{ required: true, message: '请输入文章标题', trigger: 'blur' }]
            },
            //博客列表数组
            blogBaseList: [],
            //发布时间搜索数组
            accDate: [],
            //是否展示输入框
            inputVisible: false,
            //输入值
            inputValue: '',
            //选择框值
            value: '',
            //当前页数
            currentPage: 1,
            //页码数
            PageSize: 10,
            //页数
            row_start_number: 0,
            //文章数量
            articleNum: 0,
            //详情表单对象
            detailForm: {},
            //发布时间搜搜索配置
            pickerOptions: {
                shortcuts: [
                    {
                        text: '最近一周',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        }
                    },
                    {
                        text: '最近一个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        }
                    },
                    {
                        text: '最近三个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                            picker.$emit('pick', [start, end]);
                        }
                    }
                ]
            },
            //是否显示加载
            showLoading: true
        };
    },
    created() {
        this.getArticleList();
    },
    mounted() {
        this.$nextTick(() => {
            // 根据浏览器高度设置初始高度
            this.tableHeight = window.innerHeight - this.$refs.multipleTable.$el.offsetTop - 170;
            // 监听浏览器高度变化，改变表格高度
            window.onresize = () => {
                this.tableHeight = window.innerHeight - this.$refs.multipleTable.$el.offsetTop - 170;
            };
        });
    },
    components: {
        quillEditor
    },
    methods: {
        //请求博客列表数据
        async getArticleList() {
            const { data: res } = await getArticleList({
                row_count: this.PageSize,
                row_start: this.row_start_number
            });
            this.blogBaseList = res.result_data.items;
            this.articleNum = res.total_row;
            this.showLoading = false;
            // let that = this;
            // this.blogBaseList.forEach(val => {
            //     //  console.log(val.number);
            //     that.sum += val.number;
            // });
            // console.log(that.sum);
        },
        //根据博客id获取详情
        async getArticledetail(id) {
            const { data: res } = await getArticleListById(id);
            if (res.error_code === 10000) {
                this.detailVisible = true;
                res.result_data.classify = res.result_data.classify.split(',');
                this.detailForm = res.result_data;
                // console.log(this.detailForm.classify);
            }
        },
        // 触发搜索按钮
        async handleSearch() {
            if (this.accDate !== null) {
                this.searchForm.start_date = Date.parse(this.accDate[0]) / 1000;
                this.searchForm.end_date = Date.parse(this.accDate[1]) / 1000;
            } else {
                this.searchForm.start_date = '';
                this.searchForm.end_date = '';
            }
            const { data: res } = await getArticleList({
                id: this.searchForm.id,
                title: this.searchForm.title,
                start_date: this.searchForm.start_date,
                end_date: this.searchForm.end_date,
                row_count: this.PageSize,
                row_start: this.row_start_number
            });
            this.blogBaseList = res.result_data.items;
            this.articleNum = res.total_row;
        },
        //重置
        handleClear() {
            this.$refs.formSearRef.resetFields();
            this.accDate = [];
            this.getArticleList();
        },
        //选择tag
        selectChange(value) {
            if (!this.editForm.classify.includes(value)) {
                this.editForm.classify.push(value);
            }
        },
        //是否展示标签input
        showInput() {
            this.inputVisible = true;
            this.$nextTick(_ => {
                this.$refs.saveTagInput.$refs.input.focus();
            });
        },
        //标签input确认输入
        handleInputConfirm() {
            let inputValue = this.inputValue;
            if (inputValue && !this.editForm.classify.includes(inputValue)) {
                this.editForm.classify.push(inputValue);
            }
            this.inputVisible = false;
            this.inputValue = '';
        },
        // 删除操作
        handleDelete(index, row) {
            // 二次确认删除
            this.$confirm(`确定要删除${row.title}吗？`, '提示', {
                type: 'warning'
            })
                .then(() => {
                    aricleDelById(row.id).then(res => {
                        if ((res.error_code = 10000)) {
                            this.$message.success('删除成功');
                            this.getArticleList();
                        }
                    });
                })
                .catch(() => {});
        },
        handleSuccess(res) {
            // 获取富文本组件实例
            let quill = this.$refs.myTextEditor.quill;
            // 如果上传成功
            if (res) {
                var url = 'http://localhost:8081' + res.realName;
                let length = quill.getSelection().index;
                // quill.focus();
                quill.insertEmbed(quill.getSelection().index, 'image', url);
                // 调整光标到最后
                quill.setSelection(length + 1);
            } else {
                // 提示信息，需引入Message
                this.$message.error('图片插入失败');
            }
        },
        //关闭tag
        handleClose(tag) {
            this.editForm.classify.splice(this.editForm.classify.indexOf(tag), 1);
        },
        //改变文章展示状态
        async statusChange(row) {
            let setStatus = 0;
            if (row.status === 0) {
                setStatus = 1;
            } else {
                setStatus = 0;
            }
            const { data: res } = await aricleUpdate({
                id: row.id,
                status: setStatus
            });
            if (res.error_code === 10000) {
                this.$message.success('状态修改成功！');
                this.getArticleList();
            }
        },
        // 编辑操作
        async handleEdit(index, row) {
            this.editArticleId = row.id;
            const { data: res } = await getArticleListById(row.id);
            if (res.error_code === 10000) {
                this.editVisible = true;
                res.result_data.classify = res.result_data.classify.split(',');
                this.editForm = res.result_data;
                this.editContent = this.editForm.content;
                // console.log(this.editContent);
            }
        },
        // 保存编辑
        async saveEdit() {
            const { data: res } = await aricleUpdate({
                id: this.editArticleId,
                title: this.editForm.title,
                type: parseInt(this.editForm.type),
                content: this.editContent,
                classify: this.editForm.classify.join(',')
            });
            if (res.error_code === 10000) {
                this.$message.success('更改成功');
                this.editVisible = false;
                this.getArticleList();
            }
        },
        // 分页导航
        handlePageChange(value) {
            this.currentPage = value;
            this.row_start_number = (value - 1) * this.PageSize;
            this.getArticleList();
        },
    },
    filters: {
        //过滤日期
        formatDate: function(value) {
            let date = new Date(value);
            let y = date.getFullYear();
            let MM = date.getMonth() + 1;
            MM = MM < 10 ? '0' + MM : MM;
            let d = date.getDate();
            d = d < 10 ? '0' + d : d;
            let h = date.getHours();
            h = h < 10 ? '0' + h : h;
            let m = date.getMinutes();
            m = m < 10 ? '0' + m : m;
            let s = date.getSeconds();
            s = s < 10 ? '0' + s : s;
            return y + '-' + MM + '-' + d + ' ' + h + ':' + m + ':' + s;
        },
        //过滤最近时间
        diffTime: function(item) {
            var nowTime = new Date().getTime();
            var minuteTime = 60 * 1000;
            var hourTime = 60 * minuteTime;
            var dayTime = 24 * hourTime;
            var monthTime = dayTime * 30;
            var yearTime = monthTime * 12;
            var publishTime = new Date(item).getTime();
            var historyTime = parseInt(nowTime) - parseInt(publishTime);
            var descTime;
            if (historyTime >= yearTime) {
                // 按年算
                descTime = parseInt(historyTime / yearTime) + '年前';
            } else if (historyTime < yearTime && historyTime >= monthTime) {
                // 按月算
                descTime = parseInt(historyTime / monthTime) + '月前';
            } else if (historyTime < monthTime && historyTime >= dayTime) {
                // 按天算
                descTime = parseInt(historyTime / dayTime) + '天前';
            } else if (historyTime < dayTime && historyTime >= hourTime) {
                // 按小时算
                descTime = parseInt(historyTime / hourTime) + '小时前';
            } else if (historyTime < hourTime && historyTime >= minuteTime) {
                // 按分钟算
                descTime = parseInt(historyTime / minuteTime) + '分钟前';
            } else {
                descTime = '刚刚';
            }
            return descTime;
        }
    }
};
</script>

<style lang="scss" scoped>
.container {
    padding: 0 30px 0 30px;
    .handle-box {
        padding: 20px 0 0 10px;
    }
    .pagination {
        margin: 10px 0;
    }
}
.ql-container.ql-snow {
    border: none;
}
.el-divider--horizontal {
    margin-left: 25%;
    width: 50%;
}
.handle-select {
    width: 120px;
}

.handle-input {
    width: 300px;
    display: inline-block;
}

.table {
    width: 100%;
    font-size: 14px;
}
.red {
    color: #ff0000;
}
.mr10 {
    margin-right: 10px;
}
.table-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
}
</style>
<style lang="scss">
.aricleList {
    .el-dialog__body {
        padding-bottom: 60px;
    }
    .el-dialog__footer {
        position: fixed;
        bottom: 0;
        right: 30px;
        width: 100%;
        background: #fff;
    }
}
</style>
