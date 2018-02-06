
async function analysisVimeoVideoByLink () {
    const HOST = 'http://www.saveitoffline.com/';

    const params = {
        input: encodeURIComponent(link),
        inputEncode: 1,
        sessionKey: '',
        meta: 1,
        mediaPassword: ''
    };

    $ui.loading(true);
    $ui.toast(`解析地址`);

    async function getSessionKey () {
        return new Promise(resolve => {
            $http.get({
                url: HOST,
                handler: function(resp) {
                    const data = resp.data;
                    resolve(encodeURIComponent(data.match(/bolt.*?value="(.*?)"/)[1]));
                }
            });
        });
    }

    params.sessionKey = await getSessionKey();

    return new Promise(resolve => {
        $http.post({
            url: `${HOST}/request.php`,
            form: params,
            handler: function(resp) {
                try {
                    const data = resp.data;
                    const download = data.urls.map(v => {
                        let label = v.label.split('-');
                        v.title = data.title;
                        v.url = `${HOST}${v.id}`;
                        v.quality = label[0].replace(' ', '');
                        v.type = label[2].replace(' ', '');
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