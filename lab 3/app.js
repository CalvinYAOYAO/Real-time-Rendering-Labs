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

var squareVertexPositionBuffer;
var squareVertexIndexBuffer; 
var CylinderVertexPositionBuffer;
var CylinderVertexIndexBuffer;
var SphereVertexPositionBuffer;
var SphereVertexColorBuffer;

var camera = [0, 0, 1];
var COI = [0, 0, 0];
var roll = 0;
var Tier = 1;

function degToRad(degrees) {
    return degrees * Math.PI / 180;
}


function initCylinder() {
    var radius = 0.1;
    var height = 0.3;
    var numSegments = 16;

    var vertices = [];
    for (var i = 0; i <= numSegments; i++) {
        var angle = i * 2 * Math.PI / numSegments;
        var x = radius * Math.cos(angle);
        var z = radius * Math.sin(angle);
        vertices.push(x, height/2, z); // top vertex
        vertices.push(x, -height/2, z); // bottom vertex
    }

    var indices = [];
    for (var i = 0; i < numSegments; i++) {
        var j = i * 2;
        indices.push(j, j+1, j+2);
        indices.push(j+1, j+3, j+2);
    }
    indices.push(0, 1, numSegments*2+1);
    indices.push(1, numSegments*2+2, numSegments*2+1);

    CylinderVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, CylinderVertexPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices),gl.STATIC_DRAW);
    CylinderVertexPositionBuffer.itemSize = 3;

    CylinderVertexIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, CylinderVertexIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
    CylinderVertexIndexBuffer.itemSize = 1;
    CylinderVertexIndexBuffer.numItems = indices.length;

}

function initSphere() {
    var radius = 0.2;
    var numSegments = 32;
    var numSlices = 16;

    // Create the vertex array
    var vertices = [];
    for (var i = 0; i <= numSlices; i++) {
        var theta = i * Math.PI / numSlices;
        var sinTheta = Math.sin(theta);
        var cosTheta = Math.cos(theta);

        for (var j = 0; j <= numSegments; j++) {
            var phi = j * 2 * Math.PI / numSegments;
            var sinPhi = Math.sin(phi);
            var cosPhi = Math.cos(phi);

            var x = cosPhi * sinTheta * radius;
            var y = cosTheta * radius;
            var z = sinPhi * sinTheta * radius;

            vertices.push(x, y, z);
        }
    }

    var indices = [];
    for (var i = 0; i < numSlices; i++) {
        for (var j = 0; j < numSegments; j++) {
            var index1 = (i * (numSegments + 1)) + j;
            var index2 = index1 + numSegments + 1;
            indices.push(index1, index2, index1 + 1);
            indices.push(index2, index2 + 1, index1 + 1);
        }
    }

    SphereVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, SphereVertexPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices),gl.STATIC_DRAW);
    SphereVertexPositionBuffer.itemSize = 3;

    SphereVertexIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, SphereVertexIndexBuffer); 
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);  
    SphereVertexIndexBuffer.itemSize = 1;
    SphereVertexIndexBuffer.numItems = indices.length; 

}

function initCube() {
    squareVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexPositionBuffer);
    var vertices = [
         0.5,  0.5,  -.5,
        -0.5,  0.5,  -.5, 
        - 0.5, -0.5,  -.5,
        0.5, -0.5,  -.5,
         0.5,  0.5,  .5,
        -0.5,  0.5,  .5, 
        -0.5, -0.5,  .5,
        0.5, -0.5,  .5,      
  
    ];
    var size = 0.4;
    for (var i = 0; i < vertices.length; i++) vertices[i] *= size;
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    squareVertexPositionBuffer.itemSize = 3;
    squareVertexPositionBuffer.numItems = 8;

    var indices = [0,1,2, 0,2,3, 0,3,7, 0, 7,4, 6,2,3,6,3,7,5,1,2, 5,2,6,5,1,0,5,0,4,5,6,7,5,7,4];
    squareVertexIndexBuffer = gl.createBuffer();  
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, squareVertexIndexBuffer); 
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);  
    squareVertexIndexBuffer.itemSize = 1;
    squareVertexIndexBuffer.numItems = 36;  

}


