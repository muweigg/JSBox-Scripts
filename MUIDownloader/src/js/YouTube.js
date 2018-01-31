async function analysisYouTubeVideoByLink () {
    const parseHost = 'http://youtube1080.megavn.net';
    let id = '', data = {};

    let keyword = link.match(/.*\/.*v=(.*?)(&feature=.*?)?$|.*\/(.*?)(&feature=.*?)?$/);
    id = keyword[1] || keyword[3];
    link = `https://youtu.be/${id}`;

    // $ui.loading(true);
    $ui.toast(`解析地址`);

    return new Promise(resolve => {
        $http.post({
            url: `${parseHost}/ajax.php`,
            form: { curID: id, url: link },
            timeout: 30,
            handler (resp) {
                let tempData = Object.assign({}, resp.data);

                if (!tempData.download && !tempData.downloadf) {
                    $ui.alert({
                        title: "解析错误",
                        message: "直播不能下载及转换",
                    });
                    $ui.loading(false);
                    return;
                }

                let video = tempData.download.filter(v => {
                    v.title = tempData.info.title;
                    return v.type === 'mp4';
                })[0];

                video.poster = tempData.thumb[tempData.thumb.length - 1];

                let download = tempData.download.map(v => {
                    v.title = tempData.info.title;
                    return v;
                });

                video.download = download;

                // if (tempData.downloadf instanceof Array) {
                //     video.downloadf = tempData.downloadf.map(v => {
                //         v.urlexec = tempData.urlexec;
                //         v.id = id;
                //         v.token = tempData.token;
                //         v.title = tempData.info.title;
                //     });
                // }

                // delete tempData.download;
                // delete tempData.downloadf;

                $console.info(tempData.download);

                // resolve(tempData);

                $ui.loading(false);
                $device.taptic(0);
            }
        })
    });

}