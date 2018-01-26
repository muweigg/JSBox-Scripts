const host = 'https://avgle.com';

let link = $detector.link($context.text);

link = link.length > 0 ? link[0] : $context.link ? $context.link : $clipboard.link;

if (!link) return;

function decode(code) {
    const c = code.split(' ');
    let kode = '', ohash = '', hash = '', ts = 0, vid = 0;

    for (var i = 0; i < c.length; i++) {
        kode += String.fromCharCode(parseInt(c[i]) - 3);
    }

    try {
        while (kode.indexOf("getElementById('K_ID')") === -1)
            kode = eval(kode);
    } catch (e) { }

    kode = kode.match(/<source.*?>/)[0].match(/".*?"/g)
        .filter(v => !/video-info/.test(v))
        .map(v => v.replace(/\\?"/g, ''));

    // ohash = $text.base64Decode((kode[0]));
    ohash = kode[0];
    ts = kode[1];
    vid = kode[2];

    return { ohash: ohash, ts: ts, vid: vid };
}

async function getHtml() {

    return new Promise(resolve => {

        $http.get({
            url: link,
            handler: function (resp) {
                resolve(resp.data);
            }
        });

    });
}

function getScripts(ohtml) {

    let scripts = [
        ohtml.match(/\/templates.*promise.*?\.js\??.*?"/)[0].replace('"', ''),
        ohtml.match(/\/templates.*runtime.*?\.js\??.*?"/)[0].replace('"', ''),
        ohtml.match(/\/templates.*avgle-main-ah\.js\??.*?"/)[0].replace('"', '')
    ];

    scripts = scripts.map(s => `<script src="${host}${s}"></script>`);
    scripts.splice(0, 0, '<script src="https://cdnjs.cloudflare.com/ajax/libs/videojs-contrib-hls/5.9.0/videojs-contrib-hls.min.js"></script>');
    scripts.splice(0, 0, '<script src="https://cdnjs.cloudflare.com/ajax/libs/video.js/5.20.3/video.min.js"></script>');
    scripts.splice(0, 0, '<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>');

    return scripts;
}

function getHtmlEnv(ohtml) {

    const scripts = getScripts(ohtml);

    const script = ohtml.match(/<script\s*?id=.*?>[\s\S]*?<\/script>/)[0],
        code = script.match(/\\"([\d\s])*?\\"/)[0].match(/\\"(.*?)\\"/)[1];

    const vInfo = decode(code);

    const html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
        </head>
        <body>
            <source id="video-info" data-ohash="${vInfo.ohash}" data-ts="${vInfo.ts}" data-vid="${vInfo.vid}">
            <video id="video-player" src=""></video>
            <script>var removedMessage = '';</script>
            <script>!function(t){function r(i){if(n[i])return n[i].exports;var o=n[i]={exports:{},id:i,loaded:!1};return t[i].call(o.exports,o,o.exports,r),o.loaded=!0,o.exports}var n={};return r.m=t,r.c=n,r.p="",r(0)}([function(t,r){!function(t){t.hookAjax=function(t){function r(t){return function(){return this.hasOwnProperty(t+"_")?this[t+"_"]:this.xhr[t]}}function n(r){return function(n){var i=this.xhr,o=this;return 0!=r.indexOf("on")?void(this[r+"_"]=n):void(t[r]?i[r]=function(){t[r](o)||n.apply(i,arguments)}:i[r]=n)}}function i(r){return function(){var n=[].slice.call(arguments);if(!t[r]||!t[r].call(this,n,this.xhr))return this.xhr[r].apply(this.xhr,n)}}return window._ahrealxhr=window._ahrealxhr||XMLHttpRequest,XMLHttpRequest=function(){this.xhr=new window._ahrealxhr;for(var t in this.xhr){var o="";try{o=typeof this.xhr[t]}catch(t){}"function"===o?this[t]=i(t):Object.defineProperty(this,t,{get:r(t),set:n(t)})}},window._ahrealxhr},t.unHookAjax=function(){window._ahrealxhr&&(XMLHttpRequest=window._ahrealxhr),window._ahrealxhr=void 0}}(window)}]);</script>
            <script>hookAjax({open:function(arg,xhr){if (arg[0] === "GET") {$notify('build', arg[1]);}}});</script>
            ${scripts.join('')}
        </body>
        </html>
    `;

    return html;
}

async function getVideoInfo() {
        
    const ohtml = await getHtml();
    const htmlEnv = getHtmlEnv(ohtml);

    return new Promise(resolve => {

        $ui.render({
            props: {
                title: ""
            },
            views: [{
                type: "web",
                props: {
                    html: htmlEnv
                },
                layout: function (make, view) {
                    make.size.equalTo($size(0, 0));
                },
                events: {
                    didFinish: function(sender, navigation) {
                        sender.eval({
                            script: '$notify("params", document.body.innerHTML)'
                        });
                    },
                    build (data) {
                        let vInfo = {}, params = data.match(/\?(.*)/)[1];
                        params = params.split('&');
                        for (let i in params) {
                            let v = params[i].split('=');
                            vInfo[v[0]] = v[1];
                        }
                        resolve(vInfo);
                    }
                }
            }]
        })
    });

}

async function test() {
    const vInfo = await getVideoInfo();
    $console.info(JSON.stringify(vInfo, null, 2));
    $http.get({
        url: `${host}/video-url.php?hash=${vInfo.hash}&ts=${vInfo.ts}&vid=${vInfo.vid}`,
        handler: function(resp) {
            const data = resp.data
            if (data.url) $share.sheet(data.url);
            else $ui.alert('未获取到链接');
        }
    })
}


test();