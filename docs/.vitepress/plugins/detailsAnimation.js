export function setupDetailsAnimation() {
  const DURATION = 280;
  const EASING = 'cubic-bezier(0.4, 0, 0.2, 1)';
  
  const states = new WeakMap();
  
  function initDetails() {
    document.querySelectorAll('.custom-block.details').forEach(details => {
      if (details.dataset.animInit) return;
      details.dataset.animInit = 'true';
      
      const summary = details.querySelector('summary');
      const content = details.querySelector('.details-content');
      const inner = details.querySelector('.details-inner');
      
      if (!summary || !content || !inner) return;
      
      const isOpen = details.open;
      
      // 初始化箭头
      details.dataset.arrowOpen = isOpen ? 'true' : 'false';
      
      // 创建动画（fill: 'both' 保持首尾帧状态）
      const gridAnim = content.animate(
        [
          { gridTemplateRows: '0fr' },
          { gridTemplateRows: '1fr' }
        ],
        { duration: DURATION, easing: EASING, fill: 'both' }
      );
      
      const fadeAnim = inner.animate(
        [
          { opacity: 0, transform: 'translateY(-6px)' },
          { opacity: 1, transform: 'translateY(0)' }
        ],
        { duration: DURATION * 0.9, easing: EASING, fill: 'both' }
      );
      
      // 设置初始位置并暂停
      const gridDuration = DURATION;
      const fadeDuration = DURATION * 0.9;
      
      if (isOpen) {
        gridAnim.currentTime = gridDuration;
        fadeAnim.currentTime = fadeDuration;
      } else {
        gridAnim.currentTime = 0;
        fadeAnim.currentTime = 0;
      }
      gridAnim.pause();
      fadeAnim.pause();
      
      states.set(details, {
        isOpen,
        gridAnim,
        fadeAnim
      });
      
      summary.addEventListener('click', e => {
        e.preventDefault();
        toggle(details);
      });
    });
  }
  
  function toggle(details) {
    const state = states.get(details);
    const { gridAnim, fadeAnim } = state;
    
    // 反转目标状态
    state.isOpen = !state.isOpen;
    
    // 更新箭头（CSS transition 处理动画）
    details.dataset.arrowOpen = state.isOpen ? 'true' : 'false';
    
    // 展开时确保 details 是打开的
    details.open = true;
    
    // 设置播放方向：1=正向(展开), -1=反向(收起)
    const rate = state.isOpen ? 1 : -1;
    gridAnim.playbackRate = rate;
    fadeAnim.playbackRate = rate;
    
    // 播放动画
    gridAnim.play();
    fadeAnim.play();
    
    // 动画结束时的处理
    gridAnim.onfinish = () => {
      // 收起完成后关闭 details
      if (!state.isOpen) {
        details.open = false;
      }
    };
  }
  
  // 初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDetails);
  } else {
    initDetails();
  }
  
  // 监听 DOM 变化
  const observer = new MutationObserver(() => setTimeout(initDetails, 50));
  observer.observe(document.body, { childList: true, subtree: true });
  
  return () => observer.disconnect();
}

export default setupDetailsAnimation;