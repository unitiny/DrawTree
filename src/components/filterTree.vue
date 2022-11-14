<template>
  <div class="filterTree">
    <el-row class="row">
      <el-col :span="4" class="col">数据展示:</el-col>
      <el-col :span="4" class="col">
        key&nbsp;&nbsp;<el-switch v-model="show[0]"/>
      </el-col>
      <el-col :span="4" class="col">
        value&nbsp;&nbsp;<el-switch v-model="show[1]"/>
      </el-col>
    </el-row>
    <el-row class="row">
      <el-col :span="4" class="col">查找节点:</el-col>
      <el-col :span="8">
        <el-input v-model="filterText" placeholder="Filter keyword"/>
      </el-col>
    </el-row>

    <el-tree
        ref="treeRef"
        className="filter-tree"
        node-key="key"
        :data="tree"
        :props="defaultProps"
        :filter-node-method="filterNode"
    />
  </div>
</template>

<script lang="ts" setup>
import {computed, defineProps, nextTick, onMounted, ref, watch} from 'vue'
import {ElTree} from 'element-plus'

interface Tree {
  key: number
  value: string
  children?: Tree[]
}

const props = defineProps({
  data: {
    type: Array,
    default: []
  }
})

const filterText = ref('')
const treeRef = ref<InstanceType<typeof ElTree>>()
const tree = ref(computed(() => props.data))
const defaultProps = {
  children: 'children',
  label: 'label'
}
const show = ref([true, false])

onMounted(() => {

})

watch(filterText, (val) => {
  treeRef.value!.filter(val)
})

watch(
    () => show,
    () => {
      updateNode(tree.value, show.value)
    },
    {deep: true}
)

const filterNode = (value: string, data) => {
  if (!value) return true
  return data.label.includes(value)
}

const updateNode = (tree, show) => {
  const f = (node, show) => {
    if (show[0] && !show[1]) {
      node.label = node.key
    } else if (!show[0] && show[1]) {
      node.label = node.value
    } else if (!show[0] && !show[1]) {
      node.label = ""
    } else {
      node.label = node.key + " " + node.value
    }
  }
  for (let i = 0; i < tree.length; i++) {
    tree[i].arrangeNodes(f, show)
  }
}

const data: Tree[] = [
  {
    key: 1,
    value: 'Level one 1',
    children: [
      {
        key: 4,
        value: 'Level two 1-1',
        children: [
          {
            key: 9,
            value: 'Level three 1-1-1',
          },
          {
            key: 10,
            value: 'Level three 1-1-2',
          },
        ],
      },
    ],
  },
  {
    key: 2,
    value: 'Level one 2',
    children: [
      {
        key: 5,
        value: 'Level two 2-1',
      },
      {
        key: 6,
        value: 'Level two 2-2',
      },
    ],
  },
  {
    key: 3,
    value: 'Level one 3',
    children: [
      {
        key: 7,
        value: 'Level two 3-1',
      },
      {
        key: 8,
        value: 'Level two 3-2',
      },
    ],
  },
]
</script>

<style scoped>
.filterTree {
  width: 80%;
  display: flex;
  flex-direction: column;
  font-size: 18px;
  color: #409EFF;
}

.row {
  width: 70%;
  display: flex;
  align-items: center;
  margin: 10px 0;
}

.col {
  text-align: left;
}

.el-input__wrapper {
  background: var(--el-bg-color-overlay);
  border: 1px solid var(--el-bg-color);
  box-shadow: none;
}

.filter-tree {
  margin: 20px 0;
}
</style>
