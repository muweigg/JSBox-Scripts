async function analysisFacebookVideoByLink () {
    const HOST = 'https://www.online-downloader.com/DL/dd.php';

    $ui.loading(true);
    $ui.toast(`解析地址`);

    return new Promise(resolve => {
        $http.get({
            url: `${HOST}?videourl=${encodeURI(link)}`,
            handler: function(resp) {
                const data = eval(resp.data);

                if (data.Video_DownloadURL && data.Video_Title && data.Video_FileName)
                    $ui.toast(`无法解析视频`);

                const video = {
                        title: data.Video_Title,
                        poster: data.Video_Image,
                        url: data.Video_DownloadURL,
                        type: 'mp4',
                        play: false
                    };
                
                if (data.Video_Format_Count > 0) {
                    video.download = [];

                    for (let i = 1; i <= data.Video_Format_Count; i++) {
                        const WH = data[`Video_${i}_WH`];
                        const Format_ID = data[`Video_${i}_Format_ID`];
                        const Url = data[`Video_${i}_Url`];
                        const Ext = data[`Video_${i}_Ext`];
                        const Acodec = data[`Video_${i}_Acodec`];

                        if (/\.m3u8$/.test(Url) || WH === 'audio' || Acodec === 'none') continue;

                        video.download.push({
                            title: data.Video_Title,
                            url: Url,
                            quality: Format_ID.replace('_', ' ').toLocaleUpperCase(),
                            type: Ext,
                            saveName: `${data.Video_Title}-${Format_ID}.${Ext}`
                        });
                    }
                }

                resolve(video);
                $ui.loading(false);
                $device.taptic(0);
            }
        })
    });
}