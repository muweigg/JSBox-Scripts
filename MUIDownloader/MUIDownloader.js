const link = $clipboard.link,
    parseHost = 'http://www.clipconverter.cc',
    versionCheckUrl = 'https://raw.githubusercontent.com/muweigg/JSBox-Scripts/master/MUIDownloader/README.md',
    updateURL = 'jsbox://install?url=https://raw.githubusercontent.com/muweigg/JSBox-Scripts/master/MUIDownloader/MUIDownloader.js&icon=icon_035.png&name=MUIDownload',
    colors = {
        bgc: $color('#eee'),
        labelBgc: $color('#757575'),
        labelColor: $color('#fff')
    };
let version = '1.0.0', data = null;

if (!link) return;

function getVideoView (data) {
    return {
        type: 'view',
        props: {
            bgcolor: colors.bgc
        },
        layout: $layout.fill,
        views: [
            {
                type: 'view',
                props: {
                    id: 'videoView',
                    bgcolor: $color('#fff'),
                    radius: 5
                },
                layout: function (make) {
                    make.top.left.right.equalTo(0).inset(10);
                    make.height.equalTo(308);
                },
                views: [
                    {
                        type: "video",
                        props: {
                            id: 'previewVideo',
                            src: data.url[3].url,
                            poster: data.thumb,
                            bgcolor: $color('#fff'),
                        },
                        layout: function(make, view) {
                            const h = Math.floor(($device.info.screen.width - 40) * 9 / 16);
                            make.top.equalTo(0).inset(7);
                            make.left.right.inset(7);
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
                url: `${parseHost}${data.redirect}`
            },
            layout: $layout.fill
        }]
    };
}

function checkUpdate () {
    $http.get({
        url: versionCheckUrl,
        handler: function(resp) {
            $console.info(`Version: ${resp.data}`);
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
                        $app.openURL(encodeURI(`${updateURL} ${resp.data}`));
                    }
                }]
            })
        }
    });
}

$ui.render({
    props: {
        title: 'MUI Downloader',
        bgcolor: colors.bgc
    },
    views: [
        {
            type: 'view',
            props: {
                id: 'labelView',
                bgcolor: colors.labelBgc,
                radius: 5
            },
            layout (make) {
                make.top.equalTo(10);
                make.right.left.inset(10);
                make.height.equalTo(50);
            },
            views: [
                {
                    type: 'label',
                    props: {
                        text: link,
                        textColor: colors.labelColor,
                    },
                    layout (make, view) {
                        make.right.left.inset(10);
                        make.centerY.equalTo(view.super);
                    }
                }
            ]
        },
        {
            type: 'view',
            props: {
                bgcolor: $color('#EEEEEE')
            },
            layout (make) {
                make.top.equalTo($('labelView').bottom);
                make.left.right.bottom.equalTo(0);
            }
        }
    ]
})

function analysisVideoByLink() {
    // $ui.loading(true);
    $http.post({
        url: `${parseHost}/check.php`,
        form: { mediaurl: link },
        handler: function(resp) {
            $console.info(JSON.stringify(resp, null, 2));
            data = resp.data;
            if (data && data['redirect']) {
                $ui.push(reCAPTCHA());
            } else {
                $('view').add(getVideoView(data));
            }
            // $ui.loading(false);
            $device.taptic(0);
        }
    })
}

checkUpdate();
analysisVideoByLink();