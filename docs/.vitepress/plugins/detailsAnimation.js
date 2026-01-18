export function setupDetailsAnimation() {
  // 存储每个 details 的动画状态
  const animationState = new WeakMap();
  
  /**
   * 初始化所有 details 元素
   */
  function initDetails() {
    const detailsElements = document.querySelectorAll('.custom-block.details');
    
    detailsElements.forEach(details => {
      if (details.dataset.animationInit) return;
      details.dataset.animationInit = 'true';
      
      const summary = details.querySelector('summary');
      const content = details.querySelector('.details-content');
      const inner = details.querySelector('.details-inner');
      
      if (!summary || !content || !inner) return;
      
      // 初始化状态和箭头class
      const isOpen = details.open;
      if (isOpen) {
        details.classList.add('arrow-open');
      }
      
      animationState.set(details, {
        isOpen: isOpen,
        animation: null
      });
      
      summary.addEventListener('click', (e) => {
        e.preventDefault();
        toggle(details, content, inner);
      });
    });
  }
  
  /**
   * 切换展开/折叠
   */
  function toggle(details, content, inner) {
    const state = animationState.get(details);
    
    // 目标状态取反
    const targetOpen = !state.isOpen;
    state.isOpen = targetOpen;
    
    // 立即更新箭头状态
    details.classList.toggle('arrow-open', targetOpen);
    
    // 如果有正在进行的动画，反转它
    if (state.animation && state.animation.playState === 'running') {
      state.animation.reverse();
      return;
    }
    
    // 展开时先设置 open 属性
    if (targetOpen) {
      details.open = true;
    }
    
    // 创建动画关键帧
    const gridKeyframes = targetOpen
      ? [{ gridTemplateRows: '0fr' }, { gridTemplateRows: '1fr' }]
      : [{ gridTemplateRows: '1fr' }, { gridTemplateRows: '0fr' }];
    
    const fadeKeyframes = targetOpen
      ? [
          { opacity: 0, transform: 'translateY(-8px)' },
          { opacity: 1, transform: 'translateY(0)' }
        ]
      : [
          { opacity: 1, transform: 'translateY(0)' },
          { opacity: 0, transform: 'translateY(-8px)' }
        ];
    
    const timing = {
      duration: 300,
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
      fill: 'forwards'
    };
    
    // 执行动画组
    const gridAnim = content.animate(gridKeyframes, timing);
    const fadeAnim = inner.animate(fadeKeyframes, { ...timing, duration: 250 });
    
    // 存储主动画引用
    state.animation = gridAnim;
    
    // 同步反转淡入淡出动画和箭头
    const originalReverse = gridAnim.reverse.bind(gridAnim);
    gridAnim.reverse = () => {
      originalReverse();
      fadeAnim.reverse();
      state.isOpen = !state.isOpen;
      // 反转箭头
      details.classList.toggle('arrow-open', state.isOpen);
    };
    
    // 动画完成后清理
    gridAnim.onfinish = () => {
      const finalOpen = state.isOpen;
      
      if (!finalOpen) {
        details.open = false;
      }
      
      // 清除动画效果，让 CSS 接管
      gridAnim.cancel();
      fadeAnim.cancel();
      
      state.animation = null;
    };
  }
  
  // 初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDetails);
  } else {
    initDetails();
  }
  
  // 监听 DOM 变化
  const observer = new MutationObserver(() => {
    setTimeout(initDetails, 100);
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  
  return () => observer.disconnect();
}

export default setupDetailsAnimation;