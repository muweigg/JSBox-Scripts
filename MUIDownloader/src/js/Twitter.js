
async function analysisTwitterVideoByLink () {

    $ui.loading(true);
    $ui.toast(`解析地址`);

    function parseHTML () {
        function mui () {
            $.post('/get/', {
                url: '{{link}}'
            }).then(data => $notify('processData', data));
        }
        mui();
    }

    return new Promise(resolve => {
        rootView.add({
            type: "web",
            props: {
                id: 'twitter_web',
                url: `http://savevideo.me`,
            },
            layout (make) {
                make.size.equalTo($size(0, 0));
            },
            events: {
                didFinish (sender) {
                    sender.eval({ script: convertFunc(parseHTML).replace('{{link}}', link) });
                },
                processData (data) {
                    try {
                        let download = [], poster = '', title, v;
                        const r = /href="(https?.*?)"/ig;
    
                        poster = data.match(/thumbnails.*?<img.*?src="(.*?)"/)[1];
                        title = data.match(/title="(.*?)"/)[1];
                        
                        v = r.exec(data);
                        while (v) {
                            const type = v[1].substr(v[1].lastIndexOf('.') + 1);
                            let quality = v[1].match(/\/(\d+x\d+)\//);
    
                            if (/^com/i.test(type)) {
                                v = r.exec(data);
                                continue;
                            }
                            
                            let tmp = {
                                title: title,
                                url: v[1],
                                quality: '',
                                type: type,
                                saveName: `${title}.${type}`
                            };
    
                            if (quality && quality.length > 1)
                                tmp.quality = quality[1];
                            
                            download.push(tmp);
    
                            v = r.exec(data);
                        }
    
                        let video = {
                            poster: poster,
                            title: title,
                            url: download[0].url,
                            type: download[0].type,
                            playing: false,
                            download: download
                        };
    
                        resolve(video);
                        $device.taptic(0);
                        $ui.loading(false);
                        $ui.toast('解析完成');
                        $('twitter_web').remove();
                    } catch (e) {
                        $device.taptic(0);
                        $ui.loading(false);
                        $ui.alert({
                            title: "解析失败",
                            message: "无法获取视频信息",
                        });
                    }
                }
            }
        });
    });
}