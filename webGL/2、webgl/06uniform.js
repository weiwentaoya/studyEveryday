const canvas = document.querySelector("#cvs");
canvas.width = window.innerWidth
canvas.height = window.innerHeight
import {initShaders} from "./util/utils.js"
const gl = canvas.getContext('webgl')
gl.enable(gl.BLEND) //开启片元的颜色合成功能
gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)//设置片元的合成方式
//定义顶点着色器
const VertexShader =`
    attribute vec4 a_Position;
    attribute float a_PointSize;
    void main(){
        //定位
        gl_Position = a_Position;
        //大小
        gl_PointSize = a_PointSize;
    }
`
//定义片元着色器
const FramnebtShader = `
    precision mediump float;
    uniform vec4 u_fragColor ;
    void main(){
        float dist = distance(gl_PointCoord, vec2(0.5,0.5));
        if(dist<0.5){
            gl_FragColor = u_fragColor;
        }else{
            discard;
        }
        
    }
`
// 初始化着色器

gl.clearColor(0,0,0,0.5)
// gl.clear(gl.COLOR_BUFFER_BIT)
initShaders(gl, VertexShader,FramnebtShader)


// gl.drawArrays(gl.POINTS, 0, 1)

const a_points = [
    [ -0.5, 0, 0,],
    [ 0.5, 0, 0],
]
function rand(points) {
    gl.clear(gl.COLOR_BUFFER_BIT)

    points.forEach((item,index)=>{
        const a_Position = gl.getAttribLocation(gl.program,'a_Position')
        const a_PointSize = gl.getAttribLocation(gl.program,'a_PointSize')
        gl.vertexAttrib3f(a_Position,...item)
        gl.vertexAttrib1f(a_PointSize, index)
        
        const u_fragColor = gl.getUniformLocation(gl.program,'u_fragColor')
        gl.uniform4f(u_fragColor, Math.abs(item[0]),Math.abs(item[1]),1, Math.abs(item[0]))
        gl.drawArrays(gl.POINTS, 0, 1)
    })
}
rand(a_points)

const {left, top, width, height} = canvas.getBoundingClientRect()
canvas.addEventListener('click',({clientX, clientY})=>{
    const [cssX, cssY] =[
        clientX-left,
        clientY-top
    ]
    const [xBaseCenter, yBaseCenter] = [cssX- width/2, -(cssY-height/2)]
    const [x, y] = [xBaseCenter/ (width/2), yBaseCenter/(height/2)]

    a_points.push([ x, y, 0])
    rand(a_points)
})