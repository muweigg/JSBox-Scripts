(function () {

    var canvas, gl,
        ratio,
        cw,
        ch,
        colorLoc,
        drawType,
        numLines = 100000;
    var target = [];
    var id;

    var imageURLArr = [
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDE0IDc5LjE1Njc5NywgMjAxNC8wOC8yMC0wOTo1MzowMiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MkZFMjJEMkJDMEIzMTFFNDk3QjVBMTAxREExQ0VDMDQiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MkZFMjJEMkNDMEIzMTFFNDk3QjVBMTAxREExQ0VDMDQiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo4REYzNjRBMEMwODcxMUU0OTdCNUExMDFEQTFDRUMwNCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDoyRkUyMkQyQUMwQjMxMUU0OTdCNUExMDFEQTFDRUMwNCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PlvYb9wAAAAGUExURf///wAAAFXC034AAAA9SURBVHjaYmBgxA8IyQ+YAgYIwKmAgYACBkoVQCUZcDoSoXmAFTDgUMCAAihWQJ4ViIgaAiE50hQwAAQYANtFA0B8Qd5JAAAAAElFTkSuQmCC",
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDE0IDc5LjE1Njc5NywgMjAxNC8wOC8yMC0wOTo1MzowMiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OERGMzY0OUFDMDg3MTFFNDk3QjVBMTAxREExQ0VDMDQiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OERGMzY0OUJDMDg3MTFFNDk3QjVBMTAxREExQ0VDMDQiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo4REYzNjQ5OEMwODcxMUU0OTdCNUExMDFEQTFDRUMwNCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo4REYzNjQ5OUMwODcxMUU0OTdCNUExMDFEQTFDRUMwNCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pl7ZhhsAAAAGUExURQAAAP///6XZn90AAACKSURBVHjatJMLDoAwCEPL/S+txn1oy5wxkRgz6xswYIhpCFzP+SKxL5IVwC3b3wGAOAem7MQrIItGQMQfgZRlfYoJBK/AjrEAWhTyz8Bo1hqwgrYNAmALYBNieYrwebI6QKIkQNutM8nKFrBP31IA0uAPHiTL8CS9wj5yeLpZUd9b7kVIa7sdAgwAD0gC9Rv7/iAAAAAASUVORK5CYII=",
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDE0IDc5LjE1Njc5NywgMjAxNC8wOC8yMC0wOTo1MzowMiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NjJFMTJFMDNDMDg3MTFFNDk3QjVBMTAxREExQ0VDMDQiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NjJFMTJFMDRDMDg3MTFFNDk3QjVBMTAxREExQ0VDMDQiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo2MkUxMkUwMUMwODcxMUU0OTdCNUExMDFEQTFDRUMwNCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo2MkUxMkUwMkMwODcxMUU0OTdCNUExMDFEQTFDRUMwNCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PraO89QAAAAGUExURf///wAAAFXC034AAAB0SURBVHja1JNBDoAwCASH/3/aJjWx20XEeJLQC0wJLAGGRQzPHjNbWQOIB+O28ln8j4Arh/9ThCQvRAVcPcwQCLE2CeFAvAPoAFH1gE+RACrUBrBIIaKjYRVNAYpt2gbIgXyYXUOTqwV8Oa3O8VbISB4CDAD5rgK6RivR9wAAAABJRU5ErkJggg==",
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDE0IDc5LjE1Njc5NywgMjAxNC8wOC8yMC0wOTo1MzowMiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OERGMzY0OTZDMDg3MTFFNDk3QjVBMTAxREExQ0VDMDQiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OERGMzY0OTdDMDg3MTFFNDk3QjVBMTAxREExQ0VDMDQiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo2MkUxMkUwOUMwODcxMUU0OTdCNUExMDFEQTFDRUMwNCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo2MkUxMkUwQUMwODcxMUU0OTdCNUExMDFEQTFDRUMwNCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pvx8F64AAAAGUExURQAAAP///6XZn90AAAB7SURBVHjapJNBEsAgCAOT/3+6lzIGQiu2nER2okIENwHL8QIgogeg4UAUwExA62wSBcptElDqBkQuyrFMgJztAAcARgA/A8iPLcCSsF4q0AlIq9OuA0XXh7UmzuyIuWFuXfMcfMR4Mm2xxDmAAcB/AMGdwujzngOXAAMA5SMDBa3meuoAAAAASUVORK5CYII=",
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDE0IDc5LjE1Njc5NywgMjAxNC8wOC8yMC0wOTo1MzowMiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NjJFMTJFMDdDMDg3MTFFNDk3QjVBMTAxREExQ0VDMDQiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NjJFMTJFMDhDMDg3MTFFNDk3QjVBMTAxREExQ0VDMDQiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo2MkUxMkUwNUMwODcxMUU0OTdCNUExMDFEQTFDRUMwNCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo2MkUxMkUwNkMwODcxMUU0OTdCNUExMDFEQTFDRUMwNCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Plm6FdEAAAAGUExURQAAAP///6XZn90AAAB1SURBVHjatJNJEoAgDAR7/v9pSxFJYYZ4kByZDtlRYWwCGO8ZQLOHJNdv6gRY6A2IyOTPDZADPUREyEMMZNKvErDW+1AAsA9QlaSqJMM0rb78IeyD178Csrr8nAvgtdXGv7VaLr7MLJLDcWpMknhOvx7vIcAAUr4CDsMhPIIAAAAASUVORK5CYII=",
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDE0IDc5LjE1Njc5NywgMjAxNC8wOC8yMC0wOTo1MzowMiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OERGMzY0OUVDMDg3MTFFNDk3QjVBMTAxREExQ0VDMDQiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OERGMzY0OUZDMDg3MTFFNDk3QjVBMTAxREExQ0VDMDQiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo4REYzNjQ5Q0MwODcxMUU0OTdCNUExMDFEQTFDRUMwNCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo4REYzNjQ5REMwODcxMUU0OTdCNUExMDFEQTFDRUMwNCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PtDXafoAAAAGUExURQAAAP///6XZn90AAAB8SURBVHjarJNRDsAgCEPb+196W2KwVZQs2h8jvBC0ABbCHQBFDp+mbAsG4EgPCYD3IkcCzCoBXKqAAsBW58APhT/w3058YEIs7HZAuB7RAlIJShjus0IZgQJg3kMDuGuSAqTPjHlY5onhhfZLsjNibhg8rB4W5pwv7yPAACfoAh3Ikbd/AAAAAElFTkSuQmCC",
    ]
    var snsNameArr = ["Facebook", "Google+", "Instagram", "Pinterest", "Twitter", "GitHub"];

    var perspectiveMatrix;
    var randomTargetXArr = [], randomTargetYArr = [];
    drawType = 0;
    var count = 0;

    window.onload = init();

    function init() {
        var canvas = document.createElement("canvas");
        var ctx = canvas.getContext('2d');

        for (var ii = 0; ii < imageURLArr.length; ii++) {
            var image = new Image();
            image.crossOrigin = "Anonymous";
            image.src = imageURLArr[ii];

            image.onload = onLoadImageHandler.bind(this, image, canvas, ctx, ii);
        }
    };

    function onLoadImageHandler(image, canvas, ctx, number) {
        var size = image.width;
        canvas.width = size;
        canvas.height = size;

        ctx.drawImage(image, 0, 0)
        var imageData = ctx.getImageData(0, 0, size, size);

        var data = imageData.data;
        target[number] = [];

        for (var ii = 0; ii < data.length; ii += 4) {
            if (data[ii] == 0) {
                var pixNumber = ii / 4;
                var xPos = pixNumber % size;
                var yPos = parseInt(pixNumber / size);
                var pos = { x: xPos / size - .5, y: -yPos / size + 0.5 };
                target[number].push(pos);
            }

        }

        count++;

        if (count == imageURLArr.length) loadScene();
    }

    function loadScene() {
        canvas = document.getElementById("c");
        gl = canvas.getContext("experimental-webgl");

        if (!gl) {
            alert("There's no WebGL context available.");
            return;
        }

        cw = window.innerWidth;
        ch = window.innerHeight;
        canvas.width = cw;
        canvas.height = ch;
        gl.viewport(0, 0, canvas.width, canvas.height);

        var vertexShaderScript = document.getElementById("shader-vs");
        var vertexShader = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vertexShader, vertexShaderScript.text);
        gl.compileShader(vertexShader);
        if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
            alert("Couldn't compile the vertex shader");
            gl.deleteShader(vertexShader);
            return;
        }

        var fragmentShaderScript = document.getElementById("shader-fs");
        var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fragmentShader, fragmentShaderScript.text);
        gl.compileShader(fragmentShader);
        if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
            alert("Couldn't compile the fragment shader");
            gl.deleteShader(fragmentShader);
            return;
        }

        gl.program = gl.createProgram();
        gl.attachShader(gl.program, vertexShader);
        gl.attachShader(gl.program, fragmentShader);
        gl.linkProgram(gl.program);
        if (!gl.getProgramParameter(gl.program, gl.LINK_STATUS)) {
            alert("Unable to initialise shaders");
            gl.deleteProgram(gl.program);
            gl.deleteProgram(vertexShader);
            gl.deleteProgram(fragmentShader);
            return;
        }
        gl.useProgram(gl.program);
        var vertexPosition = gl.getAttribLocation(gl.program, "vertexPosition");
        gl.enableVertexAttribArray(vertexPosition);
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clearDepth(1.0);

        gl.enable(gl.BLEND);
        gl.disable(gl.DEPTH_TEST);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

        var vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

        setup();

        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.DYNAMIC_DRAW);

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        var fieldOfView = 30.0;
        var aspectRatio = canvas.width / canvas.height;
        var nearPlane = 1.0;
        var farPlane = 10000.0;
        var top = nearPlane * Math.tan(fieldOfView * Math.PI / 360.0);
        var bottom = -top;
        var right = top * aspectRatio;
        var left = -right;

        var a = (right + left) / (right - left);
        var b = (top + bottom) / (top - bottom);
        var c = (farPlane + nearPlane) / (farPlane - nearPlane);
        var d = (2 * farPlane * nearPlane) / (farPlane - nearPlane);
        var x = (2 * nearPlane) / (right - left);
        var y = (2 * nearPlane) / (top - bottom);
        perspectiveMatrix = [
            x, 0, a, 0,
            0, y, b, 0,
            0, 0, c, d,
            0, 0, -1, 0
        ];

        var modelViewMatrix = [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ];
        var vertexPosAttribLocation = gl.getAttribLocation(gl.program, "vertexPosition");
        gl.vertexAttribPointer(vertexPosAttribLocation, 3.0, gl.FLOAT, false, 0, 0);
        var uModelViewMatrix = gl.getUniformLocation(gl.program, "modelViewMatrix");
        var uPerspectiveMatrix = gl.getUniformLocation(gl.program, "perspectiveMatrix");
        gl.uniformMatrix4fv(uModelViewMatrix, false, new Float32Array(perspectiveMatrix));
        gl.uniformMatrix4fv(uPerspectiveMatrix, false, new Float32Array(modelViewMatrix));
        animate();
    }
    var count = 0;
    var cn = 0;

    function animate() {

        id = requestAnimationFrame(animate);
        drawScene();
    }


    function drawScene() {
        draw();

        gl.lineWidth(1);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.DYNAMIC_DRAW);

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        gl.drawArrays(gl.LINES, 0, numLines);

        gl.flush();
    }

    var coefficient = .4;
    var targetCoefficient = .01;

    var vertices,
        velocities,
        freqArr,
        thetaArr,
        velThetaArr,
        velRadArr,
        boldRateArr;

    function setup() {

        vertices = [];

        for (var ii = 0; ii < numLines; ii++) {
            vertices.push(0, 0, 1.83);
            vertices.push(0, 0, 1.83);

            var randomPos = target[drawType][parseInt(target[drawType].length * Math.random())];
            randomTargetXArr.push(randomPos.x);
            randomTargetYArr.push(randomPos.y);
        }

        vertices = new Float32Array(vertices);
        randomTargetXArr = new Float32Array(randomTargetXArr);
        randomTargetYArr = new Float32Array(randomTargetYArr);

    }

    function draw() {
        cn += .1;

        var i, n = vertices.length, p, bp;
        var px, py;
        var pTheta;
        var rad;
        var num;

        coefficient += (targetCoefficient - coefficient) * .1;


        for (i = 0; i < numLines * 2; i += 2) {
            count += .3;
            bp = i * 3;

            vertices[bp] = vertices[bp + 3];
            vertices[bp + 1] = vertices[bp + 4];

            num = parseInt(i / 2);
            var targetPosX = randomTargetXArr[num];
            var targetPosY = randomTargetYArr[num];

            px = vertices[bp + 3];
            px += (targetPosX - px) * coefficient + (Math.random() - .5) * coefficient;
            vertices[bp + 3] = px;


            py = vertices[bp + 4];
            py += (targetPosY - py) * coefficient + (Math.random() - .5) * coefficient;
            vertices[bp + 4] = py;
        }
    }

    window.addEventListener("touchstart", function (event) {
        var rotate;
        var transY;

        drawType = (drawType + 1) % imageURLArr.length;
        rotate = 90;
        transY = -15;

        coefficient = .3;
        randomTargetXArr = [];
        randomTargetYArr = [];

        for (var ii = 0; ii < numLines; ii++) {
            var randomPos = target[drawType][parseInt(target[drawType].length * Math.random())];
            randomTargetXArr.push(randomPos.x);
            randomTargetYArr.push(randomPos.y);
        }

        vertices = new Float32Array(vertices);
        randomTargetXArr = new Float32Array(randomTargetXArr);
        randomTargetYArr = new Float32Array(randomTargetYArr);
    });

}());