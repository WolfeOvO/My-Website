export default function spoilerPlugin(md) {
  function tokenize(state, silent) {
    const start = state.pos
    const max = state.posMax

    // 检查 ||
    if (state.src.charCodeAt(start) !== 0x7C || state.src.charCodeAt(start + 1) !== 0x7C) {
      return false
    }

    if (silent) return false

    // 查找结束 ||
    let end = start + 2
    while (end < max - 1) {
      if (state.src.charCodeAt(end) === 0x7C && state.src.charCodeAt(end + 1) === 0x7C) {
        break
      }
      end++
    }

    if (end >= max - 1 || end === start + 2) return false

    const content = state.src.slice(start + 2, end)

    const tokenOpen = state.push('spoiler_open', 'span', 1)
    tokenOpen.attrs = [['class', 'spoiler']]

    const tokenContent = state.push('inline', '', 0)
    tokenContent.content = content
    tokenContent.children = []
    state.md.inline.parse(content, state.md, state.env, tokenContent.children)

    state.push('spoiler_close', 'span', -1)
    state.pos = end + 2
    return true
  }

  md.inline.ruler.before('emphasis', 'spoiler', tokenize)
}