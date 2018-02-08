async function analysisYoukuVideoByLink () {
    const HOST = 'https://video-download.co/';

    // $ui.loading(true);
    $ui.toast(`解析地址`);

    function execScript () {
        function mui () {
            !function(t){function r(i){if(n[i])return n[i].exports;var o=n[i]={exports:{},id:i,loaded:!1};return t[i].call(o.exports,o,o.exports,r),o.loaded=!0,o.exports}var n={};return r.m=t,r.c=n,r.p="",r(0)}([function(t,r){!function(t){t.hookAjax=function(t){function r(t){return function(){return this.hasOwnProperty(t+"_")?this[t+"_"]:this.xhr[t]}}function n(r){return function(n){var i=this.xhr,o=this;return 0!=r.indexOf("on")?void(this[r+"_"]=n):void(t[r]?i[r]=function(){t[r](o)||n.apply(i,arguments)}:i[r]=n)}}function i(r){return function(){var n=[].slice.call(arguments);if(!t[r]||!t[r].call(this,n,this.xhr))return this.xhr[r].apply(this.xhr,n)}}return window._ahrealxhr=window._ahrealxhr||XMLHttpRequest,XMLHttpRequest=function(){this.xhr=new window._ahrealxhr;for(var t in this.xhr){var o="";try{o=typeof this.xhr[t]}catch(t){}"function"===o?this[t]=i(t):Object.defineProperty(this,t,{get:r(t),set:n(t)})}},window._ahrealxhr},t.unHookAjax=function(){window._ahrealxhr&&(XMLHttpRequest=window._ahrealxhr),window._ahrealxhr=void 0}}(window)}]);
            hookAjax({onload:function(xhr){if (/create/.test(xhr.responseURL)) $notify('processData', JSON.parse(xhr.responseText)); }});
            $('#playlist').prop('checked', false);
            $('input#link').val('{{link}}');
            var $btn = $('button#submit');
            var clearId = setInterval(function () {
                if ($btn.attr('style')) clearInterval(clearId);
                else $btn.click();
            }, 500);
        }
        mui();
    }

    async function getData () {
        return new Promise(resolve => {
            rootView.add({
                type: "web",
                props: {
                    id: 'youku_web',
                    url: HOST,
                },
                layout: $layout.fill,
                events: {
                    didFinish (sender) {
                        sender.eval({ script: convertFunc(execScript).replace(/{{link}}/, link) });
                    },
                    processData (data) {
                        if (data.captcha) return;
                        resolve(data);
                        $('youku_web').remove();
                    }
                }
            });
        });
    }

    return new Promise(async (resolve) => {
        const data = await getData();
        $console.info(JSON.stringify(data, null, 2));

        const download = data.qualities.map(v => {
            v.title = data.title;
            v.type = v.format;
            v.quality = `${v.note} ${v.size}`;
            v.saveName = `${data.title} - ${v.note}.${v.format}`
            return v;
        });

        const video = {
            poster: data.thumbnail,
            title: data.title,
            url: data.url,
            type: data.originalFormat,
            playing: false,
            download: download.reverse(),
        }

        resolve(video);
    });
}