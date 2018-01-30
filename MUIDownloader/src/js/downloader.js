/**
 * MUI Downloader
 * @author MUI <muweigg@gmail.com>
 * @description YouTube & Tumblr 视频下载器
 */

let link = '', rootView = '', rootWeb = '';

link = $detector.link($context.text).map(link => {
    if (/youtu(\.?be)?|tumblr/.test(link))
        return link;
});

link = link.length > 0 ? link[0] : $context.link ? $context.link : $clipboard.link;

// if (!link) return;

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
                        $console.info(JSON.stringify(data, null,2 ));
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

function ready() {
    $console.info('ready');
    rootWeb.eval({ script: `vm.link = '${link}';` });

    const video = {
        poster: 'http://i0.hdslb.com/bfs/archive/d00c2fc8666d03abb29eee5bdb43bedd4942e4d8.jpg',
        src: 'http://download.blender.org/peach/bigbuckbunny_movies/BigBuckBunny_320x180.mp4'
    };

    $delay(2, function() {
        rootWeb.eval({ script: `updateVideo(${JSON.stringify(video)})` });
    });
}

initUI();