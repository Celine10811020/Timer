const alarmSounds = Array.from({ length: 14 }, (_, i) => `Music/Music (${i + 1}).mp3`);

function createTimer() {
  const container = document.createElement('div');
  container.className = 'timer';

  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'delete-btn';
  deleteBtn.innerText = 'X';
  deleteBtn.onclick = () => {
    if (alarmAudio) alarmAudio.pause();
    container.remove();
  };

  const labelInput = document.createElement('input');
  labelInput.type = 'text';
  labelInput.placeholder = 'Label your timer';

  const timeDiv = document.createElement('div');
  timeDiv.className = 'time-inputs';

  const hourInput = document.createElement('input');
  hourInput.type = 'number';
  hourInput.placeholder = 'HH';

  const minInput = document.createElement('input');
  minInput.type = 'number';
  minInput.placeholder = 'MM';

  const secInput = document.createElement('input');
  secInput.type = 'number';
  secInput.placeholder = 'SS';

  timeDiv.appendChild(hourInput);
  timeDiv.appendChild(minInput);
  timeDiv.appendChild(secInput);

  const startBtn = document.createElement('button');
  startBtn.innerText = 'Start';

  const resetBtn = document.createElement('button');
  resetBtn.innerText = 'Reset';
  resetBtn.style.display = 'none';

  const display = document.createElement('div');
  display.style.fontSize = '1.5rem';
  display.style.marginTop = '10px';
  display.innerText = '⏱ 00:00';

  let interval, remaining, originalTime;
  let alarmAudio = null;

  function updateDisplay() {
    const min = String(Math.floor(remaining / 60)).padStart(2, '0');
    const sec = String(remaining % 60).padStart(2, '0');
    display.innerText = `⏱ ${min}:${sec}`;
  }

  startBtn.onclick = () => {
    if (interval) return;

    if (startBtn.innerText === 'Restart') {
      if (alarmAudio) {
        alarmAudio.pause();
        alarmAudio.currentTime = 0;
      }
      container.classList.remove('alarming');
      remaining = originalTime;
      updateDisplay();
      resetBtn.style.display = 'none';
    } else {
      const hours = parseInt(hourInput.value) || 0;
      const minutes = parseInt(minInput.value) || 0;
      const seconds = parseInt(secInput.value) || 0;
      originalTime = hours * 3600 + minutes * 60 + seconds;

      if (originalTime <= 0) {
        alert('Please enter a valid time.');
        return;
      }
      remaining = originalTime;
      updateDisplay();
    }

    interval = setInterval(() => {
      remaining--;
      updateDisplay();
      if (remaining <= 0) {
        clearInterval(interval);
        interval = null;
        updateDisplay();

        const soundUrl = alarmSounds[Math.floor(Math.random() * alarmSounds.length)];
        alarmAudio = new Audio(soundUrl);
        alarmAudio.loop = true;
        alarmAudio.play();

        container.classList.add('alarming');
        startBtn.innerText = 'Restart';
        resetBtn.style.display = 'inline-block';
      }
    }, 1000);
  };

  resetBtn.onclick = () => {
    clearInterval(interval);
    interval = null;
    if (alarmAudio) {
      alarmAudio.pause();
      alarmAudio.currentTime = 0;
    }
    container.classList.remove('alarming');
    display.innerText = '⏱ 00:00';
    hourInput.value = '';
    minInput.value = '';
    secInput.value = '';
    resetBtn.style.display = 'none';
    startBtn.innerText = 'Start';
  };

  container.appendChild(deleteBtn);
  container.appendChild(labelInput);
  container.appendChild(timeDiv);
  container.appendChild(startBtn);
  container.appendChild(resetBtn);
  container.appendChild(display);

  document.getElementById('timers').appendChild(container);
}
