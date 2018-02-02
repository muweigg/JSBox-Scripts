async function analysisTwitterVideoByLink () {
    const HOST = 'https://twdown.net/download.php';

    $ui.loading(true);
    $ui.toast(`解析地址`);

    $console.info(link);

    return new Promise(resolve => {
        $http.post({
            url: HOST,
            form: { 'URL': link },
            handler: function(resp) {
                const data = resp.data;
                $console.info(data);
                const title = data.match(/<h4>(.*?)<\/h4>/)[1];
                const tbody = data.match(/<tbody>([\s\S]*?)<\/tbody>/)[1];


                // resolve(video);
                $ui.loading(false);
                $device.taptic(0);
            }
        })
    });
}