<template>
  <div>
      <el-button type="primary" icon="el-icon-plus" style="margin: 10px 0;" @click="show()">添加</el-button>
      <el-table
        :data="tableData"
        border
        style="width: 100%">
        <el-table-column
          prop="id"
          label="序号"
          width="100"
          align="center">
        </el-table-column>
        <el-table-column
          prop="tmName"
          label="品牌名称"
          width="380"
          align="center">
        </el-table-column>
        <el-table-column
          label="品牌logo"
          align="center"
          >
          <template scope="{row}">
            <img :src="row.logoUrl" style="width: 200px; height: 100px;">
          </template>
          </el-table-column>
        <el-table-column
          label="操作"
          align="center">
          <template scope="{row}">
            <el-button type="warning" icon="el-icon-edit" @click="updateBrand(row)">修改</el-button>
            <el-button type="danger" icon="el-icon-delete"  @click="deleteBrand(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器 -->
      <el-pagination
      style="margin-top: 20px; text-align: center;"
      :current-page="page"
      :total="total"
      :page-size="3"
      background
      @current-change="changePage"
      ></el-pagination>
      <!-- 对话框 -->
      <el-dialog :title="form.id ? '修改品牌':'添加品牌'" :visible.sync="dialogFormVisible">
        <el-form  style="width: 80%;" :model="form" :rules="rules" ref="formUrl">
          <el-form-item label="品牌名称:" label-width="100px" prop="tmName">
            <el-input  autocomplete="off" v-model="form.tmName"></el-input>
          </el-form-item>
          <el-form-item label="品牌logo:" label-width="100px" prop="logoUrl">
            <el-upload
              class="avatar-uploader"
              action="/dev-api/admin/product/fileUpload"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload">
              <img v-if="form.logoUrl" :src="form.logoUrl" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false" >取 消</el-button>
          <el-button type="primary" @click="addOrupdate('formUrl')">确 定</el-button>
        </div>
      </el-dialog>
  </div>
</template>

<script>
import { deleteBrand, getBrand, saveBrand, updateBrand } from '@/api/brand'
export default {
    name: 'Brand',
    data() {
      return {
        tableData:[],
        page: 1,
        pageSize: 3,
        total: 50,
        // 对话框
        dialogFormVisible: false,
        // 上传图片
        form: {
          tmName: '',
          logoUrl: ''
        },
        // 表单验证规则
        rules: {
          tmName: [
            { required: true, message: '请输入品牌名称', trigger: 'blur' },
            { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
          ],
          logoUrl: [
            { required: true, message: '请选择图片' }
          ],
        }
      }
    },
    methods: {
      // 改变页码
      changePage(page) {
        this.page = page
        getBrand(this.page,this.pageSize).then(({data}) => {
          this.tableData = data.records
        })
      },
      // 上传成功的回调
      handleAvatarSuccess(res, file) {
        this.form.logoUrl = res.data
      },
      // 上传前的回调
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      },
      // 关闭弹出层
      show() {
        this.dialogFormVisible = true
        this.form = {
          tmName: '',
          logoUrl: ''
        }
      },
      // 点击修改信息
      updateBrand(row) {
        this.dialogFormVisible = true
        // 修改row不影响form
        this.form = {...row}
      },
      // 添加或修改品牌
      addOrupdate(formName) {
        this.$refs[formName].validate( async (valid) => {
          if (valid) {
            this.dialogFormVisible = false
            if(this.form.id){
              // 修改
              let data = await updateBrand(this.form)
              if(data.code == 200){
                this.$message.success('修改成功！')
                // 重新获取
                getBrand(this.page,this.pageSize).then(({data}) => {
                  this.tableData = data.records
                  this.total = data.total
                })
              }
            }else{
              // 添加
              let data = await saveBrand(this.form)
              if(data.code == 200){
                this.$message.success('添加成功！')
                // 重新获取
                getBrand(this.page,this.pageSize).then(({data}) => {
                  this.tableData = data.records
                  this.total = data.total
                })
              }
            }
          } else {
            console.log('error submit!!');
            return false;
          }
        });
        
      },
      // 删除品牌
      deleteBrand(row) {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then( async  () => {
          let data = await deleteBrand(row.id)
          if(data.code == 200){
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
          }
          // 重新获取
          getBrand(this.page,this.pageSize).then(({data}) => {
            this.tableData = data.records
            this.total = data.total
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      }

    },
    mounted() {
      // 获取品牌
      getBrand(this.page,this.pageSize).then(({data}) => {
        this.tableData = data.records
        this.total = data.total
        
      })
    },

}
</script>

<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
