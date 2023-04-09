var PointBuffer;
var HlineBuffer;
var VlineBuffer;
var TriangleBuffer;
var SquareBuffer;

console.log(glMatrix);
// console.log(glMatrix.mat4);
// console.log(mat4);

var mat4 = glMatrix.mat4;
console.log(mat4);

var gl;

var width;
var height;
var shape = "triangle";
var color = "red";
var center_x;
var center_y;
var isScale = false;

var programArray = [];

var global = false;

var Z_angle = 0.0;

var lastMouseX = 0, lastMouseY = 0;

function degToRad(degrees) {
    return degrees * Math.PI / 180;
}

function drawShape(center_x, center_y, color, shape, scale, Z_angle, matrix) {
    var shaderProgram = initShaders();
    // programArray.push({
    //     "x" : center_x,
    //     "y" : center_y,
    //     "color" : color,
    //     "shape" : shape,
    //     "scale" : scale,
    //     "Z_angle" : Z_angle
    // });

    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
    var vertexPositionBuffer;
    var vertices;
    if (shape === "point") {
        vertexPositionBuffer = PointBuffer;
        vertices = [
            center_x, center_y, 0.0
        ];
    } else if (shape === "horizontal line") {
        vertexPositionBuffer = HlineBuffer;
        vertices = [
            center_x-0.05, center_y, 0.0,
            center_x+0.05, center_y, 0.0
        ];
    } else if (shape === "vertical line") {
        vertexPositionBuffer = VlineBuffer;
        vertices = [
            center_x, center_y-0.05, 0.0,
            center_x, center_y+0.05, 0.0
        ];
    } else if (shape === "triangle") {
        vertexPositionBuffer = TriangleBuffer;
        vertices = [
            center_x-0.05, center_y-0.05, 0.0,
            center_x+0.05, center_y-0.05, 0.0,
            center_x, center_y+0.05, 0.0
        ];
        
    } else if (shape === "squre") {
        vertexPositionBuffer = SquareBuffer;
        vertices = [
            center_x-0.04, center_y-0.04, 0.0,
            center_x-0.04, center_y+0.04, 0.0,
            center_x+0.04, center_y-0.04, 0.0,
            center_x+0.04, center_y+0.04, 0.0,
            center_x-0.04, center_y+0.04, 0.0,
            center_x+0.04, center_y-0.04, 0.0
        ];
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

    var temp = [];
    mat4.multiply(temp, matrix, [center_x, center_y, 0, 1]);
    x = temp[0];
    y = temp[1];


    var mvMatrix = [];
    var matrix1 = mat4.create();

    if (global && !isScale) {
        mat4.rotate(matrix1, matrix1, degToRad(Z_angle), [0, 0, 1]);
        mat4.translate(matrix1, matrix1, [x, y, 0]);
        mat4.scale(matrix1, matrix1, [1+scale, 1+scale, 1]);
        mat4.translate(matrix1, matrix1, [-x, -y, 0]);
    }else {
        mat4.translate(matrix1, matrix1, [x, y, 0]);
        mat4.scale(matrix1, matrix1, [1+scale, 1+scale, 1]);
        mat4.rotate(matrix1, matrix1, degToRad(Z_angle), [0, 0, 1]);
        mat4.translate(matrix1, matrix1, [-x, -y, 0]);
    }

    mat4.multiply(mvMatrix, matrix1, matrix);
    
    programArray.push({
        "x" : center_x,
        "y" : center_y,
        "color" : color,
        "shape" : shape,
        "scale" : 0,
        "Z_angle" : 0,
        "matrix" : mvMatrix
    });

    var uMVMatrix = gl.getUniformLocation(shaderProgram, 'uMVMatrix');
    gl.uniformMatrix4fv(uMVMatrix, false, mvMatrix);

    var r = 0.0, g = 0.0, b = 0.0;
    if (color === "red") r = 1.0;
    else if (color === "green") g = 1.0;
    else if (color === "blue") b = 1.0;
    var u_color = gl.getUniformLocation(shaderProgram, 'u_color');
    gl.uniform3f(u_color, r, g, b);

    switch(shape) {
        case "point":
            gl.drawArrays(gl.POINTS, 0, vertexPositionBuffer.numItems);
            break;
        case "horizontal line":
            gl.drawArrays(gl.LINES, 0, vertexPositionBuffer.numItems);
            break;
        case "vertical line":
            gl.drawArrays(gl.LINES, 0, vertexPositionBuffer.numItems);
            break;
        case "triangle":
            gl.drawArrays(gl.TRIANGLES, 0, vertexPositionBuffer.numItems);
            break;
        case "squre":
            gl.drawArrays(gl.TRIANGLES, 0, vertexPositionBuffer.numItems);
            break;
        default:
            break;
    }
    return mvMatrix;
}

function reDisplay() {
    for (const program of programArray) {
        var matrix = drawShape(program.x, program.y, program.color, program.shape, program.scale, program.Z_angle, program.matrix);
        program.matrix = matrix;
        programArray.pop();
    }
}

document.addEventListener('keypress', (event) => {
    var name = event.key;
    var code = event.code;
    
    if (event.key === 'p') {
        shape = "point";
        console.log(`key press: ${event.key}`);
    }else if (event.key === 'h') {
        shape = "horizontal line";
        console.log(`key press: ${event.key}`);
    }else if (event.key === 'v') {
        shape = "vertical line";
        console.log(`key press: ${event.key}`);
    }else if (event.key === 't') {
        shape = "triangle";
        console.log(`key press: ${event.key}`);
    }else if (event.key === 'q') {
        shape = "squre";
        console.log(`key press: ${event.key}`);
    }else if (event.key === 'r') {
        color = "red";
        console.log(`key press: ${event.key}`);
    }else if (event.key === 'g') {
        color = "green";
        console.log(`key press: ${event.key}`);
    }else if (event.key === 'b') {
        color = "blue";
        console.log(`key press: ${event.key}`);
    }else if (event.key === 'd') {
        drawScene();
        setTimeout(reDisplay, 500);
        console.log(`key press: ${event.key}`);
    }else if (event.key === 'c') {
        drawScene();
        programArray = [];
        console.log(`key press: ${event.key}`);
    }else if (event.key === 'S') {
        if (!global) {
            programArray[programArray.length-1].scale = 0.05;
        }else {
            for (var program of programArray) {
                program.scale = 0.05;
            }
        }
        drawScene();
        isScale = true;
        reDisplay();
        isScale = false;
        for (var program of programArray) {
            program.scale = 0;
        }
        console.log(`key press: ${event.key}`);
    }else if (event.key === 's') {
        if (!global) {
            programArray[programArray.length-1].scale = -0.05;
        }else {
            for (var program of programArray) {
                program.scale = -0.05;
            }
        }
        drawScene();
        isScale = true;
        reDisplay();
        isScale = false;
        for (var program of programArray) {
            program.scale = 0;
        }
        console.log(`key press: ${event.key}`);
    }else if (event.key === 'W') {
        global = true;
        console.log(`key press: ${event.key}`);
    }else if (event.key === 'w') {
        global = false;
        console.log(`key press: ${event.key}`);
    }
  });

function onDocumentMouseDown( event ) {
    var x = event.clientX;
    var y = event.clientY;
    center_x = -1 + x/width*2;
    center_y = 1 - y/height*2;     
    console.log(`Mouse clicked at x: ${x}, y: ${y}`);
    drawShape(center_x, center_y, color, shape, 0, 0.0, mat4.create());

    event.preventDefault();
    document.addEventListener( 'mousemove', onDocumentMouseMove, false );
    document.addEventListener( 'mouseup', onDocumentMouseUp, false );
    document.addEventListener( 'mouseout', onDocumentMouseOut, false );
    var mouseX = event.clientX;
    var mouseY = event.clientY;

    lastMouseX = mouseX;
    lastMouseY = mouseY; 

}

function onDocumentMouseMove( event ) {
    var mouseX = event.clientX;
    var mouseY = event.ClientY; 

    var diffX = mouseX - lastMouseX;
    var diffY = mouseY - lastMouseY;

    Z_angle = Z_angle + diffX/5;

    lastMouseX = mouseX;
    lastMouseY = mouseY;

    


    if (!global) {
        programArray[programArray.length-1].Z_angle += Z_angle;
    }else {
        for (var program of programArray) {
            program.Z_angle += Z_angle;
        }
    }
    drawScene();
    reDisplay();
    for (var program of programArray) {
        program.Z_angle = 0;
    }
}

function onDocumentMouseUp( event ) {
    document.removeEventListener( 'mousemove', onDocumentMouseMove, false );
    document.removeEventListener( 'mouseup', onDocumentMouseUp, false );
    document.removeEventListener( 'mouseout', onDocumentMouseOut, false );
    
}

function onDocumentMouseOut( event ) {
    document.removeEventListener( 'mousemove', onDocumentMouseMove, false );
    document.removeEventListener( 'mouseup', onDocumentMouseUp, false );
    document.removeEventListener( 'mouseout', onDocumentMouseOut, false );
}

function onClick(event) {
    var x = event.clientX;
    var y = event.clientY;

    center_x = -1 + x/width*2;
    center_y = 1 - y/height*2;
        
    console.log(`Mouse clicked at x: ${x}, y: ${y}`);

    drawShape(center_x, center_y, color, shape, 1, 0.0);
}  

function initGL(canvas) {
    try {
        gl = canvas.getContext("webgl", { preserveDrawingBuffer: true });  // the graphics context 
        gl.viewportWidth = canvas.width;   // the width of the canvas
        gl.viewportHeight = canvas.height; // the height 
    } catch (e) {
    }
    if (!gl) {
        alert("Could not initialise WebGL, sorry :-(");
    }
}

function drawScene() {
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

}

// This is the entry point from the httml 
function webGLStart() {
    var canvas = document.getElementById("canvas");
    initGL(canvas);
    width = canvas.width;
    height = canvas.height;
    // document.addEventListener('click', onClick);

    PointBuffer = gl.createBuffer();
    PointBuffer.itemSize = 3;
    PointBuffer.numItems = 1;

    HlineBuffer = gl.createBuffer();
    HlineBuffer.itemSize = 3;
    HlineBuffer.numItems = 2;

    VlineBuffer = gl.createBuffer();
    VlineBuffer.itemSize = 3;
    VlineBuffer.numItems = 2;

    TriangleBuffer = gl.createBuffer();
    TriangleBuffer.itemSize = 3;
    TriangleBuffer.numItems = 3;

    SquareBuffer = gl.createBuffer();
    SquareBuffer.itemSize = 3;
    SquareBuffer.numItems = 6

    gl.clearColor(1.0, 1.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    document.addEventListener('mousedown', onDocumentMouseDown, false); 

    drawScene();
}

function getShader(gl, id) {
    var shaderScript = document.getElementById(id);
    if (!shaderScript) {
        return null;
    }

    var str = "";
    var k = shaderScript.firstChild;
    while (k) {
        if (k.nodeType == 3) {
            str += k.textContent;
        }
        k = k.nextSibling;
    }

    var shader;
    if (shaderScript.type == "x-shader/x-fragment") {
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (shaderScript.type == "x-shader/x-vertex") {
        shader = gl.createShader(gl.VERTEX_SHADER);
    } else {
        return null;
    }

    gl.shaderSource(shader, str);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(shader));
        return null;
    }

    return shader;
}


function initShaders() {

    var shaderProgram = gl.createProgram();

    var fragmentShader = getShader(gl, "shader-fs");
    var vertexShader = getShader(gl, "shader-vs");

    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert("Could not initialise shaders");
    }

    gl.useProgram(shaderProgram);

    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

    return shaderProgram;
}