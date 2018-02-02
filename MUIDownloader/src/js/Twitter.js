async function getTwitterVideodownloaderToken () {
    
    return new Promise(resolve => {
        $http.get({
            url: 'http://twittervideodownloader.com/',
            handler: function(resp) {
                const data = resp.data;
                const token = data.match(/csrfmiddlewaretoken.*value='(.*?)'/)[1].replace(/"|'/g, '');
                resolve(token);
            }
        })
    });
}

async function analysisTwitterVideoByLink () {
    const HOST = 'http://twittervideodownloader.com/download';
    const token = await getTwitterVideodownloaderToken();

    $ui.loading(true);
    $ui.toast(`解析地址`);

    return new Promise(resolve => {
        $http.post({
            url: HOST,
            form: {
                csrfmiddlewaretoken: token,
                tweet: link
            },
            handler: function(resp) {
                const data = resp.data;
                const title = data.match(/<center>[\s\S]*?<p.*?>[\s\S]*?<\/p>[\s\S]*?<b>(.*?)<\/b>/)[1];
                const poster = data.match(/<center>[\s\S]*?<img.*?src="(.*?)".*?\/>/)[1];
                const r = /\s{2}<a.*?href="(.*?)".*?>.*?<\/a>[\s\S]*?<p.*?>(.*?)<\/p>/g;

                let download = [];
                v = r.exec(data);

                while (v) {
                    let tmp = v[2].replace(/\s*/g, '').split(':');
                    download.push({
                        title: title,
                        url: v[1],
                        quality: tmp[0],
                        type: tmp[1],
                        saveName: title + tmp[1]
                    });
                    v = r.exec(data);
                }

                download = download.sort((a, b) => {
                    let l = parseInt(a.quality.replace('x', '')),
                        r = parseInt(b.quality.replace('x', ''));
                    if (l > r) return 1
                    else if (l < r) return -1
                    else if (l == r) return 0;
                }).reverse();

                const video = {
                    poster: poster,
                    title: title,
                    url: download[0].url,
                    type: download[0].type,
                    play: false,
                    download: download
                }

                resolve(video);
                $ui.loading(false);
                $device.taptic(0);
            }
        })
    });
}