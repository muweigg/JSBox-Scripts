var vm = new Vue({
    el: '#app',
    data: {
        link: '',
        app: {
            title: 'MUI Downloader'
        }
    },
    mounted: function() {
        this.$nextTick(function() {
            $notify('exec', { func: 'ready' });
        });
    }
});

// $notify('debug', 'is ok');
