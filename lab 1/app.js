var gl;

var width;
var height;
var shape = "triangle";
var color = "red";
var center_x;
var center_y;

var programArray = [];




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
    canvas.addEventListener('click', onClick);

    
    gl.clearColor(1.0, 1.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    drawScene();
}

function onClick(event) {
    var x = event.clientX;
    var y = event.clientY;

    center_x = -1 + x/width*2;
    center_y = 1 - y/height*2;
        
    console.log(`Mouse clicked at x: ${x}, y: ${y}`);
    drawShape();
}

function drawShape() {
    if (shape === "point") {
        drawPoint(center_x, center_y, color);
    } else if (shape === "horizontal line") {
        drawHor_Line(center_x, center_y, color);
    } else if (shape === "vertical line") {
        drawVer_Line(center_x, center_y, color);
    } else if (shape === "triangle") {
        drawTriangle(center_x, center_y, color);
    } else if (shape === "squre") {
        drawSqure(center_x, center_y, color);
    } else if (shape === "circle") {
        drawCircle(center_x, center_y, color);
    } 
}

function drawPoint(center_x, center_y, color) {
    var shaderProgram = initShaders();
    programArray.push({
        "x" : center_x,
        "y" : center_y,
        "color" : color,
        "shape" : "point"
    });


    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
    var vertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
    var vertices = [
        center_x, center_y, 0.0
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    vertexPositionBuffer.itemSize = 3;     
    vertexPositionBuffer.numItems = 1; 
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);


    
    var r = 0.0, g = 0.0, b = 0.0;
    if (color === "red") r = 1.0;
    else if (color === "green") g = 1.0;
    else if (color === "blue") b = 1.0;
    var u_color = gl.getUniformLocation(shaderProgram, 'u_color');
    gl.uniform3f(u_color, r, g, b);

    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.drawArrays(gl.POINTS, 0, vertexPositionBuffer.numItems);
}

