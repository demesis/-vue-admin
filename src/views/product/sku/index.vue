<template>
  <div>
    <el-table
      :data="tableData"
      border
      style="width: 100%">
      <el-table-column
        type="index"
        label="序号"
        width="80"
        align="center">
      </el-table-column>
      <el-table-column
        prop="skuName"
        label="名称"
        width="180"
        align="center">
      </el-table-column>
      <el-table-column
        prop="skuDesc"
        label="描述">
      </el-table-column>
      <el-table-column
        label="默认图片"
        width="150"
        align="center">
        <template scope="{row}">
          <img :src="row.skuDefaultImg"  style="width: 80px; height: 80px;">
        </template>
      </el-table-column>
      <el-table-column
        prop="weight"
        label="重量"
        width="80"
        align="center">
      </el-table-column>
      <el-table-column
        prop="price"
        label="价格"
        width="80"
        align="center">
      </el-table-column>
      <el-table-column
        prop="address"
        label="操作"
        align="center">
        <template scope="{row}">
          <el-button type="primary" icon="el-icon-sort-down" size="mini" v-if="row.isSale == 0" @click="down(row)">下架</el-button>
          <el-button type="success" icon="el-icon-sort-up" size="mini"  v-else @click="up(row)">上架</el-button>
          <el-button type="info" icon="el-icon-info" size="mini" @click="getInfo(row)">详情</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination
    style="margin-top: 20px; text-align: center;"
    :current-page="1"
    :total="total"
    :page-size="10"
    background
    @current-change="changePage"
    ></el-pagination>
    <!-- 弹出框 -->
    <el-drawer
      title="商品详情"
      :visible.sync="drawer">
      <span>{{skuInfo}}</span>
    </el-drawer>
  </div>
</template>

<script>
import { downSku, getSku, getSkuInfo, upSku } from '@/api/sku'
export default {
    name: 'Sku',
    data() {
      return {
        page: 1,
        // sku列表
        tableData:[],
        total: 30,
        // sku详情
        skuInfo: {},
        // 弹出框信息
        drawer: false,
      }
    },
    methods: {
      // 改变页码
      async changePage(page) {
        let { data } = await getSku(page, 10)
        this.tableData = data.records
        this.page = data.current
      },
      // 上架
      async up(row) {
        let  data  = await upSku(row.id)
        if(data.code == 200){
          row.isSale = 0
          this.$message.success('上架成功')
        }
      },
      // 下架
      async down(row) {
        let  data  = await downSku(row.id)
        if(data.code == 200){
          row.isSale = 1
          this.$message.success('下架成功')
        }
      },
      // 获取详情
      async getInfo(row) {
        let { data } = await getSkuInfo(row.id)
        this.skuInfo = data
        this.drawer = true
      }
    },
    mounted() {
      getSku(1,10).then(({data}) => {
        this.tableData = data.records
        this.total = data.total
      })
    },

}
</script>

<style>

</style>