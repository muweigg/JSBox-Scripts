/**
 * MUI Downloader
 * @author MUI <muweigg@gmail.com>
 * @description YouTube & Tumblr 视频下载器
 */

let version = '1.1.3', link = '', keyword = '', rootView = '', rootWeb = '';

link = $detector.link($context.text).map(link => {
    if (/youtu(\.?be)?|tumblr/.test(link))
        return link;
});

link = link.length > 0 ? link[0] : $context.link ? $context.link : $clipboard.link;

if (!link) return;

if (!/youtu(\.?be)?|tumblr/.test(link)) {
    $ui.alert({
        title: "暂不支持",
        message: "目前只支持：YouTube & Tumblr",
    });
    return;
}

function convertFunc (func) {
    return func.toString().replace(/^.*?\{|\}?$/g, '');
}

function initUI () {

    $ui.render({
        props: {
            title: "MUI Downloader"
        },
        views: [
            {
                type: "view",
                props: { id: "rootView" },
                layout: $layout.fill
            },
            {
                type: 'web',
                props: {
                    id: "rootWeb",
                    bounces: false,
                    html: decodeURIComponent(`<!-- inject:template --><!-- endinject -->`)
                },
                layout: $layout.fill,
                events: {
                    exec (data) {
                        $console.info("exec");
                        $console.info(JSON.stringify(data, null, 2));
                        const func = eval(`${data.func}`);
                        if (data.params) func(data.params);
                        else func();
                    },
                    debug (data) {
                        $console.info(data);
                    }
                }
            }
        ]
    });

    rootView = $('rootView');
    rootWeb = $('rootWeb');
}

initUI();

async function ready() {
    rootWeb.eval({ script: `vm.link = '${link}';` });
    let video = {};

    if (/youtu(\.?be)?/.test(link))
        video = await analysisYouTubeVideoByLink();

    if (/tumblr/.test(link))
        video = await analysisTumblrVideoByLink();

    rootWeb.eval({ script: `vm.video = ${JSON.stringify(video)};` });

    // const video = {
    //     poster: 'http://i0.hdslb.com/bfs/archive/d00c2fc8666d03abb29eee5bdb43bedd4942e4d8.jpg',
    //     url: 'http://download.blender.org/peach/bigbuckbunny_movies/BigBuckBunny_320x180.mp4',
    //     type: 'mp4',
    //     play: false,
    // };

    // $delay(2, function() {
    //     rootWeb.eval({ script: `vm.video = ${JSON.stringify(video)};` });
    // });
}

function downloadVideo (data) {
    $ui.toast(`开始下载 ${data.type.toLocaleUpperCase()}`);
    $http.download({
        url: data.url,
        handler: function(resp) {
            $device.taptic(0);
            $share.sheet([data.saveName, resp.data]);
        }
    });
}