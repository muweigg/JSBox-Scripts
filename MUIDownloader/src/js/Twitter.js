async function analysisTwitterVideoByLink () {
    const HOST = 'https://www.online-downloader.com/DL/dd.php';

    $http.get({
        url: `${HOST}?videourl=${encodeURI(url)}`,
        handler: function(resp) {
            var data = resp.data;
            $console.info(data);
        }
    })
}