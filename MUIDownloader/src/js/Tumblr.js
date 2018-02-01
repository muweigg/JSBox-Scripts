function analysisTumblrVideoByLink () {
    $ui.loading(true);
    $ui.toast(`解析地址中，请耐心等待`);

    function parseHTML () {
        let data = {
            poster: '',
            title: '',
            url: '',
            type: 'mp4',
            play: false,
            download: [],
        }
        const img = document.querySelector('#videoContainer img');
        const atags = document.querySelectorAll('#videoDownload a');
        for (let i = 0; i < atags.length; i++ ) {
            let a = atags[i];
            if (/tumblr.*?video_file/.test(a.href)) {
                const url = a.href;
                const title = url.match(/.*\/(.*?)$/)[1];
                
                data.download.push({
                    title: title,
                    url: url,
                    type: 'mp4',
                    saveName: title + '.mp4'
                });
            }
        }
        if (img.src != '') data.poster = img.src;
        let v = data.download[data.download.length - 1];
        data.url = v.url;
        data.title = v.title;
        $notify('processData', data);
    }

    return new Promise(resolve => {

        rootView.add({
            type: "web",
            props: {
                id: 'tumblr_web',
                url: `https://www.tubeoffline.com/downloadFrom.php?host=tumblr&video=${encodeURI(link)}`,
            },
            layout (make) {
                make.size.equalTo($size(0, 0));
            },
            events: {
                didFinish (sender) {
                    $ui.loading(false);
                    $ui.toast('解析完成');
                    sender.eval({ script: convertFunc(parseHTML) });
                },
                processData (data) {
                    resolve(data);
                    $device.taptic(0);
                    $('tumblr_web').remove();
                }
            }
        });
    });
}