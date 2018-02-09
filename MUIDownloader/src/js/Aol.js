async function analysisAolVideoByLink () {
    const HOST = 'https://www.1010diy.com';

    $ui.loading(true);
    $ui.toast(`解析地址`);

    return new Promise(resolve => {
        $http.get({
            url: `${HOST}/free-mp3-finder/detail?url=${encodeURI(link)}&_=${Date.now()}`,
            timeout: 30,
            handler: async (resp) => {
                try {
                    const result = resp.data.result;

                    const download = result.videos.reverse().map(v => {
                        v.title = result.data.title;
                        v.quality = `${v.height}p`;
                        v.type = v.ext;
                        v.saveName = `${v.title}-${v.quality}.${v.type}`;
                        return v;
                    });

                    const video = {
                        poster: result.data.thumbnail,
                        title: result.data.title,
                        url: download[0].url,
                        type: download[0].type,
                        playing: false,
                        sections: [
                            {
                                title: 'Video + Audio:',
                                download: download
                            }
                        ]
                    }

                    if (result.audios.length > 0) {
                        const audios = result.audios.map(a => {
                            a.title = result.data.title;
                            a.quality = a.formatNote;
                            a.type = a.ext;
                            a.url = `${HOST}${a.url}`;
                            a.saveName = `${a.title}-${a.quality}.${a.type}`;
                            return a;
                        });

                        video.sections.push({
                            title: 'Audio:',
                            download: audios
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
