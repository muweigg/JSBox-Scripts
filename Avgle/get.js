const url = encodeURI("https://avgle.com/video/99689/cmi-120-ゲスの極み映像-人妻25人目");
let kode = '';

function decode (code) {
    const c = code.split(' ');

    for (let i = 0; i < c.length; i++){
        kode += String.fromCharCode(parseInt(c[i]) - 3);
    }

    kode = kode;

    try {
        while (kode.indexOf("getElementById('K_ID')" === -1)) kode = eval(kode);
    } catch (e) { }

    kode = kode.match(/<source.*?>/)[0].match(/".*?"/g).map(v => {
        if (!/video-info/.test(v))
            return v.replace(/\\?"/g, '');
    });

    return { hash: kode[1], ts: kode[2], vid: kode[3] };
}

$http.get({
    url: url,
    handler: function(resp) {
        const data = resp.data;
        const script = data.match(/<script\s*?id=.*?>[\s\S]*?<\/script>/)[0],
            code = script.match(/\\"([\d\s])*?\\"/)[0].match(/\\"(.*?)\\"/)[1];
        let videoInfo = decode(code);
        $ui.alert({
            title: '参数',
            message: JSON.stringify(videoInfo, null, 2),
        })
    }
});