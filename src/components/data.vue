<script setup>
import {ref} from "vue";
import Form from "./form.vue"
import * as file from "../controller/file.js"
import * as tree from "../controller/tree.js";
import tree_CLR from "../assets/json/tree_CLR.json"
import tree_LRC from "../assets/json/tree_LRC.json"
import tree_TREE from "../assets/json/tree_TREE.json"

const refForm = ref(null)
const wayIndex = ref(0)
const ways = ref([
  {
    "id": 0,
    "text": "表单生成",
    "buttons": [
      {
        "id": 0,
        "text": "开始生成"
      },
      {
        "id": 1,
        "text": "添加根节点"
      },
      {
        "id": 2,
        "text": "清空节点"
      },
      {
        "id": 3,
        "text": "生成JSON文件"
      },
    ],
  },
  {
    "id": 1,
    "text": "文本生成",
    "buttons": [
      {
        "id": 0,
        "text": "开始生成"
      },
      {
        "id": 1,
        "text": "树形模板"
      },
      {
        "id": 2,
        "text": "前序模板"
      },
      {
        "id": 3,
        "text": "后序模板"
      },
      {
        "id": 4,
        "text": "清除文本"
      },
      {
        "id": 5,
        "text": "生成JSON文件"
      },
    ],
    "value": ""
  },
  {
    "id": 2,
    "text": "JSON文件"
  },
])

// 选择数据格式
const chooseWay = (index) => {
  wayIndex.value = index
}

const TextHandler = (index) => {
  switch (index) {
    case 0:
      tree.GetTreeMessage(ways.value[wayIndex.value].value)
      break
    case 1:
      ways.value[wayIndex.value].value = JSON.stringify(tree_TREE, null, '\t')
      break
    case 2:
      ways.value[wayIndex.value].value = JSON.stringify(tree_CLR, null, '\t')
      break
    case 3:
      ways.value[wayIndex.value].value = JSON.stringify(tree_LRC, null, '\t')
      break
    case 4:
      ways.value[wayIndex.value].value = ""
      break
    case 5:
      file.CreateJSON(ways.value[wayIndex.value].value)
      break
  }
}

const FormHandler = (index) => {
  let json = ""
  switch (index) {
    case 0:
      json = refForm.value.getTree()
      console.log(json)
      tree.GetTreeMessage(json)
      break
    case 1:
      refForm.value.addRootNode()
      break
    case 2:
      refForm.value.resetData()
      break
    case 3:
      json = refForm.value.getTree()
      file.CreateJSON(json)
      break
  }
}
</script>

<template>
  <div class="data">
    <el-row>
      <el-button v-for="way in ways" @click="chooseWay(way.id)" class="button" type="primary" plain>
        {{ way.text }}
      </el-button>
    </el-row>

    <div v-if="wayIndex === 0">
      <Form ref="refForm"></Form>
      <el-row>
        <el-button v-for="button in ways[wayIndex].buttons"
                   @click="FormHandler(button.id)"
                   class="button" type="primary"
                   plain>
          {{ button.text }}
        </el-button>
      </el-row>
    </div>

    <div v-else-if="wayIndex === 1">
      <el-input
          v-model="ways[wayIndex].value"
          :autosize="{ minRows: 9, maxRows: 40 }"
          type="textarea"
          placeholder="Please input"
      />
      <el-row>
        <el-button v-for="button in ways[wayIndex].buttons"
                   @click="TextHandler(button.id)"
                   class="button" type="primary"
                   plain>
          {{ button.text }}
        </el-button>
      </el-row>
    </div>

    <el-upload
        v-if="wayIndex === 2"
        class="upload-demo"
        drag
        action="#"
        multiple
        :before-upload="file.ParseFile">
      <el-icon class="el-icon--upload">
        <upload-filled/>
      </el-icon>
      <div class="el-upload__text">
        Drop file here or <em>click to upload</em>
      </div>
    </el-upload>
  </div>
</template>

<style scoped lang="scss">
@import "../assets/index.scss";
</style>
