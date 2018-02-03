async function checkUpdate () {
    const checkVersionURL = 'https://raw.githubusercontent.com/muweigg/JSBox-Scripts/master/MUIDownloader/README.md',
        messageURL = 'https://raw.githubusercontent.com/muweigg/JSBox-Scripts/master/MUIDownloader/UPDATE.md',
        updateURL = 'jsbox://install?url=https://raw.githubusercontent.com/muweigg/JSBox-Scripts/master/MUIDownloader/MUIDownloader.js&icon=icon_035.png&name=MUIDownloader';
    
    async function getVersion () {
        return new Promise(resolve => {
            $http.get({
                url: checkVersionURL,
                handler (resp) {
                    resolve(resp.data);
                }
            });
        });
    }

    async function getUpdateMessage () {
        return new Promise(resolve => {
            $http.get({
                url: messageURL,
                handler (resp) {
                    resolve(resp.data);
                }
            });
        });
    }

    const newVersion = await getVersion();
    if (version === newVersion) return;
    const msg = await getUpdateMessage();

    $ui.alert({
        title: `发现新版本: ${newVersion}`,
        message: msg.message,
        actions: [{
            title: '取消',
        }, {
            title: '更新',
            handler () {
                $ui.toast('正在更新');
                $app.openURL(encodeURI(`${updateURL}`));
            }
        }]
    });

    $device.taptic(0);
}

checkUpdate();