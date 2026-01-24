export function spoiler(md) {
  // 插入规则
  md.inline.ruler.before('emphasis', 'spoiler', function(state, silent) {
    const marker = 0x7C // |
    const start = state.pos
    const max = state.posMax

    // 需要至少4个字符: ||x||
    if (start + 4 > max) return false

    // 检查开始标记 ||
    if (state.src.charCodeAt(start) !== marker) return false
    if (state.src.charCodeAt(start + 1) !== marker) return false

    // 不能是 |||
    if (state.src.charCodeAt(start + 2) === marker) return false

    // 找结束标记
    let pos = start + 2
    while (pos + 1 < max) {
      if (state.src.charCodeAt(pos) === marker && state.src.charCodeAt(pos + 1) === marker) {
        // 找到了 ||
        break
      }
      pos++
    }

    // 没找到结束标记
    if (pos + 1 >= max) return false

    // 内容为空
    if (pos === start + 2) return false

    const content = state.src.slice(start + 2, pos)

    // silent 模式只检测，不生成 token
    if (silent) return true

    // 生成 token
    const tokenO = state.push('spoiler_open', 'span', 1)
    tokenO.attrs = [['class', 'spoiler']]
    tokenO.markup = '||'

    const tokenT = state.push('text', '', 0)
    tokenT.content = content

    const tokenC = state.push('spoiler_close', 'span', -1)
    tokenC.markup = '||'

    state.pos = pos + 2
    return true
  })
}