const url = encodeURI("https://avgle.com/video/99689/cmi-120-ゲスの極み映像-人妻25人目");
// const url = encodeURI('https://avgle.com/video/130158/heyzo-1651');
let kode = '';

function buildHash (key, hash) {
    return key + hash;
}

function decode(code) {
    const c = code.split(' ');
    let ohash = '', hash = '', ts = 0, vid = 0;

    for (var i = 0; i < c.length; i++) {
        kode += String.fromCharCode(parseInt(c[i]) - 3);
    }

    kode = kode;

    try {
        while (kode.indexOf("getElementById('K_ID')") === -1)
            kode = eval(kode);
    } catch (e) { }

    kode = kode.match(/<source.*?>/)[0].match(/".*?"/g).map(function (v) {
        if (!/video-info/.test(v))
            return v.replace(/\\?"/g, '');
    });

    ohash = $text.base64Decode((kode[1]));
    ts = kode[2];
    vid = kode[3];

    const hexs = [0x2, 0x3, 0x5, 0x7, 0xb, 0xd, 0x11, 0x13, 0x17, 0x1d].reverse();
    
    for (let i = 0; i < ohash.length; i++) {
        let ai = -1;
        for (let j = 0; j < hexs.length; j++) {
            let hex = hexs[j];
            if (i > hex && i % hex == 0) {
                ai = i / hex;
                break;
            }
        }
        if (ai === -1) ai = i;
        charCode = ohash.charCodeAt(i) ^ ai;
        hash = buildHash(String.fromCharCode(charCode), hash);
    }

    hash = $text.base64Encode(hash);
    
    return { hash: hash, ts: ts, vid: vid };
}
$http.get({
    url: url,
    handler: function (resp) {
        const data = resp.data;
        const script = data.match(/<script\s*?id=.*?>[\s\S]*?<\/script>/)[0], code = script.match(/\\"([\d\s])*?\\"/)[0].match(/\\"(.*?)\\"/)[1];
        const videoInfo = decode(code);
        $http.get({
            url: `https://avgle.com/video-url.php?hash=${videoInfo.hash}&ts=${videoInfo.ts}&vid=${videoInfo.vid}`,
            handler: function(resp) {
                var data = resp.data
                $ui.alert(data.url);
            }
        })
    }
});
