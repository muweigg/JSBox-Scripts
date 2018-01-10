const link = $clipboard.link,
    parseHost = 'http://youtube1080.megavn.net',
    checkVersionUrl = 'https://raw.githubusercontent.com/muweigg/JSBox-Scripts/master/MUIDownloader/README.md',
    updateURL = 'jsbox://install?url=https://raw.githubusercontent.com/muweigg/JSBox-Scripts/master/MUIDownloader/MUIDownloader.js&icon=icon_035.png&name=MUIDownload',
    colors = {
        bgc: $color('#eee'),
        labelBgc: $color('#757575'),
        labelColor: $color('#fff')
    };
let version = '1.0.0', urlexec = '', keyword = '', data = null;

if (!link) return;

keyword = link.match(/.*\/.*v=(.*?)$|.*\/(.*?)$/);
keyword = keyword[1] || keyword[2];

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
                    make.top.left.right.bottom.equalTo(0).inset(10);
                    make.height.equalTo(308);
                },
                views: [
                    {
                        type: "video",
                        props: {
                            id: 'previewVideo',
                            src: data.previewVideo.url,
                            poster: data.thumb[data.thumb.length - 1],
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
                            text: data.info.title,
                        },
                        layout (make) {
                            make.top.equalTo($('previewVideo').bottom);
                            make.right.left.equalTo(0).inset(10);
                            make.height.equalTo(30);
                        },
                    },
                    {
                        type: 'list',
                        props: {
                            template: [
                                {
                                    type: 'label',
                                    porps: {},
                                    layout (make, view) {
                                        make.center.equalTo(view.super);
                                    }
                                }
                            ],
                            data: [
                                {
                                    title: "Video + Audio:",
                                    rows: data.download
                                },
                                {
                                    title: "High Quality: (Merge Audio online)",
                                    rows: data.downloadf
                                }
                            ]
                        },
                        layout (make) {
                            make.top.equalTo($('videoFilename').bottom).inset(0);
                            make.right.bottom.left.equalTo(0);
                        },
                        events: {
                            didSelect: function (sender, indexPath, data) {
                                $console.info(data);
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
        url: checkVersionUrl,
        handler (resp) {
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
                        $app.openURL(encodeURI(`${updateURL}`));
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
                bgcolor: colors.bgc
            },
            layout (make) {
                make.top.equalTo($('labelView').bottom);
                make.left.right.bottom.equalTo(0);
            }
        }
    ]
})

function analysisVideoByLink () {
    $ui.loading(true);
    $http.post({
        url: `${parseHost}/ajax.php`,
        form: { curID: keyword, url: link },
        timeout: 30,
        handler: function(resp) {
            $console.info(JSON.stringify(resp, null, 2));
            data = resp.data;
            urlexec = data.urlexec;
            data.previewVideo = data.download.filter(v => {
                v.label = {text: `${v.quality} ${v.type}`};
                return v.type === 'mp4';
            })[0];
            data.downloadf.map(v => v.label = {text: `${v.quality} ${v.type}`});
            $('view').add(getVideoView(data));
            $ui.loading(false);
            $device.taptic(0);
        }
    })
}

checkUpdate();
analysisVideoByLink();