<template>
  <div class="custom-tree-container">
    <el-tree
        :data="dataSource"
        node-key="key"
        draggable
        default-expand-all
        :expand-on-click-node="false"
        :render-content="renderContent"
    />
  </div>
</template>

<script lang="ts" setup>
import {ref} from 'vue'
import type Node from 'element-plus/es/components/tree/src/model/node'
import Header from "../class/header.js";
import {Order} from "../global/const.js"

interface Tree {
  key: number
  value: string
  children?: Tree[]
}
let key = 3

const append = (data: Tree) => {
  const newChild = { key: key++, value: '', children: [] }
  if (!data.children) {
    data.children = []
  }
  data.children.push(newChild)
  dataSource.value = [...dataSource.value]
}

const remove = (node: Node, data: Tree) => {
  key--
  const parent = node.parent
  const children: Tree[] = parent.data.children || parent.data
  const index = children.findIndex((d) => d.key === data.key)
  children.splice(index, 1)
  dataSource.value = [...dataSource.value]
}

const getNodeLabel = (e, data: Tree) => {
  data.value = e.target.value
  dataSource.value = [...dataSource.value]
  console.log(dataSource.value)
}

const renderContent = (
    h,
    {
      node,
      data,
      store,
    }: {
      node: Node
      data: Tree
      store: Node['store']
    }
) => {
  return h(
      'span',
      {
        class: 'custom-tree-node',
      },
      h(
          'span',
          null,
          'value: ',
          h(
              'input',
              {
                class: 'node-value',
                onBlur: (e) => getNodeLabel(e, data)
              },
              ""
          ),
      ),
      h(
          'span',
          null,
          h(
              'a',
              {
                onClick: () => append(data),
              },
              'Append '
          ),
          h(
              'a',
              {
                style: 'margin-left: 8px',
                onClick: () => remove(node, data),
              },
              'Delete'
          )
      )
  )
}

const resetData = () => {
  dataSource.value = []
  key = 1
}

const addRootNode = () => {
  const newRoot = { key: key++, value: '', children: [] }
  dataSource.value.push(newRoot)
}

const getTreeJSON = () => {
  let json = {}
  json["header"] = new Header(Order.TREE)
  json["bodies"] = [...dataSource.value]
  return JSON.stringify(json)
}

const dataSource = ref<Tree[]>([
  {
    key: 1,
    value: 'Level one 1',
    children: [
      {
        key: 2,
        value: 'Level two 1-1',
        children: [
        ],
      },
    ],
  },
])

defineExpose(
    {resetData, addRootNode, getTree: getTreeJSON}
)
</script>

<style lang="scss">
@import "../assets/index.scss";
.el-tree-node__content {
  height: 45px;
}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}

.el-tree {
  border-radius: 5px;
  border: 1px solid $primary;
  padding: 10px;
}

.node-value {
  font-size: 18px;
  height: 30px;
  margin-left: 5px;
  border: 1px solid $primary;
  background: $background;
  color: $primary;
}
</style>
