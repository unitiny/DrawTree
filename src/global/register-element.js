import "element-plus/dist/index.css"

import {
    ElButton, ElUpload, ElScrollbar,
    ElRow, ElCol, ElInput, ElBacktop,
    ElTooltip, ElSwitch, ElTree, ElIcon,
    ElDivider, ElDialog, ElLink, ElCollapse,
    ElCollapseItem
} from "element-plus/lib/components/index"

const cpns = [ElButton, ElUpload, ElScrollbar,
    ElRow, ElCol, ElInput, ElBacktop,
    ElTooltip, ElSwitch, ElTree, ElIcon,
    ElDivider, ElDialog, ElLink, ElCollapse,
    ElCollapseItem]
export const registerElement = function (app) {
    cpns.forEach(cpn => {
        app.component(cpn.name, cpn)
    })
}