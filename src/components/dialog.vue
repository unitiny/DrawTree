<template>
  <span @click="dialogVisible = true">使用说明</span>

  <el-dialog v-model="dialogVisible" title="Tips" width="50%" draggable>
    <div class="demo-collapse">
      <el-collapse v-model="activeNames">
        <el-collapse-item title="功能" name="1">
          <p>
            通过传入数据生成树状图
          </p>
        </el-collapse-item>
        <el-collapse-item title="字段说明" name="2">
          <p>header: 数据头，明确数据格式</p>
          <p>order: 数据中储存树的方式，分别有前序储存：CLR, 后序储存：LRC, 树形储存：TREE；对应树的内容格式请参考模板</p>
          <p>bodies: 数据体，储存各个树节点</p>
          <p>key: 节点id，请保证唯一</p>
          <p>value: 节点内容，可自定义</p>
          <p>depth: 该节点的深度，在order为CLR, LRC方式中使用</p>
          <p>children: 节点的子孩子，仅在order为TREE方式中使用</p>
        </el-collapse-item>
        <el-collapse-item title="注意事项" name="3">
          <p>
            若无弹窗报错却不生成树，可能是传入数据格式错误，请刷新重试。
          </p>
        </el-collapse-item>
      </el-collapse>
    </div>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">Cancel</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const dialogVisible = ref(false)
const activeNames = ref(['1'])
</script>
<style lang="scss" scoped>
@import "../assets/index.scss";

span {
  margin: 0 20px;
}

.el-collapse-item__content p{
  text-align: left;
}

</style>
