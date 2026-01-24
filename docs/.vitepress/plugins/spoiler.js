export function spoiler(md) {
  // 保存原始的 render 函数
  const defaultRender = md.renderer.render.bind(md.renderer)

  // 重写 render 函数
  md.renderer.render = function(tokens, options, env) {
    // 先用原始方法渲染
    let html = defaultRender(tokens, options, env)
    
    // 然后替换 ||...|| 为 <span class="spoiler">...</span>
    // 使用非贪婪匹配，支持多个 spoiler
    html = html.replace(/\|\|([^|]+?)\|\|/g, '<span class="spoiler">$1</span>')
    
    return html
  }
}