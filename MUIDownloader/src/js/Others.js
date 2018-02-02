async function analysisOthersVideoByLink () {
    const HOST = 'https://www.online-downloader.com/DL/dd.php';

    $ui.loading(true);
    $ui.toast(`解析地址`);

    return new Promise(resolve => {
        $http.get({
            url: `${HOST}?videourl=${encodeURI(link)}`,
            handler: function(resp) {
                const data = eval(resp.data);

                if (data.Video_DownloadURL && data.Video_Title && data.Video_FileName)
                    $ui.toast(`视频解析失败，广告视频无法解析`);

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
                        const Format_Note = data[`Video_${i}_Format_Note`];
                        const Url = data[`Video_${i}_Url`];
                        const Ext = data[`Video_${i}_Ext`];
                        const quality = Format_Note ? Format_Note : WH;

                        if (/\.m3u8$/.test(Url) || WH === 'audio') continue;

                        video.download.push({
                            title: data.Video_Title,
                            url: Url,
                            quality: quality,
                            type: Ext,
                            saveName: `${data.Video_Title}-${quality}.${Ext}`
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