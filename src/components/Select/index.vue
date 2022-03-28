<template>
  <div>
    <el-form :inline="true" class="demo-form-inline" :model="listId">
      <el-form-item label="一级分类">
        <el-select  placeholder="一级分类" v-model="listId.listId1" @change="List1Change" :disabled="!isShow">
          <el-option :label="item1.name"  v-for="(item1, index) in list1" :key="index" :value="item1.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select  placeholder="二级分类" v-model="listId.listId2" @change="List2Change" :disabled="!isShow">
          <el-option :label="item2.name"  v-for="(item2, index) in list2" :key="index" :value="item2.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select  placeholder="三级分类" v-model="listId.listId3" @change="List3Change" :disabled="!isShow">
          <el-option :label="item3.name"  v-for="(item3, index) in list3" :key="index" :value="item3.id"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getFirstSelect, getSecondSelect, getThirdSelect } from '@/api/attr'
export default {
  name: 'Select',
  props: {
    isShow: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // 列表
      list1: [],
      list2: [],
      list3: [],
      // 表单id
      listId:{
        listId1: '',
        listId2: '',
        listId3: ''
      }
    }
  },
  methods: {
    // 获取二级分类信息
    async List1Change() {
      let { data } = await getSecondSelect(this.listId.listId1)
      this.list2 = data
      // 清除上一次分类信息
      this.listId.listId2 = this.listId.listId3 = ''
    },
    // 获取三级分类信息
    async List2Change() {
      let { data } = await getThirdSelect(this.listId.listId2)
      this.list3 = data
      this.listId.listId3 = ''
    },
    // 获取分类信息
    async List3Change() {
      this.$emit('getListId', this.listId)
    }
  },
  mounted() {
    getFirstSelect().then(({data}) => {
      this.list1 = data
    })
  },

}
</script>

<style>

</style>