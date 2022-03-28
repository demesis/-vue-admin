<template>
  <div >
      <el-card style="margin: 20px 0">
        <Select @getListId="getListId" :isShow="isShow" />
      </el-card>
      <el-card v-show="isShow">
        <el-button type="primary" icon="el-icon-plus" style="margin: 10px 0;" :disabled="attrList.length === 0" @click="addAttr">添加</el-button>
        <el-table
          :data="attrList"
          border
          style="width: 100%">
          <el-table-column
            type="index"
            label="序号"
            width="100"
            align="center">
          </el-table-column>
          <el-table-column
            label="属性名称"
            prop="attrName"
            width="380"
            align="center">
          </el-table-column>
          <el-table-column
            label="属性列表"
            >
            <template scope="{row}">
              <el-tag type="success" v-for="(item, index) in row.attrValueList" :key="index" style="margin: 5px 10px ;">{{item.valueName}}</el-tag>
            </template>
            </el-table-column>
          <el-table-column
            label="操作"
            align="center">
            <template scope="{row}">
              <el-button type="warning" icon="el-icon-edit" @click="updateAttr(row)">修改</el-button>
              <el-button type="danger" icon="el-icon-delete"  @click="deleteAttr(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <el-card v-show="!isShow">
        <el-form :inline="true"  class="demo-form-inline" :model="attrInfo">
          <el-form-item label="属性名">
            <el-input  placeholder="请输入属性名" v-model="attrInfo.attrName"></el-input>
          </el-form-item>
        </el-form>
        <el-button type="primary" icon="el-icon-plus" style="margin: 5px 0;" @click="addAttrValue" :disabled="!attrInfo.attrName">添加属性名</el-button>
        <el-table
          border
          :data="attrInfo.attrValueList"
          style="width: 100%; margin: 10px 0;">
          <el-table-column
            type="index"
            label="序号"
            width="100"
            align="center">
          </el-table-column>
          <el-table-column
            label="属性名称">
            <template scope="{row,$index}">
              <el-input v-model="row.valueName" placeholder="请输入属性值名称" v-if="row.isShowInput" @blur="toLook(row)" :ref="$index"></el-input>
              <span v-else @click="toInput(row,$index)" style="display: block; cursor: pointer;">{{row.valueName}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="380"
            align="center">
            <template scope="{$index}">
              <el-popconfirm
                title="确定删除吗？"
                @onConfirm="deleteAttrValue($index)"
              >
               <el-button slot="reference" icon="el-icon-delete" type="danger">删除</el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" @click="saveOrUpdateAttr" :disabled="attrInfo.attrValueList.length == 0">保 存</el-button>
        <el-button @click="isShow = true" >取 消</el-button>
      </el-card>
  </div>
</template>

<script>
import Select from '@/components/Select'
import { getSelect, saveAttr } from '@/api/attr'
export default {
    name: 'Attr',
    components: { Select },
    data() {
      return {
        // 三级分类
        attrId: [],
        // 平台属性
        attrList: [],
        // 是否展示增加
        isShow: true,
        // 收集属性
        attrInfo: { 
          attrName: '',
          attrValueList: [
          ],
          categoryId: 0,
          categoryLevel: 0,
        }

      }
    },
    methods: {
      // 三级分类改变时获取分类信息
      async getListId(listId) {
        let { data } = await getSelect(listId.listId1, listId.listId2, listId.listId3)
        this.attrList = data
        this.attrId = listId
      },
      // 点击添加
      addAttr() {
        this.isShow = false
        // 清空添加属性值表单,同时赋予三级分类id
        this.attrInfo = { 
          attrName: '',
          attrValueList: [
          ],
          categoryId: this.attrId.listId3,
          categoryLevel: 0,
        }
      },
      // 添加属性值
      addAttrValue() {
        this.attrInfo.attrValueList.push({
              attrId: this.attrInfo.id,
              valueName: '',
              // 是否展示input框
              isShowInput: true,
            })
        // dom操作是异步的,不能立即获取焦点
        this.$nextTick(() => {
          this.$refs[this.attrInfo.attrValueList.length-1].focus()
        })
      },
      // 修改属性
      updateAttr(row) {
        this.isShow = false
        // 不能用浅拷贝，不然点击取消没有保存也会修改
        this.attrInfo = JSON.parse(JSON.stringify(row))
        // this.attrInfo = row
        // 用$set加上响应式的属性
        this.attrInfo.attrValueList.forEach(item => {
          this.$set(item,'isShowInput',false)
        })
      },
      // 修改属性值
      updateAttrValue(row) {
        console.log(row);
      },
      // 失去焦点时
      toLook(row) {
        // 判断空值
        if(row.valueName.trim() == ''){
          return this.$message.warning('请输入不是空格的数据')
        }
        // 判断是否存在
        let ifExist = this.attrInfo.attrValueList.some((item) => {
          if(row !== item){
            return row.valueName == item.valueName
          }
        })
        if(ifExist){
          return this.$message.warning('属性值已存在')
        }
        row.isShowInput = false
      },
      // 点击span
      toInput(row,index) {
        row.isShowInput = true
        // dom操作是异步的,不能立即获取焦点
        this.$nextTick(() => {
          this.$refs[index].focus()
        })
      },
      //删除属性值
      deleteAttrValue(index) {
        this.attrInfo.attrValueList.splice(index,1)
      },
      // 保存
      async saveOrUpdateAttr() {
        // 过滤空数据
        this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter((item) => {
          if(item.valueName !== ''){
            delete item.isShowInput
            return true
          }
        })
        // 发请求
        let data  = await saveAttr(this.attrInfo)
        if(data.code == 200){
          this.$message.success('保存成功')
          this.isShow = true
          // 重新获取信息
          let { data } = await getSelect(this.attrId.listId1, this.attrId.listId2, this.attrId.listId3)
          this.attrList = data
        }
      }

    },

}
</script>

<style>

</style>