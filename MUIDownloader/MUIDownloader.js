const link = $clipboard.link,
    host = 'http://www.clipconverter.cc',
    versionCheckUrl = 'https://raw.githubusercontent.com/muweigg/JSBox-Scripts/master/MUIDownloader/README.md';
let version = '1.0.0', data = null;

if (!link) return;

function getVideoView (data) {
    return {
        type: 'view',
        props: {},
        layout: $layout.fill,
        views: [
            {
                type: "video",
                props: {
                    id: 'previewVideo',
                    src: data.url[3].url,
                    poster: data.thumb
                },
                layout: function(make, view) {
                    const h = Math.floor(($device.info.screen.width - 20) * 9 / 16);
                    make.top.equalTo(-3);
                    make.left.right.equalTo(0).inset(7);
                    make.height.equalTo(h);
                }
            },
            {
                type: 'label',
                props: {
                    id: 'videoFilename',
                    text: data.filename,
                },
                layout (make) {
                    make.top.equalTo($('previewVideo').bottom);
                    make.right.left.equalTo(0).inset(10);
                    make.height.equalTo(30);
                },
            },
            {
                type: 'button',
                props: {
                    title: '下载',
                },
                layout (make) {
                    make.top.equalTo($('videoFilename').bottom);
                    make.right.left.equalTo(0).inset(10);
                    make.height.equalTo(50);
                },
                events: {
                    tapped: function(sender) {
                        $ui.alert({
                            title: "提示",
                            message: "下载",
                        })
                    }
                }
            }
        ]
    }
}

function reCAPTCHA() {
    $ui.alert('需要完成人机验证\n验证完成后\n点击 continue 重试即可');
    return {
        type: 'view',
        views:[{
            type: 'web',
            props: {
                url: `${host}${data.redirect}`
            },
            layout: $layout.fill
        }]
    };
}

function checkUpdate () {
    $http.get({
        url: versionCheckUrl,
        handler: function(resp) {
            if (version == resp.data) return;
            $console.info('更新脚本');
            $ui.alert({
                title: "更新提示",
                message: `发现新版本: ${resp.data}\n当前版本: ${version}\n是否更新 ?`,
                actions: [{
                    title: '取消',
                }, {
                    title: '更新',
                    handler () {
                        $ui.toast('正在更新');
                    }
                }]
            })
        }
    });
}

$ui.render({
    props: {
        title: 'MUI Downloader'
    },
    views: [
        {
            type: 'label',
            props: {
                text: link,
            },
            layout (make) {
                make.top.equalTo(0);
                make.right.left.equalTo(0).inset(10);
                make.height.equalTo(30);
            },
        },
        {
            type: 'view',
            props: {
                // bgcolor: $color("#ff0000")
            },
            layout (make) {
                make.top.equalTo($('label').bottom);
                make.left.right.bottom.equalTo(0);
            }
        }
    ]
})

function analysisVideoByLink() {
    $ui.loading(true);
    $http.post({
        url: `${host}/check.php`,
        form: { mediaurl: link },
        handler: function(resp) {
            data = resp.data;
            if (data && data['redirect']) {
                $ui.push(reCAPTCHA());
            } else {
                $('view').add(getVideoView(data));
            }
            $ui.loading(false);
            $device.taptic(0);
        }
    })
}

checkUpdate();
analysisVideoByLink();