function drawHor_Line(center_x, center_y, color) {
    var shaderProgram = initShaders();
    programArray.push({
        "x" : center_x,
        "y" : center_y,
        "color" : color,
        "shape" : "horizontal line"
    });

    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

    var vertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
    var vertices = [
        center_x-0.05, center_y, 0.0,
        center_x+0.05, center_y, 0.0
    ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    vertexPositionBuffer.itemSize = 3;     
    vertexPositionBuffer.numItems = 2; 

    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

    var r = 0.0, g = 0.0, b = 0.0;
    if (color === "red") r = 1.0;
    else if (color === "green") g = 1.0;
    else if (color === "blue") b = 1.0;
    var u_color = gl.getUniformLocation(shaderProgram, 'u_color');
    gl.uniform3f(u_color, r, g, b);

    gl.drawArrays(gl.LINES, 0, vertexPositionBuffer.numItems);
}

function drawVer_Line(center_x, center_y, color) {
    var shaderProgram = initShaders();
    programArray.push({
        "x" : center_x,
        "y" : center_y,
        "color" : color,
        "shape" : "vertical line"
    });
    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

    var vertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
    var vertices = [
        center_x, center_y-0.05, 0.0,
        center_x, center_y+0.05, 0.0
    ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    vertexPositionBuffer.itemSize = 3;     
    vertexPositionBuffer.numItems = 2; 

    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

    var r = 0.0, g = 0.0, b = 0.0;
    if (color === "red") r = 1.0;
    else if (color === "green") g = 1.0;
    else if (color === "blue") b = 1.0;
    var u_color = gl.getUniformLocation(shaderProgram, 'u_color');
    gl.uniform3f(u_color, r, g, b);

    gl.drawArrays(gl.LINES, 0, vertexPositionBuffer.numItems);
}

function drawTriangle(center_x, center_y, color) {
    var shaderProgram = initShaders();
    programArray.push({
        "x" : center_x,
        "y" : center_y,
        "color" : color,
        "shape" : "triangle"
    });
    
    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

    var vertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
    var vertices = [
        center_x-0.05, center_y-0.05, 0.0,
        center_x+0.05, center_y-0.05, 0.0,
        center_x, center_y+0.05, 0.0
    ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    vertexPositionBuffer.itemSize = 3;     
    vertexPositionBuffer.numItems = 3; 

    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

    var r = 0.0, g = 0.0, b = 0.0;
    if (color === "red") r = 1.0;
    else if (color === "green") g = 1.0;
    else if (color === "blue") b = 1.0;
    var u_color = gl.getUniformLocation(shaderProgram, 'u_color');
    gl.uniform3f(u_color, r, g, b);

    gl.drawArrays(gl.TRIANGLES, 0, vertexPositionBuffer.numItems);
}

function drawSqure(center_x, center_y, color) {
    var shaderProgram = initShaders();
    programArray.push({
        "x" : center_x,
        "y" : center_y,
        "color" : color,
        "shape" : "squre"
    });
    
    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

    var vertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
    var vertices = [
        center_x-0.04, center_y-0.04, 0.0,
        center_x-0.04, center_y+0.04, 0.0,
        center_x+0.04, center_y-0.04, 0.0,
        center_x+0.04, center_y+0.04, 0.0,
        center_x-0.04, center_y+0.04, 0.0,
        center_x+0.04, center_y-0.04, 0.0
    ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    vertexPositionBuffer.itemSize = 3;     
    vertexPositionBuffer.numItems = 6; 

    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

    var r = 0.0, g = 0.0, b = 0.0;
    if (color === "red") r = 1.0;
    else if (color === "green") g = 1.0;
    else if (color === "blue") b = 1.0;
    var u_color = gl.getUniformLocation(shaderProgram, 'u_color');
    gl.uniform3f(u_color, r, g, b);

    gl.drawArrays(gl.TRIANGLES, 0, vertexPositionBuffer.numItems);
}


function drawCircle(center_x, center_y, color) {
    var shaderProgram = initShaders();
    programArray.push({
        "x" : center_x,
        "y" : center_y,
        "color" : color,
        "shape" : "circle"
    });

    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

    var vertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);

    var vertices = [];
    var stops = 1000;
    for (i = 0; i < stops; i++){
        vertices.push(center_x+0.05*Math.cos(i * 2 * Math.PI/stops)); // x coord
        vertices.push(center_y+0.05*Math.sin(i * 2 * Math.PI/stops)); // y coord
        vertices.push(0);
        vertices.push(center_x-0.05*Math.cos(i * 2 * Math.PI/stops)); // x coord
        vertices.push(center_y-0.05*Math.sin(i * 2 * Math.PI/stops)); // y coord
        vertices.push(0);
    }


    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    vertexPositionBuffer.itemSize = 3;     
    vertexPositionBuffer.numItems = stops; 

    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

    var r = 0.0, g = 0.0, b = 0.0;
    if (color === "red") r = 1.0;
    else if (color === "green") g = 1.0;
    else if (color === "blue") b = 1.0;
    var u_color = gl.getUniformLocation(shaderProgram, 'u_color');
    gl.uniform3f(u_color, r, g, b);

    gl.drawArrays(gl.LINES, 0, vertexPositionBuffer.numItems);
}



function reDisplay() {
    for (const program of programArray) {
        if (program.shape === "point") {
            drawPoint(program.x, program.y, program.color);
            programArray.pop();
        } else if (program.shape === "horizontal line") {
            drawHor_Line(program.x, program.y, program.color);
            programArray.pop();
        } else if (program.shape === "vertical line") {
            drawVer_Line(program.x, program.y, program.color);
            programArray.pop();
        } else if (program.shape === "triangle") {
            drawTriangle(program.x, program.y, program.color);
            programArray.pop();
        } else if (program.shape === "squre") {
            drawSqure(program.x, program.y, program.color);
            programArray.pop();
        } else if (program.shape === "circle") {
            drawCircle(program.x, program.y, program.color);
            programArray.pop();
        }
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
        shape = "circle";
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
    }

  });

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