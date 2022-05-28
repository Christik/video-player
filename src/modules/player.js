
// Класс кнопки Play, когда видео играет
const playedClass = 'is-played';

// Обновить отображение текущего времени
const updateTime = (player) => {
    const format = (number) => {
        let result = Math.floor(number);

        if (number < 10) {
            result = `0${result}`;
        }

        return result;
    };
    const minutes = format(player.video.currentTime / 60);
    const seconds = format(player.video.currentTime % 60);

    player.time.textContent = `${minutes}:${seconds}`;
};

// Установить новое время проигрывания
const setCurrentTime = (player) => {
    const newTime = (player.range.value / 100) * player.video.duration;

    player.video.currentTime = Number(newTime.toFixed());
};

// Обновить input range в соответствии с текущим временем
const updateRange = (player) => {
    const duration = player.video.duration;
    const currentTime = player.video.currentTime;

    player.range.value = currentTime/duration * 100;
};

// Остановить проигрыватель
const stop = (player) => {
    player.video.pause();
    player.video.currentTime = 0;
    player.buttonPlay.classList.remove(playedClass);
};

// Переключить вид кнопки Play
const togglePlayButton = (player) => {
   player.buttonPlay.classList.toggle(playedClass);
};

// Play/pause
const toggleVideoStatus = (player) => {
    if (player.video.paused) {
        player.video.play();
    } else {
        player.video.pause();
    }

    togglePlayButton(player);
};


const init = (players) => {
    players.forEach((currentPlayer) => {
        // Элементы плеера
        const player = {
            video: currentPlayer.querySelector('video'),
            buttonPlay: currentPlayer.querySelector('[data-play]'),
            buttonStop: currentPlayer.querySelector('[data-stop]'),
            range: currentPlayer.querySelector('[data-range]'),
            time: currentPlayer.querySelector('[data-time]'),
        };

        // Клик по видео
        player.video.addEventListener('click', (event) => {
            toggleVideoStatus(player);
        });

        // Клик по кнопке Play
        player.buttonPlay.addEventListener('click', (event) => {
            toggleVideoStatus(player);
        });

        // Клик по кнопке Stop
        player.buttonStop.addEventListener('click', (event) => {
            stop(player);
        });

        // Обработчик события timeupdate,
        // обновляет положение ползунка и значение input range
        const timeupdateHandler = (event) => {
            updateRange(player);            
        }

        // Изменение позиции воспроизведения
        player.video.addEventListener('timeupdate', timeupdateHandler);

        // Процесс изменения значения input range
        player.range.addEventListener('input', (event) => {
            // Удаляем обработчик события timeupdate 
            // и автообновление положения ползунка,
            // пока пользователь двигает ползунок
            player.video.removeEventListener('timeupdate', timeupdateHandler);
        });

        // Окончание изменения значения input range
        player.range.addEventListener('change', (event) => {
            setCurrentTime(player);

            // После того, как пользователь отпустил ползунок,
            // возвращаем автообновление input range
            player.video.addEventListener('timeupdate', timeupdateHandler);
        });
 
        // Изменение позиции воспроизведения
        player.video.addEventListener('timeupdate', (event) => {
            updateTime(player);
        });
   });
};

export default init;