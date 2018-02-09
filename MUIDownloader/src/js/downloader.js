/**
 * MUI Downloader
 * @author MUI <muweigg@gmail.com>
 * @description YouTube & Tumblr & Twitter & Facebook & Vimeo & Vine & Aol & Dailymotion 视频下载器
 */

let version = '2.6.6', link = '', keyword = '', rootView = '', rootWeb = '', platform = '';

link = $detector.link($context.text).map(link => {
    if (/youtu(\.?be)?|tumblr|twitter|facebook|vimeo|vine|aol|dailymotion|youku|mgtv/i.test(link))
        return link;
});

link = link.length > 0 ? link[0] : $context.link ? $context.link : $clipboard.link;

if (!link) {
    $ui.alert({
        title: '提示',
        message: '剪切板未获取到任何链接',
    });
    return;
}

function checkSupport() {
    const regex = new RegExp('https?:\/\/.*?(youtu(\.?be)?|tumblr|twitter|facebook|vimeo|vine|aol|dailymotion).*?\/', 'i');
    let support = false;

    if (regex.test(link)) support = true;

    if (support) platform = link.match(regex)[1].replace('.', '').toLocaleLowerCase();

    return support;
}

function convertFunc (func) {
    return func.toString().replace(/^.*?\{|\}$/g, '');
}

function initUI () {

    $ui.render({
        props: {
            title: `MUI Downloader ${version}`
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

async function ready() {

    rootWeb.eval({ script: `vm.link = '${link}'; vm.platform = '${platform}';` });

    const analysis = {
        youtube: analysisYouTubeVideoByLink,
        tumblr: analysisTumblrVideoByLink,
        twitter: analysisTwitterVideoByLink,
        facebook: analysisFacebookVideoByLink,
        vimeo: analysisVimeoVideoByLink,
        vine: analysisVineVideoByLink,
        aol: analysisAolVideoByLink,
        dailymotion: analysisDailymotionVideoByLink,
    };

    let video = await analysis[platform]();

    rootWeb.eval({ script: `vm.video = ${JSON.stringify(video)};` });
    
}

if (!checkSupport()) {
    $ui.alert({
        title: "暂不支持",
        message: "目前只支持：YouTube & Tumblr & Twitter & Facebook & Vimeo & Vine & Aol & Dailymotion",
    });
    return;
}

initUI();