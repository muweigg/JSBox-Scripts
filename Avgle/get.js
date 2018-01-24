const host = 'https://avgle.com';
    url = encodeURI("https://avgle.com/video/99689/cmi-120-ゲスの極み映像-人妻25人目");
// const url = encodeURI('https://avgle.com/video/130158/heyzo-1651');

function decode(code, hexs) {
    const c = code.split(' ');
    let kode = '', ohash = '', hash = '', ts = 0, vid = 0;

    for (var i = 0; i < c.length; i++) {
        kode += String.fromCharCode(parseInt(c[i]) - 3);
    }

    kode = kode;

    try {
        while (kode.indexOf("getElementById('K_ID')") === -1)
            kode = eval(kode);
    } catch (e) { }

    kode = kode.match(/<source.*?>/)[0].match(/".*?"/g)
        .filter(v => !/video-info/.test(v))
        .map(v => v.replace(/\\?"/g, ''));

    ohash = $text.base64Decode((kode[0]));
    ts = kode[1];
    vid = kode[2];

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
        hash = String.fromCharCode(charCode) + hash;
    }

    hash = $text.base64Encode(hash);
    
    return { hash: hash, ts: ts, vid: vid };
}

async function getHexs (html) {

    const keyScript = html.match(/\/templates.*avgle-main-ah\.js\?\d+/)[0];

    return new Promise(resolve => {

        $http.get({
            url: `${host}${keyScript}`,
            handler: function(resp) {
                let hexs = resp.data.match(/\$\(function[\s\S]*?var[\s\S]*?=(\[0x.*?\])/)[1];
                hexs = eval(hexs).reverse();
                resolve(hexs);
            }
        });

    });
}

async function getHtml () {

    return new Promise(resolve => {

        $http.get({
            url: url,
            handler: function (resp) {
                resolve(resp.data);
            }
        });

    });
}

async function getVideoInfo () {
    const html = await getHtml();
    const hexs = await getHexs(html);

    const script = html.match(/<script\s*?id=.*?>[\s\S]*?<\/script>/)[0],
        code = script.match(/\\"([\d\s])*?\\"/)[0].match(/\\"(.*?)\\"/)[1];

    const vInfo = decode(code, hexs);

    return vInfo;
}

async function test () {
    const vInfo = await getVideoInfo();
    $console.info(JSON.stringify(vInfo, null, 2));
    $http.get({
        url: `${host}/video-url.php?hash=${vInfo.hash}&ts=${vInfo.ts}&vid=${vInfo.vid}`,
        handler: function(resp) {
            const data = resp.data
            if (data.url) $share.sheet(data.url);
            else $ui.alert('未获取到链接');
        }
    })
}

test();