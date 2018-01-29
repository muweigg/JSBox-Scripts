class GLParticleIcons {

    constructor(canvasId, imageURLArr) {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.imageURLArr = imageURLArr;
        this.id = 0;
        this.canvasId = canvasId;
        this.target = [];
        this.gl = null;
        this.ratio = null;
        this.count = 0;
        this.drawType = 0;
        this.numLines = 100000;
        this.perspectiveMatrix = null;
        this.randomTargetXArr = [];
        this.randomTargetYArr = [];

        this.coefficient = .4;
        this.targetCoefficient = .01;

        for (let i = 0; i < this.imageURLArr.length; i++) {
            const image = new Image();
            image.src = imageURLArr[i];
            image.onload = this.onLoadImageHandler.bind(this, image, this.canvas, this.ctx, i);
        }
    }

    onLoadImageHandler(image, canvas, ctx, number) {
        const size = image.width;
        this.canvas.width = size;
        this.canvas.height = size;

        this.ctx.drawImage(image, 0, 0);
        const imageData = this.ctx.getImageData(0, 0, size, size);

        const data = imageData.data;
        this.target[number] = [];

        for (let i = 0; i < data.length; i += 4) {
            if (data[i] == 0) {
                let pixNumber = i / 4;
                let xPos = pixNumber % size;
                let yPos = parseInt(pixNumber / size);
                let pos = { x: xPos / size - .5, y: -yPos / size + 0.5 };
                this.target[number].push(pos);
            }
        }

        this.count++;

        if (this.count == this.imageURLArr.length) this.loadScene();
    }


    loadScene () {
        this.canvas = document.getElementById(this.canvasId);
        this.gl = this.canvas.getContext("experimental-webgl");

        if (!this.gl) {
            alert("There's no WebGL context available.");
            return;
        }

        let cw = window.innerWidth;
        let ch = window.innerHeight;
        this.canvas.width = cw;
        this.canvas.height = ch;
        this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);

        let vertexShaderScript = document.getElementById("shader-vs");
        let vertexShader = this.gl.createShader(this.gl.VERTEX_SHADER);
        this.gl.shaderSource(vertexShader, vertexShaderScript.text);
        this.gl.compileShader(vertexShader);

        if (!this.gl.getShaderParameter(vertexShader, this.gl.COMPILE_STATUS)) {
            alert("Couldn't compile the vertex shader");
            this.gl.deleteShader(vertexShader);
            return;
        }

        let fragmentShaderScript = document.getElementById("shader-fs");
        let fragmentShader = this.gl.createShader(this.gl.FRAGMENT_SHADER);
        this.gl.shaderSource(fragmentShader, fragmentShaderScript.text);
        this.gl.compileShader(fragmentShader);

        if (!this.gl.getShaderParameter(fragmentShader, this.gl.COMPILE_STATUS)) {
            alert("Couldn't compile the fragment shader");
            this.gl.deleteShader(fragmentShader);
            return;
        }

        this.gl.program = this.gl.createProgram();
        this.gl.attachShader(this.gl.program, vertexShader);
        this.gl.attachShader(this.gl.program, fragmentShader);
        this.gl.linkProgram(this.gl.program);

        if (!this.gl.getProgramParameter(this.gl.program, this.gl.LINK_STATUS)) {
            alert("Unable to initialise shaders");
            this.gl.deleteProgram(this.gl.program);
            this.gl.deleteProgram(vertexShader);
            this.gl.deleteProgram(fragmentShader);
            return;
        }

        this.gl.useProgram(this.gl.program);
        let vertexPosition = this.gl.getAttribLocation(this.gl.program, "vertexPosition");
        this.gl.enableVertexAttribArray(vertexPosition);
        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
        this.gl.clearDepth(1.0);

        this.gl.enable(this.gl.BLEND);
        this.gl.disable(this.gl.DEPTH_TEST);
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE);

        let vertexBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertexBuffer);

        this.setup();

        this.gl.bufferData(this.gl.ARRAY_BUFFER, this.vertices, this.gl.DYNAMIC_DRAW);

        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        let fieldOfView = 30.0;
        let aspectRatio = this.canvas.width / this.canvas.height;
        let nearPlane = 1.0;
        let farPlane = 10000.0;
        let top = nearPlane * Math.tan(fieldOfView * Math.PI / 360.0);
        let bottom = -top;
        let right = top * aspectRatio;
        let left = -right;

        let a = (right + left) / (right - left);
        let b = (top + bottom) / (top - bottom);
        let c = (farPlane + nearPlane) / (farPlane - nearPlane);
        let d = (2 * farPlane * nearPlane) / (farPlane - nearPlane);
        let x = (2 * nearPlane) / (right - left);
        let y = (2 * nearPlane) / (top - bottom);

        this.perspectiveMatrix = [
            x, 0, a, 0,
            0, y, b, 0,
            0, 0, c, d,
            0, 0, -1, 0
        ];

        let modelViewMatrix = [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ];

        let vertexPosAttribLocation = this.gl.getAttribLocation(this.gl.program, "vertexPosition");
        this.gl.vertexAttribPointer(vertexPosAttribLocation, 3.0, this.gl.FLOAT, false, 0, 0);
        let uModelViewMatrix = this.gl.getUniformLocation(this.gl.program, "modelViewMatrix");
        let uPerspectiveMatrix = this.gl.getUniformLocation(this.gl.program, "perspectiveMatrix");
        this.gl.uniformMatrix4fv(uModelViewMatrix, false, new Float32Array(this.perspectiveMatrix));
        this.gl.uniformMatrix4fv(uPerspectiveMatrix, false, new Float32Array(modelViewMatrix));

        this.animate();

        this.count = 0;
        this.cn = 0;
    }
    
    animate () {
        this.id = requestAnimationFrame(this.animate.bind(this));
        this.drawScene();
    }

    drawScene () {
        this.draw();
        this.gl.lineWidth(1);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, this.vertices, this.gl.DYNAMIC_DRAW);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        this.gl.drawArrays(this.gl.LINES, 0, this.numLines);
        this.gl.flush();
    }

    setup () {

        this.vertices = [];

        for (let i = 0; i < this.numLines; i++) {
            this.vertices.push(0, 0, 1.83);
            this.vertices.push(0, 0, 1.83);

            let randomPos = this.target[this.drawType][parseInt(this.target[this.drawType].length * Math.random())];
            this.randomTargetXArr.push(randomPos.x);
            this.randomTargetYArr.push(randomPos.y);
        }

        this.vertices = new Float32Array(this.vertices);
        this.randomTargetXArr = new Float32Array(this.randomTargetXArr);
        this.randomTargetYArr = new Float32Array(this.randomTargetYArr);
    }
    
    draw () {
        this.cn += .1;

        let i, n = this.vertices.length, p, bp;
        let px, py;
        let pTheta;
        let rad;
        let num;

        this.coefficient += (this.targetCoefficient - this.coefficient) * .1;

        for (i = 0; i < this.numLines * 2; i += 2) {
            this.count += .3;
            bp = i * 3;

            this.vertices[bp] = this.vertices[bp + 3];
            this.vertices[bp + 1] = this.vertices[bp + 4];

            num = parseInt(i / 2);
            let targetPosX = this.randomTargetXArr[num];
            let targetPosY = this.randomTargetYArr[num];

            px = this.vertices[bp + 3];
            px += (targetPosX - px) * this.coefficient + (Math.random() - .5) * this.coefficient;
            this.vertices[bp + 3] = px;


            py = this.vertices[bp + 4];
            py += (targetPosY - py) * this.coefficient + (Math.random() - .5) * this.coefficient;
            this.vertices[bp + 4] = py;
        }
    }

    change () {
        
        let rotate;
        let transY;

        this.drawType = (this.drawType + 1) % this.imageURLArr.length;
        rotate = 90;
        transY = -15;

        this.coefficient = .3;
        this.randomTargetXArr = [];
        this.randomTargetYArr = [];

        for (let i = 0; i < this.numLines; i++) {
            let randomPos = this.target[this.drawType][parseInt(this.target[this.drawType].length * Math.random())];
            this.randomTargetXArr.push(randomPos.x);
            this.randomTargetYArr.push(randomPos.y);
        }

        this.vertices = new Float32Array(vertices);
        this.randomTargetXArr = new Float32Array(this.randomTargetXArr);
        this.randomTargetYArr = new Float32Array(this.randomTargetYArr);
    }
}