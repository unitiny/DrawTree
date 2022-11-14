import {registerElement} from "./register-element.js";

export const registerGlobal = function (app) {
    app.use(registerElement)
}