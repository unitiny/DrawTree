class Node {
    constructor(key, depth, val) {
        this.key = key
        this.depth = depth
        this.value = val
        this.selfRef = {}
        this.children = []
        this.label = key.toString()
        this.lines = []
        this.show = true
    }

    addChildNodes(node) {
        this.children.push(node)
    }

    delChildNodes(index) {
        let length = this.children.length
        this.children = [...this.children.slice(0, index), ...this.children.slice(index + 1, length)]
    }

    getSelfClientRect() {
        return this.selfRef.getBoundingClientRect()
    }

    arrangeNodes(func, params) {
        func(this, params)
        for (let i = 0; i < this.children.length; i++) {
            this.children[i].arrangeNodes(func, params)
        }
    }
}

export default Node