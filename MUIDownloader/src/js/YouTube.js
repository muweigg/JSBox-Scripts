async function analysisYouTubeVideoByLink () {
    const parseHost = 'https://api.youtubemultidownloader.com/video',
        VADict = {
            46: {
                wh: '1920 x 1080',
                format: '1080p',
                ext: 'webm',
            },
            45: {
                wh: '1280 x 720',
                format: '720p',
                ext: 'webm',
            },
            44: {
                wh: '854 x 480',
                format: '480p',
                ext: 'webm',
            },
            43: {
                wh: '640 x 360',
                format: '360p',
                ext: 'webm',
            },
            38: {
                wh: '4096 x 3072',
                format: '3072p',
                ext: 'mp4',
            },
            37: {
                wh: '1920 x 1080',
                format: '1080p',
                ext: 'mp4',
            },
            36: {
                wh: '320 x 240',
                format: '240p',
                ext: '3gp',
            },
            22: {
                wh: '1280 x 720',
                format: '720p',
                ext: 'mp4',
            },
            18: {
                wh: '640 x 360',
                format: '360p',
                ext: 'mp4',
            },
            17: {
                wh: '176 x 144',
                format: '144p',
                ext: '3gp',
            },
        },
        VDict = {
            313: {
                wh: '1920 x 1080',
                format: '1080p',
                ext: 'webm',
            },
            303: {
                wh: '1920 x 1080',
                format: '1080p60fps',
                ext: 'webm',
            },
            302: {
                wh: '1280 x 720',
                format: '720p60fps',
                ext: 'webm',
            },
            278: {
                wh: '256 x 144',
                format: '144p',
                ext: 'webm',
            },
            272: {
                wh: '3840 x 2160',
                format: '2160p',
                ext: 'webm',
            },
            271: {
                wh: '2560 x 1440',
                format: '1440p',
                ext: 'webm',
            },
            248: {
                wh: '1920 x 1080',
                format: '1080p',
                ext: 'webm',
            },
            247: {
                wh: '1280 x 720',
                format: '720p',
                ext: 'webm',
            },
            246: {
                wh: '640 x 480',
                format: '480p',
                ext: 'webm',
            },
            245: {
                wh: '640 x 480',
                format: '480p',
                ext: 'webm',
            },
            244: {
                wh: '640 x 480',
                format: '480p',
                ext: 'webm',
            },
            243: {
                wh: '480 x 360',
                format: '360p',
                ext: 'webm',
            },
            242: {
                wh: '320 x 240',
                format: '240p',
                ext: 'webm',
            },
            160: {
                wh: '256 x 144',
                format: '144p',
                ext: 'mp4',
            },
            137: {
                wh: '1920 x 1080',
                format: '1080p',
                ext: 'mp4',
            },
            136: {
                wh: '1280 x 720',
                format: '720p',
                ext: 'mp4',
            },
            135: {
                wh: '640 x 480',
                format: '480p',
                ext: 'mp4',
            },
            134: {
                wh: '480 x 360',
                format: '360p',
                ext: 'mp4',
            },
            133: {
                wh: '320 x 240',
                format: '240p',
                ext: 'mp4',
            },
        },
        ADict = {
            251: {
                wh: '',
                format: '48.0 KHz 160 Kbps',
                ext: 'webm',
            },
            250: {
                wh: '',
                format: '48.0 KHz 70 Kbps',
                ext: 'webm',
            },
            249: {
                wh: '',
                format: '48.0 KHz 50 Kbps',
                ext: 'webm',
            },
            172: {
                wh: '',
                format: '44.1 KHz 256 Kbps',
                ext: 'webm',
            },
            171: {
                wh: '',
                format: '44.1 KHz 128 Kbps',
                ext: 'webm',
            },
            141: {
                wh: '',
                format: '44.1 KHz 256 Kbps',
                ext: 'm4a',
            },
            140: {
                wh: '',
                format: '44.1 KHz 128 Kbps',
                ext: 'm4a',
            },
            139: {
                wh: '',
                format: '44.1 KHz 48 Kbps',
                ext: 'm4a',
            },
        },
        V3DDict = {
            102: {
                wh: '1280 x 720',
                format: '720p',
                ext: 'webm',
            },
            101: {
                wh: '640 x 480',
                format: '480p',
                ext: 'webm',
            },
            100: {
                wh: '480 x 360',
                format: '360p',
                ext: 'webm',
            },
            85: {
                wh: '1920 x 1080',
                format: '1080p',
                ext: 'mp4',
            },
            84: {
                wh: '1280 x 720',
                format: '720p',
                ext: 'mp4',
            },
            83: {
                wh: '640 x 480',
                format: '480p',
                ext: 'mp4',
            },
            82: {
                wh: '480 x 360',
                format: '360p',
                ext: 'mp4',
            },
        };

    let id = link.match(/(v=|\/.*?be\/)(.*?)(&|$)/)[2];

    $ui.loading(true);
    $ui.toast(`解析地址`);

    function sortBy (attr, rev = true) {
        let r = rev ? -1 : 1;
        return function(a, b) {
            a = parseInt(a[attr]);
            b = parseInt(b[attr]);
            // if(a < b) return r * -1;
            // if(a > b) return r * 1;
            return (a - b) * r;
        }
    }

    return new Promise(resolve => {
        $http.get({
            url: `${parseHost}?id=${id}`,
            timeout: 30,
            handler: async (resp) => {
                try {
                    const data = resp.data;

                    if (!data.status) {
                        $ui.alert({
                            title: "解析失败",
                            message: "无法解析正在直播的视频或者视频包含保护内容",
                        });
                    }

                    const result = data.result, VAs = [], Vs = [], As = [], V3Ds = [];

                    for (let key in result) {
                        if (VADict[key]) {
                            let f = VADict[key];
                            VAs.push({
                                title: data.title,
                                quality: f.format,
                                type: f.ext,
                                url: result[key],
                                saveName: `${data.title}-${f.format}.${f.ext}`
                            });
                        }

                        if (VDict[key]) {
                            let f = VDict[key];
                            Vs.push({
                                title: data.title,
                                quality: f.format,
                                type: f.ext,
                                url: result[key],
                                saveName: `${data.title}-${f.format}.${f.ext}`
                            });
                        }

                        if (ADict[key]) {
                            let f = ADict[key];
                            As.push({
                                title: data.title,
                                quality: f.format,
                                type: f.ext,
                                url: result[key],
                                saveName: `${data.title}-${f.format}.${f.ext}`
                            });
                        }

                        if (V3DDict[key]) {
                            let f = V3DDict[key];
                            V3Ds.push({
                                title: data.title,
                                quality: f.format,
                                type: f.ext,
                                url: result[key],
                                saveName: `${data.title}-${f.format}.${f.ext}`
                            });
                        }
                    }

                    VAs.sort(sortBy('quality'));
                    Vs.sort(sortBy('quality'));
                    V3Ds.sort(sortBy('quality'));

                    let video = {
                        title: data.title,
                        poster: `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
                        url: VAs[0].url,
                        type: VAs[0].type,
                        playing: false,
                        sections: [
                            {
                                title: 'Video + Audio:',
                                download: VAs
                            }
                        ]
                    };

                    if (Vs.length > 0) {
                        video.sections.push({
                            title: 'Only Video:',
                            download: Vs
                        });
                    }

                    if (As.length > 0) {
                        video.sections.push({
                            title: 'Only Audio:',
                            download: As.sort().reverse()
                        });
                    }

                    if (V3Ds.length > 0) {
                        video.sections.push({
                            title: '3D:',
                            download: V3Ds
                        });
                    }

                    resolve(video);
                    $device.taptic(0);
                    $ui.loading(false);
                    $ui.toast('解析完成');
                } catch (e) {
                    $device.taptic(0);
                    $ui.loading(false);
                    $ui.alert({
                        title: "解析失败",
                        message: "无法获取视频信息",
                    });
                }
            }
        })
    });
}
