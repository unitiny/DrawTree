import store from "../store"
import Header from "../class/header.js";
import Node from "../class/node.js"
import * as utils from "../utils/index.js"
import {Order} from "../global/const.js";
import {reactive} from "vue";

const orderFunc = reactive({})

// 初始化
function Init() {
    if (Object.keys(orderFunc).length === 0) {
        orderFunc[Order.CLR] = CLR
        orderFunc[Order.LRC] = LRC
        orderFunc[Order.TREE] = TREE
    }
}

// 解析body
const GetTreeMessage = (json) => {
    try {
        let tree = JSON.parse(json)

        // 检测正确性
        checkTree(tree)
        checkHeader(tree)
        let header = new Header(tree.header.order)
        let bodies = []

        if (header.order !== Order.TREE) {
            for (let i = 0; i < tree.bodies.length; i++) {
                let element = tree.bodies[i]
                checkBody1(element)
                let node = new Node(element.key, element.depth, element.value)
                bodies.push(node)
            }
        } else {
            bodies = tree.bodies // 未检查合法性
        }

        store.commit("clearState") // 清空之前数据
        store.commit("updateHeader", header)
        store.commit("updateBody", bodies)
    } catch (e) {
        console.log(e)
        store.commit("updateTip", "JSON格式错误，可参照模板更正或查看使用说明")
    }
}

// 计算line属性
const CalculateLine = (Nodes, refTree) => {
    let treePos = refTree.getBoundingClientRect()
    for (let i = 0; i < Nodes.length; i++) {
        for (let j = 0; j < Nodes[i].length; j++) {
            let node = Nodes[i][j]
            if (node.children.length === 0) {
                continue
            }

            let lines = []
            let parentPos = node.getSelfClientRect()
            for (let k = 0; k < node.children.length; k++) {
                let childPos = node.children[k].getSelfClientRect()

                let X1 = parentPos.left + parentPos.width / 2 - treePos.left
                let Y1 = parentPos.top + parentPos.height / 2 - treePos.top
                let X2 = childPos.left + childPos.width / 2 - treePos.left
                let Y2 = childPos.top + childPos.height / 2 - treePos.top

                let attribute = {}
                attribute.width = utils.getDistance([X1, Y1], [X2, Y2])
                attribute.left = parentPos.width / 2
                attribute.top = parentPos.height / 2
                attribute.rotate = utils.toAngle(Math.atan2(Y2 - Y1, X2 - X1))
                lines.push(attribute)
            }
            Nodes[i][j].lines = lines
        }
    }
}

// 后序遍历
const LRC = (header, nodes) => {
    // 将后序遍历转为水平结构储存 写法不太优雅
    let resNodes = []
    let lastNodeDepth = 0
    let levelNodes = []
    let maxDepth = 0

    // 得到maxDepth
    for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].depth > maxDepth) {
            maxDepth = nodes[i].depth
        }
    }

    // 初始化Nodes
    for (let i = 0; i <= maxDepth; i++) {
        resNodes[i] = []
        levelNodes[i] = []
    }

    for (let i = 0; i < nodes.length; i++) {
        let node = nodes[i]
        if (node.depth !== lastNodeDepth) {
            if (levelNodes[lastNodeDepth].length !== 0) {
                if (node.depth < lastNodeDepth) {
                    resNodes[lastNodeDepth].push(...levelNodes[lastNodeDepth])
                    node.children = [...levelNodes[lastNodeDepth]]
                    levelNodes[lastNodeDepth] = []
                } else if (node.depth > lastNodeDepth) {
                    levelNodes[node.depth] = []
                }
            }
            lastNodeDepth = node.depth
        }

        levelNodes[node.depth].push(node)
    }

    resNodes[0].push(...levelNodes[lastNodeDepth])
    return resNodes
}

// 前序遍历
const CLR = (header, nodes) => {
    // 将前序遍历转为水平结构储存
    let resNodes = []
    for (let i = 0; i < nodes.length; i++) {
        let node = nodes[i]
        if (resNodes.length === node.depth) {
            resNodes[node.depth] = [] // 初始化
        }
        resNodes[node.depth].push(node)

        if (node.depth === 0) {
            continue
        }

        let l = resNodes[node.depth - 1].length
        resNodes[node.depth - 1][l - 1].children.push(node)
    }

    return resNodes
}

// 树状格式
const TREE = (header, nodes) => {
    // 将树结构转为水平结构储存
    let resNodes = []
    let nodeNum = 0
    for (let i = 0; i < header.maxDepth; i++) {
        resNodes[i] = []
    }

    const dfs = (tree, depth) => {
        for (let i = 0; i < tree.length; i++) {
            nodeNum++
            let node = new Node(tree[i].key, depth, tree[i].value)
            if (resNodes.length === depth) {
                resNodes[depth] = []
            }
            resNodes[depth].push(node)

            if (depth > 0) { // 加入父节点的孩子中
                let l = resNodes[depth - 1].length
                resNodes[depth - 1][l - 1].children.push(node)
            }

            if (Object.hasOwn(tree[i], "children")) {
                dfs(tree[i].children, depth + 1)
            }
        }
    }
    dfs(nodes, 0)
    store.commit("updateNodeNum", nodeNum)
    return resNodes
}

// 获取node节点
const GetRefNode = (key) => {
    for (let i = 0; i < store.state.refNodes.length; i++) {
        if (store.state.refNodes[i].id === key.toString()) {
            return store.state.refNodes[i]
        }
    }
    return null
}

// 是否获取完所有节点
const IsGetNodes = async () => {
    if (store.state.refNodes.length === store.state.body.length ||
        store.state.header.order === Order.TREE &&
        store.state.refNodes.length === store.state.nodeNum) {
        return true
    } else {
        await new Promise((resolve) => {
            setTimeout(resolve, 1000)
        })
        return await IsGetNodes()
    }
}

// 整理节点形成树
const ArrangeNodes = (header, nodes) => {
    console.log("arrangeNodes...")
    return orderFunc[header.order](header, nodes)
}

const checkTree = (tree) => {
    if (!tree.header || !tree.bodies || !Array.isArray(tree.bodies)) {
        throw new Error("")
    }
}

const checkHeader = (tree) => {
    if (!tree.header.order ||
        tree.header.order !== Order.LRC &&
        tree.header.order !== Order.CLR &&
        tree.header.order !== Order.TREE) {
        throw new Error("")
    }
}

const checkBody1 = (element) => {
    if (!element.hasOwnProperty("key") ||
        !element.hasOwnProperty("value") ||
        !element.hasOwnProperty("depth")) {
        throw new Error("")
    }
}

// 检查树形结构，暂缓
const checkBody2 = (element) => {
    if (!element.hasOwnProperty("key") ||
        !element.hasOwnProperty("value") ||
        !element.hasOwnProperty("depth")) {
        throw new Error("")
    }
}

const GetFilterTree = (Nodes) => {
    return Nodes[0]
}

export {
    GetTreeMessage,
    CalculateLine,
    Init,
    LRC,
    CLR,
    TREE,
    ArrangeNodes,
    GetRefNode,
    IsGetNodes,
    GetFilterTree
}