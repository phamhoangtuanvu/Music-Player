/*
1. Render songs
2. Scroll top
3. Play / pause / seek
4. CD rotate
5. Next / prev
6. Random
7. Next / Repeat when ended
8. Active Song
9. Scroll active song into view
10. Play song when click
*/
const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const PLAYER_STORAGE_KEY = 'MUSIC_PLAYER'
const cd = $('.cd')
const player = $('.player')     
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')

const playBtn = $('.btn-toggle-play')

const progress = $('#progress')
const repeatBtn = $('.btn-repeat')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')

const playlist = $('.playlist')

const app = {
    isPlaying: false,
    currentIndex: 0,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    setConfig: function (key, value) {
        this.config[key] = value
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },
    songs: [
    {
            name: '7 Years',
            singer: 'Lukas Graham',
            path: 'https://tainhac123.com/listen/7-years-lukas-graham.ieYfob2IYGCI.html',
            image: 'https://avatar-nct.nixcdn.com/song/2020/05/14/c/6/d/9/1589437637831.jpg' 
        },
        {
            name: 'Maps',
            singer: 'Maroon 5',
            path: 'https://tainhac123.com/listen/maps-maroon-5.Ds29LKVXxjzT.html',
            image: 'https://avatar-nct.nixcdn.com/song/2018/06/22/0/c/c/b/1529655937714.jpg' 
        },
        {
            name: 'Perfect',
            singer: 'Ed Sheeran',
            path: 'https://tainhac123.com/listen/perfect-ed-sheeran.O5ZdaGqNhRSh.html',
            image: 'https://avatar-nct.nixcdn.com/song/2018/01/25/5/2/d/e/1516891587276.jpg' 
        },
        {
            name: 'Take Me To Church',
            singer: 'Hozier',
            path: 'https://tainhac123.com/listen/take-me-to-church-hozier.BAhQNx06oZwe.html',
            image: 'https://avatar-nct.nixcdn.com/singer/avatar/2016/01/25/4/1/1/7/1453716209149.jpg' 
        },                {
            name: 'Rude',
            singer: 'Magic!',
            path: 'https://tainhac123.com/listen/rude-magic.NgvbCtbdMZGL.html',
            image: 'https://avatar-nct.nixcdn.com/song/2018/04/09/2/7/3/e/1523262898254.jpg' 
        },
        {
            name: 'Dynasty',
            singer: 'Miia',
            path: 'https://tainhac123.com/listen/dynasty-miia.eEcWQYCUpgfl.html',
            image: 'https://avatar-nct.nixcdn.com/song/2019/07/26/c/d/3/8/1564128412708.jpg' 
        },
        {
            name: 'La La La',
            singer: 'Naughty Boy,Sam Smith',
            path: 'https://tainhac123.com/listen/la-la-la-naughty-boy-ft-sam-smith.KuvJi8bYttdt.html',
            image: 'https://avatar-nct.nixcdn.com/song/2017/11/09/b/6/b/3/1510211931329.jpg' 
        },
        {
            name: 'Talking To The Moon',
            singer: 'Bruno Mars',
            path: 'https://tainhac123.com/listen/talking-to-the-moon-bruno-mars.VHb3WNnM02fQ.html',
            image: 'https://avatar-nct.nixcdn.com/song/2020/08/06/6/0/8/0/1596678685153.jpg' 
        },
    ],
    render: function() {
        const htmls = this.songs.map((song, index) => {
            return `
            <div class="song ${this.currentIndex === index ? 'active' : ''} " data-index="${index}">
                <div class="thumb" style="background-image: url('${song.image}')">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
            `
        })

        playlist.innerHTML = htmls.join('')
    },
        
    handleEvents: function() {
        const cdWidth = cd.offsetWidth
        const _this = this
        // Xu ly phong to thu nho cd
        document.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollTop
            cd.style.width = newCdWidth>0 ? newCdWidth + 'px' : 0
            cd.style.opacity = newCdWidth / cdWidth
        }

        //Xử lý CD quay
        const cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(360deg)'}
        ],{
            duration: 10000, //10 second
            iterations: Infinity,
        })
        cdThumbAnimate.cancel()
        

        // Khi click nút reload
        // reload.onclick = function() {
        //   audio.load()
        //   cdThumbAnimate.cancel()
        //   _this.isPlaying = false
        //   player.classList.remove('playing')
        //   progress.value = 0
        // }

        // Xử lý khi click nút play
        playBtn.onclick = changePlayState
        
        function changePlayState() {
            if (_this.isPlaying) {
            audio.pause()
            }
            else {
            audio.play()
            }
        }

        // Khi phát nhạc
        audio.onplay = function() {
            _this.isPlaying = true
            player.classList.add('playing')
            cdThumbAnimate.play()
        }

        // Khi pause nhạc
        audio.onpause = function() {
            _this.isPlaying = false
            player.classList.remove('playing')
            cdThumbAnimate.pause()
        }

        // Chạy progress khi phát nhạc
        audio.ontimeupdate = function() {
            const progressPercent = this.currentTime / this.duration *100 
            if (progressPercent){
            progress.value = progressPercent 
            }
        }

        // Tua nhạc
        progress.onchange = function() {
            const currentValue = this.value
            audio.currentTime = currentValue * audio.duration / 100
        }

        nextBtn.onclick = function(){
            _this.nextSong()
            audio.play()
            cdThumbAnimate.cancel()
            _this.render()
            _this.scrollToActiveSong()
        }

        prevBtn.onclick = function(){
            _this.prevSong()
            audio.play()
            cdThumbAnimate.cancel()
            _this.render()
            _this.scrollToActiveSong()
        }

        // Random song
        randomBtn.onclick = function() {
            _this.isRandom = !_this.isRandom
            _this.setConfig('isRandom',_this.isRandom)
            this.classList.toggle('active',_this.isRandom)
        }

        // repeat or next
        repeatBtn.onclick = function() {
            _this.isRepeat = !_this.isRepeat
            _this.setConfig('isRepeat',_this.isRepeat)
            repeatBtn.classList.toggle('active',_this.isRepeat)
        }
        
        // Xử lý khi phát hết nhạc
        audio.onended = function() {
            if (_this.isRepeat) {
            audio.play()
            }
            else{
            _this.nextSong()
            audio.play()
            }
        }

        //Xử lý khi click vào playlist
        playlist.onclick = function(e) {
            const songIsNotActive = e.target.closest('.song:not(.active)')
            const songActive = $('.song.active')
            const option = e.target.closest('.option')
            if ( songIsNotActive || option){
            //Khi chọn song
            if (songIsNotActive) {
                _this.currentIndex = Number(songIsNotActive.dataset.index)
                songActive.classList.remove('active')
                songIsNotActive.classList.add('active')
                _this.loadCurrentSong()
                audio.play()
            }

            //khi chọn option
            if (option){

            }
            }
        }

        // Thao tác với bàn phím
        window.onkeyup = function(e) {
            if (e.keyCode == 32){
            changePlayState()
            }
        }
    },

    defineProperties: function() {
        Object.defineProperty(this,'currentSong',{
            get: function() {
                return this.songs[this.currentIndex]
            }
        })
    },
    loadConfig: function () {
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat
    },

    renderConfig: function() {
        randomBtn.classList.toggle('active',this.isRandom)
        repeatBtn.classList.toggle('active',this.isRepeat)
    },

    loadCurrentSong: function() {
        heading.innerText = this.currentSong.name
        cdThumb.style = `background-image: url('${this.currentSong.image}')`
        Object.assign(audio,{
            src: this.currentSong.path
        })
    },

    nextSong: function(){
        this.isRandom ? this.playRandomSong() : this.currentIndex++


        if (this.currentIndex >= this.songs.length) {
        this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    
    prevSong: function(){
        this.isRandom ? this.playRandomSong() : this.currentIndex--

        if (this.currentIndex < 0) {
        this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },

    playRandomSong: function() {
        let newIndex
        do {
        newIndex = Math.floor(Math.random() * this.songs.length)
        }
        while (newIndex === this.currentIndex)

        this.currentIndex = newIndex
    },

    repeatSong: function() {

    },

    scrollToActiveSong: function() {
        setTimeout(() => {
        songActive.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
        })
        },100)
    },

    start: function() {
        
        //Gán cấu hình config
        this.loadConfig()
        this.renderConfig()
        
        // định nghĩa các thuộc tính cho object
        this.defineProperties()

        //lắng nghe xử lý các sự kiện 
        this.handleEvents()
    
        this.loadCurrentSong()

        this.render()
    }
}

app.start()