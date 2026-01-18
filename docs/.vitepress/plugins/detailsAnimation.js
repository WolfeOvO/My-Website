
export function setupDetailsAnimation() {
  // 动画持续时间（与 CSS 保持一致）
  const ANIMATION_DURATION = 350;
  
  // 存储正在动画中的元素
  const animatingElements = new WeakSet();
  
  /**
   * 初始化所有 details 元素
   */
  function initDetails() {
    const detailsElements = document.querySelectorAll('.custom-block.details');
    
    detailsElements.forEach(details => {
      // 避免重复绑定
      if (details.dataset.animationInit) return;
      details.dataset.animationInit = 'true';
      
      const summary = details.querySelector('summary');
      const content = details.querySelector('.details-content');
      
      if (!summary || !content) return;
      
      // 阻止默认的点击行为，改用自定义动画
      summary.addEventListener('click', (e) => {
        e.preventDefault();
        
        // 如果正在动画中，忽略点击
        if (animatingElements.has(details)) return;
        
        if (details.open) {
          closeDetails(details, content);
        } else {
          openDetails(details, content);
        }
      });
    });
  }
  
  /**
   * 展开 details
   */
  function openDetails(details, content) {
    animatingElements.add(details);
    
    // 先设置 open 属性，让内容可见
    details.open = true;
    
    // 强制重绘以触发动画
    content.offsetHeight;
    
    // 动画完成后移除标记
    setTimeout(() => {
      animatingElements.delete(details);
    }, ANIMATION_DURATION);
  }
  
  /**
   * 折叠 details (带动画)
   */
  function closeDetails(details, content) {
    animatingElements.add(details);
    
    // 添加关闭动画类
    details.classList.add('closing');
    
    // 等待动画完成后再真正关闭
    setTimeout(() => {
      details.open = false;
      details.classList.remove('closing');
      animatingElements.delete(details);
    }, ANIMATION_DURATION);
  }
  
  // 初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDetails);
  } else {
    initDetails();
  }
  
  // 监听DOM变化，处理动态添加的 details
  const observer = new MutationObserver((mutations) => {
    mutations.forEach(mutation => {
      if (mutation.addedNodes.length) {
        // 延迟执行以确保DOM完全渲染
        setTimeout(initDetails, 100);
      }
    });
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  
  // 返回清理函数
  return () => {
    observer.disconnect();
  };
}

export default setupDetailsAnimation;