<script setup>
import * as tree from "./controller/tree"
import store from "./store"
import {nextTick, onMounted, ref, watch} from "vue"
import {ElMessage} from 'element-plus'
import Dialog from "./components/dialog.vue"
import Tree from "./components/tree.vue"
import Data from "./components/data.vue"
import FilterTree from "./components/filterTree.vue"

const refTree = ref(null)
const Nodes = ref([])
const Lines = ref([])
const filterTree = ref([])
const showTree = ref(false)

// 每个node获取自身节点
const getSelfRefNode = (nodes) => {
  console.log("getSelfRefNode...")
  let k = 0
  for (let i = 0; i < nodes.length; i++) {
    for (let j = 0; j < nodes[i].length; j++) {
      nodes[i][j].selfRef = tree.GetRefNode(nodes[i][j].key)
      k++
    }
  }
  return nodes
}

// 重置状态
const resetState = async () => {
  Nodes.value = []
  Lines.value = []
  filterTree.value = []

  tree.Init()
  showTree.value = false
  await nextTick(() => {
    showTree.value = true
  })
}

// 显示弹窗
const openTip = (tip) => {
  ElMessage.error(tip)
}

onMounted(() => {

})

watch(
    () => store.state.header,
    async () => {
      if (JSON.stringify(store.state.header) === "{}") {
        return
      }

      await resetState()
      Nodes.value = tree.ArrangeNodes(store.state.header, store.state.body)
      filterTree.value = tree.GetFilterTree(Nodes.value)

      console.log(Nodes.value, store.state)
      let flag = await tree.IsGetNodes()
      if (flag) {
        Nodes.value = getSelfRefNode(Nodes.value)
        tree.CalculateLine(Nodes.value, refTree.value)
      }

      console.log(Nodes.value, Lines.value)
    }
)

watch(
    () => store.state.tip,
    (val) => {
      if (val === "") {
        return
      }
      openTip(val)
      store.commit("updateTip", "")
    }
)

</script>

<template>
  <el-row class="header">
    <el-col :span="4" class="logo">DrawTree</el-col>
    <el-col :span="14"></el-col>
    <el-col :span="6" class="tag">
      <Dialog></Dialog>
      <el-link><a href="https://github.com/unitiny/DrawTree">源码</a></el-link>
    </el-col>
  </el-row>
  <div class="main">
    <Data></Data>

    <el-divider border-style="dashed">
      <img class="image" src="./assets/tree1.png" alt="tree">
    </el-divider>

    <el-scrollbar height="400px">
      <div class="scrollbar-flex-content">
        <div ref="refTree" class="Tree">
          <Tree :tree="Nodes[0]" v-if="showTree"></Tree>
        </div>
      </div>
    </el-scrollbar>

    <el-divider border-style="dashed">
      <img class="image" src="./assets/tree.png" alt="tree">
    </el-divider>

    <el-scrollbar height="400px">
      <div class="scrollbar-flex-content">
        <FilterTree :data="filterTree"></FilterTree>
      </div>
    </el-scrollbar>

    <el-backtop :right="100" :bottom="100"/>
  </div>
</template>

<style scoped lang="scss">
//@import "./assets/index.scss";

.header {
  top: -20px;
  height: 40px;
  display: flex;
  align-items: center;

  .tag {
    display: flex;
    justify-content: flex-end;
    align-items: center;

    a {
      color: var(--el-bg-color);
    }
  }
}

.logo {
  text-align: left;
  color: #157115;
  font-size: 30px;
  font-weight: 600;
}

.logo:hover {
  color: #3aaa3a;
  filter: drop-shadow(0 0 2em #42b883aa);
}

.main {
}

.Tree {
  position: relative;
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

.levels {
  margin: 30px;
  display: flex;
  align-items: center;
  justify-content: center;

  .nodes {
    flex-shrink: 0;
    margin: 30px;
  }
}

.image {
  width: 130px;
}

.node {
  border-radius: 50%;
}
</style>