function drawShape(shape, diff_x, diff_y, scale, Z_angle) {
    var shaderProgram = initShaders();
    var vertexPositionBuffer, vertexIndexBuffer;
    var r = 0, g = 0, b = 0;
    var mMatrix = mat4.create();  
    var vMatrix = mat4.create(); 
    var pMatrix = mat4.create();

    if (shape == 'Cube') {
        vertexPositionBuffer = squareVertexPositionBuffer;
        vertexIndexBuffer = squareVertexIndexBuffer;
        r = 1;
        // mat4.translate(mMatrix, mMatrix, [0, -0.2, 0]);
    }else if (shape == 'Cylinder') {
        vertexPositionBuffer = CylinderVertexPositionBuffer;
        vertexIndexBuffer = CylinderVertexIndexBuffer;
        g = 1;
        // mat4.translate(mMatrix, mMatrix, [0, 0, 0]);
    }else if (shape == 'Sphere') {
        vertexPositionBuffer = SphereVertexPositionBuffer;
        vertexIndexBuffer = SphereVertexIndexBuffer;
        b = 1;
        // mat4.translate(mMatrix, mMatrix, [0, 0.35, 0]);
    }

    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vertexIndexBuffer);

    
    mat4.scale(mMatrix, mMatrix, [scale, scale, 1]);
    mat4.translate(mMatrix, mMatrix, [diff_x, diff_y, 0]);
    mat4.rotate(mMatrix, mMatrix, degToRad(Z_angle), [0, 0, 1]);

    mat4.lookAt(vMatrix, camera, COI, [0, 1, 0]);

    var rollMatrix = mat4.create();
    mat4.identity(rollMatrix);
    mat4.rotateZ(rollMatrix, rollMatrix, roll);
    mat4.mul(vMatrix, rollMatrix, vMatrix);

    var uMMatrix = gl.getUniformLocation(shaderProgram, 'uMMatrix');
    var uVMatrix = gl.getUniformLocation(shaderProgram, 'uVMatrix');
    var uPMatrix = gl.getUniformLocation(shaderProgram, 'uPMatrix');
    gl.uniformMatrix4fv(uMMatrix, false, mMatrix);
    gl.uniformMatrix4fv(uVMatrix, false, vMatrix);
    gl.uniformMatrix4fv(uPMatrix, false, pMatrix);

    var u_color = gl.getUniformLocation(shaderProgram, 'u_color');
    gl.uniform3f(u_color, r, g, b);

    gl.drawElements(gl.TRIANGLES, vertexIndexBuffer.numItems , gl.UNSIGNED_SHORT, 0);
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
    
    switch(name) {
        case 'P': 
            COI[1] -= 0.05;
            break;
        case 'p':
            COI[1] += 0.05;
            break;
        case 'Y':
            COI[0] -= 0.05;
            break;
        case 'y':
            COI[0] += 0.05;
            break;
        case 'R':
            roll -= Math.PI/16;
            break;
        case 'r':
            roll += Math.PI/16;
            break;
        case 'W':
            setMove(0, 0.05);
            break;
        case 'S':
            setMove(0, -0.05);
            break;
        case 'A':
            setMove(-0.05, 0);
            break;
        case 'D':
            setMove(0.05, 0);
            break;
        case 'L':
            setScale(0.05);
            break;
        case 'l':
            setScale(-0.05);
            break;
        default:
            break;  
    }
    
    drawScene();
  });



function onDocumentMouseDown( event ) {
    var x = event.clientX;
    var y = event.clientY;
    center_x = -1 + x/width*2;
    center_y = 1 - y/height*2;     
    console.log(`Mouse clicked at x: ${x}, y: ${y}`);
    // drawShape(center_x, center_y, color, shape, 0, 0.0, mat4.create());

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
    var mouseY = event.clientY; 

    var diffX = mouseX - lastMouseX;
    var diffY = mouseY - lastMouseY;

    Z_angle = 0;
    Z_angle = Z_angle + diffX/30;
    Z_angle = Z_angle + diffY/30;

    lastMouseX = mouseX;
    lastMouseY = mouseY;

    if (Tier == 1) {
        programArray[0].Z_angle += Z_angle;
        programArray[1].Z_angle += Z_angle;
        programArray[2].Z_angle += Z_angle;
    }else if (Tier == 2) {
        programArray[1].Z_angle += Z_angle;
        programArray[2].Z_angle += Z_angle;
    }else if (Tier == 3) {
        programArray[2].Z_angle += Z_angle;
    }

    drawScene();
    
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

    // drawShape(center_x, center_y, color, shape, 1, 0.0);
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
    drawShape('Cube', programArray[0].diff_x, programArray[0].diff_y, programArray[0].scale, programArray[0].Z_angle);
    drawShape('Cylinder', programArray[1].diff_x, programArray[1].diff_y, programArray[1].scale, programArray[1].Z_angle);
    drawShape('Sphere', programArray[2].diff_x, programArray[2].diff_y, programArray[2].scale, programArray[2].Z_angle);

}

function setMove(x, y) {
    if (Tier == 1) {
        programArray[0].diff_x += x;
        programArray[0].diff_y += y;
        programArray[1].diff_x += x;
        programArray[1].diff_y += y;
        programArray[2].diff_x += x;
        programArray[2].diff_y += y;
    }else if (Tier == 2) {
        programArray[1].diff_x += x;
        programArray[1].diff_y += y;
        programArray[2].diff_x += x;
        programArray[2].diff_y += y;
    }else if (Tier == 3) {
        programArray[2].diff_x += x;
        programArray[2].diff_y += y;
    }
}

function setScale(s) {
    if (Tier == 1) {
        programArray[0].scale += s;
        programArray[1].scale += s;
        programArray[2].scale += s;
    }else if (Tier == 2) {
        programArray[1].scale += s;
        programArray[2].scale += s;
    }else if (Tier == 3) {
        programArray[2].scale += s;
    }
}

function setTier(t) {
    Tier = t;
}




// This is the entry point from the html 
function webGLStart() {
    var canvas = document.getElementById("canvas");
    initGL(canvas);
    width = canvas.width;
    height = canvas.height;

    gl.enable(gl.DEPTH_TEST);

    initCube();
    initCylinder();
    initSphere();

    programArray.push({
        "shape" : 'Cube',
        "diff_x" : 0,
        "diff_y" : -0.2,
        "scale" : 1,
        "Z_angle" : 0
    });
    programArray.push({
        "shape" : 'Cylinder',
        "diff_x" : 0,
        "diff_y" : 0,
        "scale" : 1,
        "Z_angle" : 0
    });
    programArray.push({
        "shape" : 'Sphere',
        "diff_x" : 0,
        "diff_y" : 0.35,
        "scale" : 1,
        "Z_angle" : 0
    });

    gl.clearColor(1.0, 1.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    document.addEventListener('mousedown', onDocumentMouseDown, false); 

    drawScene();
}

// set-up code from professor Han-wei Shen
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

// set-up code from professor Han-wei Shen
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