const host = 'https://avgle.com';

let link = $detector.link($context.text);

link = link.length > 0 ? link[0] : $context.link ? $context.link : $clipboard.link;

if (!link) return;

$ui.render({
    props: {
        title: "Avgle Get"
    },
    views: [{
        type: "view",
        props: {
            id: "rootView"
        },
        layout: $layout.fill,
    }]
});

async function getInfo () {

    return new Promise(resolve => {
        $('rootView').add({
            type: 'web',
            props: {
                id: 'avgle_web',
                url: link
            },
            // layout: $layout.fill,
            layout (make) {
                make.size.equalTo($size(0, 0));
            },
            events: {
                didFinish (sender) {
                    sender.eval({script: "setInterval(function(){$('.vjs-big-play-button').click();},10);"});
                },
                didSendRequest (request) {
                    if (!/video-url\.php/.test(request.url)) return;
                    let vInfo = {}, params = request.url.match(/\?(.*)/)[1];
                    params = params.split('&');
                    for (let i in params) {
                        let v = params[i].split('=');
                        vInfo[v[0]] = v[1];
                    }
                    resolve(vInfo);
                    $('avgle_web').remove();
                }
            }
        });
    });
}

async function main () {
    let vInfo = await getInfo();
    $http.get({
        url: `${host}/video-url.php?hash=${vInfo.hash}&ts=${vInfo.ts}&vid=${vInfo.vid}`,
        handler: function(resp) {
            const data = resp.data;
            if (data.url) $share.sheet(data.url);
            else $ui.alert('未获取到链接');
        }
    })
}

main();
