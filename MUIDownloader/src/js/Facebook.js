async function analysisFacebookVideoByLink () {

    $ui.loading(true);
    $ui.toast(`解析地址`);

    return new Promise(resolve => {
        $http.get({
            url: link,
            handler: function(resp) {
                try {
                    const data = resp.data;
                    const title = data.match(/<title.*?>([\s\S]*?)<\/title>/)[1];
                    const poster = data.match(/<code.*?<img.*?src="(.*?)".*?>/)[1];
                    const sd = data.match(/sd_src:"(.*?)"/)[1];
                    const hd = data.match(/hd_src:"(.*?)"/)[1];

                    const video = {
                        title: title,
                        poster: poster,
                        url: hd,
                        type: 'mp4',
                        play: false,
                        download: [{
                            title: title,
                            url: hd,
                            type: 'mp4',
                            quality: 'HD',
                            saveName: title + 'hd.mp4'
                        }, {
                            title: title,
                            url: sd,
                            type: 'mp4',
                            quality: 'SD',
                            saveName: title + 'sd.mp4'
                        }]
                    };
                    
                    resolve(video);
                    $ui.loading(false);
                    $device.taptic(0);
                } catch (e) {
                    $ui.alert({
                        title: "解析失败",
                        message: "无法获取视频信息",
                    });
                }
            }
        })
    });
}