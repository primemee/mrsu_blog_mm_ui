<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-message"></i> 留言管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="container">
            <div class="handle-box">
                <el-row justify="start" :gutter='15' type="flex">
                    <el-col :span="5">
                        <el-input v-model="messageAuthor" clearable placeholder="请输入留言的作者名称" style="width:100%"></el-input>
                    </el-col>
                    <el-col :span="1">
                        <el-button type="primary" @click="handleSearch">搜索</el-button>
                    </el-col>
                </el-row>
            </div>

            <el-table
                :data="messageList"
                border
                stripe
                class="table"
                ref="multipleTable"
                :height="tableHeight"
                header-cell-class-name="table-header"
                style="width: 100%"
                v-loading="showLoading"
            >
                <el-table-column type="index" align="center"></el-table-column>
                <el-table-column prop="attributes.nick" label="昵称" align="center" show-overflow-tooltip> </el-table-column>
                <el-table-column prop="attributes.ip" label="ip地址" align="center" show-overflow-tooltip> </el-table-column>
                <el-table-column label="邮箱" align="center" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <div>
                            {{ scope.row.attributes.mail === '' ? '无' : scope.row.attributes.mail }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="网址" align="center" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <div>
                            {{ scope.row.attributes.link === '' ? '无' : scope.row.attributes.link }}
                        </div>
                    </template>
                </el-table-column>
                <!-- <el-table-column prop="attributes.url" label="留言地址" align="center" show-overflow-tooltip> </el-table-column> -->
                <el-table-column label="留言内容" width="400" align="center" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <div v-html="scope.row.attributes.comment"></div>
                    </template>
                </el-table-column>
                <el-table-column label="留言时间" width="170" align="center" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{ scope.row.createdAt | formatDate }}</span>
                    </template>
                </el-table-column>
                <!-- <el-table-column prop="attributes.ua" label="设备" align="center" show-overflow-tooltip> </el-table-column> -->
                <el-table-column label="操作" width="70" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-delete" style="color:#ff0000" @click="handleDelete(scope.$index, scope.row)"
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
                    :total="messageNum"
                    @current-change="handlePageChange"
                ></el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
import AV from 'leancloud-storage';
export default {
    inject: ['reload'],
    data() {
        return {
            //留言列表数组
            messageList: [],
            //留言作者
            messageAuthor: '',
            //是否展示加载
            showLoading: true,
            //当前页
            currentPage: 1,
            //页码数
            PageSize: 10,
            //
            messageNum: 0,
            tableHeight: 50
        };
    },
    methods: {
        getMessage() {
            //查找Comment表
            const query = new AV.Query('Comment');
            //根据创建时间返回
            query.descending('createdAt');
            //限制返回10
            query.limit(10);
            // query.skip(10);
            query.find().then(res => {
                this.messageList = res;
                this.messageNum = res.length;
                this.showLoading = false;
                // this.messageList = this.messageList.reverse()
            });
        },
        // 删除操作
        handleDelete(index, row) {
            // 二次确认删除
            this.$confirm(`确定要删除吗？`, '提示', {
                type: 'warning'
            })
                .then(() => {
                    const todo = AV.Object.createWithoutData('Comment', row.id);
                    todo.destroy();
                    this.getMessage();
                    //重新刷新页面
                    this.reload();
                    this.$message.success('删除成功！');
                })
                .catch(() => {});
        },
        //搜索
        handleSearch() {
            const query = new AV.Query('Comment');
            query.startsWith('nick', this.messageAuthor);
            query.find().then(res => {
                this.messageList = res;
                // console.log(res);
                // this.messageList = this.messageList.reverse()
            });
        },
        //分页
        handlePageChange() {
            this.currentPage = value;
            this.getMessage();
        }
    },
    filters: {
      //日期过滤
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
        }
    },
    created() {
        this.getMessage();
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
    }
};
</script>

<style lang="scss" scoped>
.container {
    padding: 20px 20px 0 20px;
    .handle-box {
        height: 45px;
    }
    .pagination {
        margin: 10px 0;
    }
}
.table {
    width: 100%;
    font-size: 14px;
}
.table-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
}
</style>
