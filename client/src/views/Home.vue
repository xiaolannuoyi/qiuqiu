<template>
  <div class="home">
    <el-form ref="qqform" :model="qqform">
      <el-form-item
        label="球球大作战分享链接"
        prop="sharelink"
        :rules="[
          { required: true, message: '请输入分享链接', trigger: 'blur' },
          { type: 'url', message: '请输入正确的分享链接', trigger: ['blur', 'change'] }
        ]"
      >
        <el-input v-model="qqform.sharelink"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="bbtsubmitForm('qqform')">棒棒糖提交</el-button>
        <el-button type="primary" @click="ldsubmitForm('qqform')">龙蛋提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "home",
  data() {
    return {
      qqform: {
        sharelink: ""
      }
    };
  },
  methods: {
    bbtsubmitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$axios.post('http://localhost:9000/user/bbt',{
            url: this.qqform.sharelink
          }).then(Response=>{
            console.log('Response',Response)
          }).catch(err=>{
            console.log('err',err)
          })
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    ldsubmitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$axios.post('http://localhost:9000/user/ld',{
            url: this.qqform.sharelink
          }).then(Response=>{
            console.log('Response',Response)
          }).catch(err=>{
            console.log('err',err)
          })
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

  }
};
</script>
