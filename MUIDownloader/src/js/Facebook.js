async function analysisFacebookVideoByLink () {

    $ui.loading(true);
    $ui.toast(`解析地址`);

    return new Promise(resolve => {
        $http.get({
            url: link,
            handler: function(resp) {
                try {
                    const data = resp.data;
                    let hd, sd, url = '', download = [];
                    const title = data.match(/<title.*?id="pageTitle">(.*)<\/title>/)[1];
                    const poster = data.match(/<meta.*?property="og:image".*?content="(https:\/\/scontent.*?)".*?\/>/)[1].replace(/&amp;/g, '&');
                    sd = data.match(/sd_src:.*?"(.*?)"/)[1];
                    hd = data.match(/hd_src:.*?"(.*?)"/)[1];

                    if (sd) {
                        url = sd;
                        download.push({
                            title: title,
                            quality: 'SD',
                            type: 'mp4',
                            url: sd,
                            saveName: `${title}-SD.mp4`
                        });
                    }

                    if (hd) {
                        url = hd;
                        download.splice(0, 0, {
                            title: title,
                            quality: 'HD',
                            type: 'mp4',
                            url: hd,
                            saveName: `${title}-SD.mp4`
                        });
                    }

                    const video = {
                        title: title,
                        poster: poster,
                        url: url,
                        type: 'mp4',
                        playing: false,
                        sections: [
                            {
                                title: 'Video + Audio:',
                                download: download
                            }
                        ]
                    };
                    
                    resolve(video);
                    $device.taptic(0);
                    $ui.loading(false);
                    $ui.toast('解析完成');
                } catch (e) {
                    $device.taptic(0);
                    $ui.loading(false);
                    $ui.alert({
                        title: "解析失败",
                        message: "私有视频暂不支持及非法地址无法获取视频信息",
                    });
                }
            }
        })
    });
}