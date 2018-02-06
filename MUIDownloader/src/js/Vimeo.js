
async function analysisVimeoVideoByLink () {
    const HOST = 'https://www.saveitoffline.com/process/?type=json&url=';

    $ui.loading(true);
    $ui.toast(`解析地址`);

    return new Promise(resolve => {
        $http.get({
            url: `${HOST}${link}`,
            handler: function(resp) {
                try {
                    const data = resp.data;
                    const download = data.urls.map(v => {
                        let label = v.label.split('-');
                        v.title = data.title;
                        v.url = v.id;
                        v.quality = label[0].replace(' ', '');
                        v.type = label[1].replace(' ', '');
                        v.saveName = v.title + v.type;
                        return v;
                    });

                    const video = {
                        poster: data.thumbnail,
                        title: data.title,
                        url: download[0].url,
                        type: download[0].type,
                        playing: false,
                        download: download
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