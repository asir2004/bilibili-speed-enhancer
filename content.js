console.log('Bilibili Speed Enhancer: Script loaded');

// 支持的播放速度选项
const speedOptions = [3.0, 4.0];

// 添加速度选项到菜单
function addSpeedOption(doc = document) {
  const playbackRateMenu = doc.querySelector('ul.bpx-player-ctrl-playbackrate-menu');
  if (playbackRateMenu) {
    console.log('Bilibili Speed Enhancer: Found playback rate menu');
    
    speedOptions.forEach(speed => {
      const existingOption = playbackRateMenu.querySelector(`li[data-value="${speed}"]`);
      if (!existingOption) {
        console.log(`Bilibili Speed Enhancer: Adding ${speed}x option`);
        const newSpeedOption = doc.createElement('li');
        newSpeedOption.className = 'bpx-player-ctrl-playbackrate-menu-item';
        newSpeedOption.setAttribute('data-value', speed.toString());
        newSpeedOption.textContent = `${speed.toFixed(1)}x`;
        playbackRateMenu.insertBefore(newSpeedOption, playbackRateMenu.firstChild);

        newSpeedOption.addEventListener('click', () => {
          console.log(`Bilibili Speed Enhancer: ${speed}x clicked`);
          const video = doc.querySelector('video');
          if (video) {
            video.playbackRate = speed;
            console.log(`Bilibili Speed Enhancer: Set playback rate to ${speed}`);
          } else {
            console.log('Bilibili Speed Enhancer: Video element not found');
          }
        });
      }
    });
    return true;
  }
  return false;
}

// 检查 iframe 中的播放器
function checkIframe() {
  const iframes = document.querySelectorAll('iframe');
  iframes.forEach(iframe => {
    try {
      const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
      console.log('Bilibili Speed Enhancer: Checking iframe');
      addSpeedOption(iframeDoc);
    } catch (e) {
      console.log('Bilibili Speed Enhancer: Error accessing iframe', e);
    }
  });
}

// 定期检查 DOM，直到找到菜单或超时
let attempts = 0;
const maxAttempts = 20;
const interval = setInterval(() => {
  console.log(`Bilibili Speed Enhancer: Attempt ${attempts + 1}`);
  if (addSpeedOption() || attempts >= maxAttempts) {
    clearInterval(interval);
    if (attempts >= maxAttempts) {
      console.log('Bilibili Speed Enhancer: Timed out, menu not found');
      checkIframe(); // 最后尝试检查 iframe
    }
  }
  attempts++;
}, 1000);

// MutationObserver 作为备用，监听动态加载
const observer = new MutationObserver(() => {
  if (addSpeedOption()) {
    observer.disconnect();
    clearInterval(interval);
  }
});
observer.observe(document.body, {
  childList: true,
  subtree: true
});