import * as tree from "./tree.js"
import FileSaver from 'file-saver'

const parseFileStream = (file) => {
    let fileReader = new FileReader();
    fileReader.readAsText(file)
    return fileReader
}

// 文件是否加载完成
const isLoad = async (reader) => {
    if (reader.result !== null) {
        return true
    } else {
        await new Promise((resolve) => {
            setTimeout(resolve, 1000)
        })
        return await isLoad(reader)
    }
}

// 解析文件内容
const ParseFile = async (f) => {
    let reader = parseFileStream(f)

    let flag = await isLoad(reader)
    if (flag) {
        tree.GetTreeMessage(reader.result)
    } else {
        console.error("file is unload")
    }
}

// 生成JSON文件
const CreateJSON = (json) => {
    const blob = new Blob([json], {
        type: "text/plain;charset=utf-8"
    });
    FileSaver.saveAs(blob, "tree.json");
}

export {
    ParseFile,
    CreateJSON
}