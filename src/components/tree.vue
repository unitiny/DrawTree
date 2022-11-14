<script setup>
import {onMounted, ref, watch, onUpdated} from "vue"
import * as utils from "../utils/index.js"
import Tree from "./tree.vue"
import Line from "./line.vue"
import store from "../store"

const props = defineProps({
  tree: {
    type: Array
  }
})

const refNode = ref(null)
const key = ref(0)

const show = (node) => {
  node.show = !node.show
}

onMounted(() => {

})

watch(
    () => refNode.value,
    () => {
      store.commit("updateRefNodes", refNode.value)
    }
)
</script>

<template>
  <div class="tree" v-for="item1 in props.tree">
    <div class="node" ref="refNode" :id="item1.key">
      <Line v-for="(line, index) in item1.lines"
            :key="item1.key.toString() + index.toString()"
            :attribute="line"
            :class="{'hidden': !item1.show}">
      </Line>
      <el-tooltip
          class="box-item"
          effect="dark"
          :content="item1.value.toString()"
          placement="top">
        <el-button type="primary" round @click="show(item1)">{{ item1.key }}</el-button>
      </el-tooltip>
    </div>

    <div :class="{'children':true, 'hidden': !item1.show}" v-if="item1.children">
      <Tree :tree="item1.children"></Tree>
    </div>
  </div>
</template>

<style scoped lang="scss">

.tree {
  position: relative;
  margin: 30px;
  .node {
    position: relative;
  }

  .children {
    display: flex;
    justify-content: center;
  }
}

.hidden {
  visibility: hidden;
}
</style>
