import {createStore} from "vuex"

const store = createStore({
    state: {
        header: {},
        body: [],
        refNodes: [],
        nodeNum: 0,
        tip: ""
    },

    mutations: {
        clearState(state) {
            state.header = {}
            state.body = []
            state.refNodes = []
        },
        updateHeader(state, header) {
            state.header = header
        },
        updateBody(state, body) {
            state.body = body
        },
        updateRefNodes(state, nodes) {
            if (nodes !== null) {
                for (let i = 0; i < nodes.length; i++) {
                    let isUpdate = false
                    for (let j = 0; j < state.refNodes.length; j++) {
                        if(state.refNodes[j].id === nodes[i].id) {
                            state.refNodes[j] = nodes[i]
                            isUpdate = true
                            break
                        }
                    }

                    if(!isUpdate) {
                        state.refNodes.push(nodes[i])
                    }
                }
            }
        },
        updateNodeNum(state, num) {
            state.nodeNum = num
        },
        updateTip(state, tip) {
            state.tip = tip
        },
    }
})

export default store



