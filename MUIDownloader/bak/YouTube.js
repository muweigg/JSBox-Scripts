async function analysisYouTubeVideoByLink () {
    const parseHost = 'http://youtube1080.megavn.net';
    let id = '';

    let keyword = link.match(/.*\/.*v=(.*?)(&feature=.*?)?$|.*\/(.*?)(&feature=.*?)?$/);
    id = keyword[1] || keyword[3];
    link = `https://youtu.be/${id}`;

    $ui.loading(true);
    $ui.toast(`解析地址`);

    async function getThumb (thumb) {
        return new Promise(resolve => {
            $http.get({
                url: thumb,
                handler: function(resp) {
                    const response = resp.response;
                    resolve(response.statusCode);
                }
            })
        });
    }

    return new Promise(resolve => {
        $http.post({
            url: `${parseHost}/ajax.php`,
            form: { curID: id, url: link },
            timeout: 30,
            handler: async (resp) => {
                try {
                    let tempData = Object.assign({}, resp.data);
                    tempData.thumb = tempData.thumb.reverse();

                    if (!tempData.download && !tempData.downloadf) {
                        $ui.alert({
                            title: "解析错误",
                            message: "直播不能下载及转换",
                        });
                        $ui.loading(false);
                        return;
                    }

                    let video = Object.assign({}, tempData.download.filter(v => {
                        v.title = tempData.info.title;
                        return v.type === 'mp4';
                    })[0]);

                    for (let i = 0; i < tempData.thumb.length; i++) {
                        let thumb = tempData.thumb[i];
                        let statusCode = await getThumb(thumb);
                        if (statusCode === 404) continue;
                        video.poster = thumb;
                        break;
                    }

                    video.playing = false;

                    video.download = tempData.download.map(v => {
                        v.title = tempData.info.title;
                        v.saveName = `${v.title}-${id}-${v.quality}.${v.type}`;
                        return v;
                    });

                    if (tempData.downloadf instanceof Array) {
                        video.downloadf = tempData.downloadf.map(v => {
                            v.urlexec = tempData.urlexec;
                            v.id = id;
                            v.token = tempData.token;
                            v.title = tempData.info.title;
                            v.saveName = `${v.title}-${id}-${v.quality}.${v.type}`;
                            return v;
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

async function convertYouTubeVideo (v) {
    $ui.loading(true);
    $ui.toast('请求转换服务器，等待转制', 10);
    const params = {
        urlexec: v.urlexec,
        video_id: v.id,
        video_url: link,
        itag: v.itag,
        action: v.quality,
        title: v.title,
        token: v.token,
        email: 'muweigg@gmail.com'
    };
    $http.post({
        url: params.urlexec,
        timeout: 60,
        form: params,
        handler: function(resp) {
            let data = resp.data;
            $delay(1, () => {
                $ui.toast(`开始下载 ${data.ext.toLocaleUpperCase()}`, 5);
                $http.download({
                    url: encodeURI(data.url),
                    handler: function(resp) {
                        $device.taptic(0);
                        $ui.loading(false);
                        $share.sheet([v.saveName, resp.data]);
                    }
                });
            });
        }
    });
}