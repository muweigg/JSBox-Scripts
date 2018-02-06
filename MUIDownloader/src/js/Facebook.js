async function analysisFacebookVideoByLink () {
    const HOST = 'https://www.klickvid.com/download.php';

    $ui.loading(true);
    $ui.toast(`解析地址`);

    return new Promise(resolve => {
        $http.get({
            url: `${HOST}?url=${encodeURI(link)}`,
            handler: function(resp) {
                try {
                    const data = resp.data;
                    let best, hd, sd, url = '', download = [];
                    const title = data.match(/<div.*?row.*?>[\s\S]*?<h5.*?>(.*?)<\/h5>/)[1];
                    const poster = data.match(/<div.*?embed-responsive.*?>[\s\S]*?<img.*?src=('|")(.*?)('|").*>/)[2];
                    best = data.match(/<a.*href=('|")(https?.*?)('|").*?>.*?in best.*?<\/a>/i);
                    sd = data.match(/<a.*href=('|")(https?.*?)('|").*?>.*?in low.*?<\/a>/i);
                    hd = data.match(/<a.*href=('|")(https?.*?)('|").*?>.*?in hd.*?<\/a>/i);

                    best = best && best.length > 1 ? best[2] : null;
                    sd = sd && sd.length > 1 ? sd[2] : null;
                    hd = hd && hd.length > 1 ? hd[2] : null;

                    if (best) {
                        url = best;
                        download.push({
                            title: title,
                            url: best,
                            type: 'mp4',
                            quality: 'BEST',
                            saveName: title + 'best.mp4'
                        });
                    } else {
                        if (sd) {
                            url = sd;
                            download.push({
                                title: title,
                                url: sd,
                                type: 'mp4',
                                quality: 'SD',
                                saveName: title + 'sd.mp4'
                            });
                        }
                        if (hd) {
                            url = hd;
                            download.push({
                                title: title,
                                url: hd,
                                type: 'mp4',
                                quality: 'HD',
                                saveName: title + 'hd.mp4'
                            });
                        }
                    }

                    const video = {
                        title: title,
                        poster: poster,
                        url: url,
                        type: 'mp4',
                        playing: false,
                        download: download
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
                        message: "无法获取视频信息",
                    });
                }
            }
        })
    });
}