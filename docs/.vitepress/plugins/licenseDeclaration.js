/**
 * VitePress Markdown-it 插件：许可声明（详细版）
 * 支持 AI 内容声明、Creative Commons、公有领域、GNU 许可、合理使用、开源许可等
 * 
 * 语法：
 * <ai media="image" model="midjourney" type="generated" text="说明文字" />
 * <license type="cc-by-sa" version="4.0" text="说明文字" />
 * <license type="pd-old" author="作者" year="1920" text="说明" />
 */

// ================================================================
// AI 相关配置
// ================================================================

const AI_TYPES = {
  'generated': { 
    label: 'AI 生成', 
    desc: '由人工智能模型生成，可能部分或完全未经人类实质性修改。', 
    icon: 'sparkles',
    detail: '此内容由人工智能模型独立生成，生成过程中可能使用了人类提供的提示词（Prompt），但最终输出内容可能部分或完全未经人类进行实质性的编辑、修改或重写。'
  },
  'assisted': { 
    label: 'AI 辅助', 
    desc: '人类创作为主，AI 提供建议、补充或参考', 
    icon: 'wand',
    detail: '此内容以人类创作为主体，人工智能在创作过程中提供了辅助支持，包括但不限于：提供写作建议、补充背景资料、生成参考草稿、回答创作者的问题等。最终内容经过人类审核、筛选和整合。'
  },
  'edited': { 
    label: 'AI 编辑', 
    desc: '人类完成原始创作，AI 进行润色、校对或优化', 
    icon: 'pencil',
    detail: '此内容的原始版本由人类创作完成，随后使用人工智能工具进行了编辑处理，包括但不限于：语法修正、文字润色、风格调整、结构优化、错别字校对等。核心内容和观点来源于人类创作者。'
  },
  'translated': { 
    label: 'AI 翻译', 
    desc: '由人工智能系统完成语言翻译', 
    icon: 'languages',
    detail: '此内容由人工智能翻译系统从其他语言翻译而来。机器翻译可能存在语义偏差、文化差异处理不当或专业术语不准确等问题，重要内容请参考原文或咨询专业译者。'
  },
  'enhanced': { 
    label: 'AI 增强', 
    desc: '人类创作的原始内容经 AI 进行质量提升', 
    icon: 'zap',
    detail: '此内容基于人类创作的原始版本，使用人工智能技术进行了质量增强处理，包括但不限于：图像超分辨率放大、音频降噪修复、视频帧率提升、色彩校正优化等技术处理。'
  },
  'reviewed': { 
    label: 'AI 审核', 
    desc: '内容经人工智能系统审核或验证', 
    icon: 'check',
    detail: '此内容已经人工智能审核系统进行检查，审核范围可能包括：事实核查、语法检查、风格一致性、敏感内容筛查等。AI 审核结果仅供参考，不构成对内容准确性的完全保证。'
  },
  'summarized': { 
    label: 'AI 摘要', 
    desc: '由 AI 对较长内容生成的概括性摘要', 
    icon: 'file-text',
    detail: '此摘要由人工智能系统对原始长文内容进行分析后自动生成。AI 摘要旨在提取核心要点，但可能无法完全涵盖原文的所有细节和语境，如需全面了解请阅读原文。'
  },
  'transcribed': { 
    label: 'AI 转录', 
    desc: '由 AI 从音频或视频内容转录为文字', 
    icon: 'mic',
    detail: '此文字内容由人工智能语音识别系统从音频或视频中转录生成。自动转录可能存在识别错误，特别是在专有名词、方言口音、背景噪音较大或多人同时说话的情况下，准确性可能受到影响。'
  }
};

const MEDIA_TYPES = {
  'text': { label: '文本', icon: 'align-left' },
  'article': { label: '文章', icon: 'file-text' },
  'image': { label: '图像', icon: 'image' },
  'audio': { label: '音频', icon: 'volume-2' },
  'video': { label: '视频', icon: 'video' },
  'code': { label: '代码', icon: 'code' },
  'music': { label: '音乐', icon: 'music' },
  'voice': { label: '语音', icon: 'mic' },
  '3d': { label: '3D 模型', icon: 'box' },
  'data': { label: '数据', icon: 'database' }
};

const AI_MODELS_PRESET = {
  'gpt-4': { name: 'GPT-4', company: 'OpenAI' },
  'gpt-4o': { name: 'GPT-4o', company: 'OpenAI' },
  'gpt-3.5': { name: 'GPT-3.5', company: 'OpenAI' },
  'chatgpt': { name: 'ChatGPT', company: 'OpenAI' },
  'dall-e': { name: 'DALL·E', company: 'OpenAI' },
  'dall-e-3': { name: 'DALL·E 3', company: 'OpenAI' },
  'whisper': { name: 'Whisper', company: 'OpenAI' },
  'sora': { name: 'Sora', company: 'OpenAI' },
  'claude': { name: 'Claude', company: 'Anthropic' },
  'claude-3': { name: 'Claude 3', company: 'Anthropic' },
  'claude-3.5': { name: 'Claude 3.5', company: 'Anthropic' },
  'claude-4': { name: 'Claude 4', company: 'Anthropic' },
  'gemini': { name: 'Gemini', company: 'Google' },
  'gemini-pro': { name: 'Gemini Pro', company: 'Google' },
  'imagen': { name: 'Imagen', company: 'Google' },
  'llama': { name: 'LLaMA', company: 'Meta' },
  'llama-3': { name: 'LLaMA 3', company: 'Meta' },
  'midjourney': { name: 'Midjourney', company: 'Midjourney' },
  'stable-diffusion': { name: 'Stable Diffusion', company: 'Stability AI' },
  'sdxl': { name: 'SDXL', company: 'Stability AI' },
  'flux': { name: 'Flux', company: 'Black Forest Labs' },
  'firefly': { name: 'Firefly', company: 'Adobe' },
  'elevenlabs': { name: 'ElevenLabs', company: 'ElevenLabs' },
  'suno': { name: 'Suno', company: 'Suno' },
  'udio': { name: 'Udio', company: 'Udio' },
  'runway': { name: 'Runway', company: 'Runway' },
  'pika': { name: 'Pika', company: 'Pika Labs' },
  'kling': { name: 'Kling', company: 'Kuaishou' },
  'qwen': { name: '通义千问', company: '阿里巴巴' },
  'ernie': { name: '文心一言', company: '百度' },
  'doubao': { name: '豆包', company: '字节跳动' },
  'deepseek': { name: 'DeepSeek', company: 'DeepSeek' },
  'kimi': { name: 'Kimi', company: 'Moonshot AI' },
  'glm': { name: 'GLM', company: '智谱 AI' }
};

// ================================================================
// 许可证配置（详细版）
// ================================================================

const LICENSES = {
  // ==================== Creative Commons ====================
  'cc0': {
    category: 'cc',
    name: 'CC0 1.0',
    fullName: 'CC0 1.0 通用公有领域贡献',
    description: '在法律允许的范围内，作者已放弃对本作品的所有著作权及相关权利，将其贡献至公有领域。您可以复制、修改、分发和表演本作品，甚至用于商业目的，都无需征得同意。',
    detail: 'CC0 是知识共享组织提供的一种工具，允许创作者在法律允许的最大范围内放弃其作品的所有著作权和相关权利。使用 CC0 的作品在全球范围内尽可能接近公有领域状态。这意味着任何人都可以自由地使用、修改和分发该作品，包括商业用途，而无需署名或获得许可。CC0 解决了不同司法管辖区之间著作权法差异的问题，为希望完全放弃权利的创作者提供了一种可靠的法律工具。',
    url: 'https://creativecommons.org/publicdomain/zero/1.0/deed.zh-hans',
    badges: ['zero'],
    permissions: ['share', 'adapt', 'commercial', 'no-attribution'],
    conditions: [],
    color: 'gray'
  },
  'cc-by': {
    category: 'cc',
    name: 'CC BY 4.0',
    fullName: '知识共享 署名 4.0 国际许可协议',
    description: '您可以自由地共享和演绎本作品，将其用于任何目的，包括商业目的。唯一的条件是您必须给出适当的署名，提供指向本许可协议的链接，并指出是否对原始作品作了修改。',
    detail: 'CC BY 是知识共享许可协议中最宽松的一种。它允许他人分发、混编、调整和基于您的作品进行创作，即使是出于商业目的，只要他们注明您的原创身份。这是推荐用于最大程度传播和使用被许可材料的许可协议。所有基于您作品的新作品都将使用相同的许可协议，因此任何衍生作品在理论上也允许商业使用。',
    url: 'https://creativecommons.org/licenses/by/4.0/deed.zh-hans',
    badges: ['by'],
    permissions: ['share', 'adapt', 'commercial'],
    conditions: ['attribution'],
    color: 'green'
  },
  'cc-by-sa': {
    category: 'cc',
    name: 'CC BY-SA 4.0',
    fullName: '知识共享 署名-相同方式共享 4.0 国际许可协议',
    description: '您可以自由地共享和演绎本作品，将其用于任何目的，包括商业目的。但您必须给出适当的署名，并且如果您对本作品进行了修改，您必须以相同的许可协议分发您的修改版本。',
    detail: 'CC BY-SA 是一种"著佐权"（Copyleft）许可协议，类似于自由和开源软件许可证。基于本作品的任何新作品都必须采用相同的许可协议，这意味着衍生作品也将允许商业使用和进一步的修改。维基百科和许多其他维基媒体项目使用此许可协议。如果您混编、转换或基于本作品进行创作，您必须以与原始作品相同的许可协议分发您贡献的作品。',
    url: 'https://creativecommons.org/licenses/by-sa/4.0/deed.zh-hans',
    badges: ['by', 'sa'],
    permissions: ['share', 'adapt', 'commercial'],
    conditions: ['attribution', 'sharealike'],
    color: 'green'
  },
  'cc-by-nc': {
    category: 'cc',
    name: 'CC BY-NC 4.0',
    fullName: '知识共享 署名-非商业性使用 4.0 国际许可协议',
    description: '您可以自由地共享和演绎本作品，但仅限于非商业目的。您必须给出适当的署名，提供指向本许可协议的链接，并指出是否对原始作品作了修改。您不得将本作品用于商业目的。',
    detail: 'CC BY-NC 允许他人对您的作品进行再混合、调整和在此基础上进行创作以用于非商业目的。虽然他们的新作品也必须承认您的贡献并且是非商业性的，但他们不必以相同的条款许可其衍生作品。"非商业"意味着该材料不得主要用于或针对商业利益或金钱补偿。请注意，对于什么构成"商业"使用可能存在灰色地带，建议在不确定的情况下联系权利人。',
    url: 'https://creativecommons.org/licenses/by-nc/4.0/deed.zh-hans',
    badges: ['by', 'nc'],
    permissions: ['share', 'adapt'],
    conditions: ['attribution', 'noncommercial'],
    color: 'yellow'
  },
  'cc-by-nc-sa': {
    category: 'cc',
    name: 'CC BY-NC-SA 4.0',
    fullName: '知识共享 署名-非商业性使用-相同方式共享 4.0 国际许可协议',
    description: '您可以自由地共享和演绎本作品，但仅限于非商业目的，并且如果您对本作品进行了修改，您必须以相同的许可协议分发您的修改版本，同时必须给出适当的署名。',
    detail: 'CC BY-NC-SA 结合了非商业限制和相同方式共享要求。它允许他人对您的作品进行再混合、调整和在此基础上进行非商业性创作，只要他们注明您的贡献并以相同的条款许可其新创作。这是一种相对严格的许可协议，既限制了商业使用，又要求衍生作品采用相同的许可条款，确保知识的开放传播链条不被中断。',
    url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh-hans',
    badges: ['by', 'nc', 'sa'],
    permissions: ['share', 'adapt'],
    conditions: ['attribution', 'noncommercial', 'sharealike'],
    color: 'yellow'
  },
  'cc-by-nd': {
    category: 'cc',
    name: 'CC BY-ND 4.0',
    fullName: '知识共享 署名-禁止演绎 4.0 国际许可协议',
    description: '您可以自由地共享本作品，将其用于任何目的，包括商业目的。但您必须给出适当的署名，并且不得对本作品进行任何修改、转换或在其基础上进行创作。',
    detail: 'CC BY-ND 允许再分发，无论是商业性的还是非商业性的，只要作品完整地传递且未作修改，并注明您的贡献。此许可协议保护作品的完整性——如果您不希望他人修改您的作品，但仍希望它被广泛传播，这是一个合适的选择。请注意，这意味着任何翻译、改编或基于您作品的混合创作都是不允许的。',
    url: 'https://creativecommons.org/licenses/by-nd/4.0/deed.zh-hans',
    badges: ['by', 'nd'],
    permissions: ['share', 'commercial'],
    conditions: ['attribution', 'noderivatives'],
    color: 'orange'
  },
  'cc-by-nc-nd': {
    category: 'cc',
    name: 'CC BY-NC-ND 4.0',
    fullName: '知识共享 署名-非商业性使用-禁止演绎 4.0 国际许可协议',
    description: '您可以自由地共享本作品，但仅限于非商业目的。您必须给出适当的署名，且不得对本作品进行任何修改。这是知识共享许可协议中限制最严格的一种。',
    detail: 'CC BY-NC-ND 是六种主要知识共享许可协议中限制最严格的一种。它只允许他人下载您的作品并与他人共享，但前提是他们必须注明您的贡献，不得以任何方式更改作品或将其用于商业目的。此许可协议适用于希望作品被广泛阅读但不希望被修改或商业使用的创作者。由于其限制性，基于此许可协议的作品不被认为符合"自由文化作品"的定义。',
    url: 'https://creativecommons.org/licenses/by-nc-nd/4.0/deed.zh-hans',
    badges: ['by', 'nc', 'nd'],
    permissions: ['share'],
    conditions: ['attribution', 'noncommercial', 'noderivatives'],
    color: 'red'
  },

  // ==================== 公有领域 (Public Domain) ====================
  'pd': {
    category: 'pd',
    name: '公有领域',
    fullName: '公有领域',
    description: '此作品属于公有领域，不受著作权法保护，任何人都可以自由使用、修改和分发，无需征得许可或支付费用，包括商业用途。',
    detail: '公有领域（Public Domain）是指不受知识产权法（尤其是著作权法）保护的创作作品和知识。当作品进入公有领域后，它就成为人类共同的文化遗产，任何人都可以自由地使用、复制、修改和分发，无需获得许可或支付版税。作品可能因为多种原因进入公有领域：著作权保护期届满、著作权人主动放弃权利、作品不符合著作权保护的条件、或者法律明确规定某些类型的作品不受保护。',
    badges: ['pd'],
    permissions: ['share', 'adapt', 'commercial', 'no-attribution'],
    conditions: [],
    color: 'gray'
  },
  'pd-old': {
    category: 'pd',
    name: '公有领域（著作权过期）',
    fullName: '公有领域 - 著作权保护期届满',
    description: '此作品的著作权保护期已届满。根据作者所在国家或作品发表地的法律，该作品的著作权保护期限已经结束，现已进入公有领域，可被自由使用。',
    detail: '著作权保护是有时间限制的。当保护期限届满后，作品就进入公有领域。不同国家和地区的著作权保护期限各不相同：大多数国家采用作者终身加死后 50 年或 70 年的标准。例如，欧盟、美国（1978 年后的作品）采用作者终身加 70 年；中国大陆、日本采用作者终身加 50 年。对于匿名作品、假名作品或法人作品，保护期限通常从作品首次发表之日起计算。判断一件作品是否因著作权过期而进入公有领域，需要考虑作者的去世日期、作品的发表日期以及适用的法律。',
    badges: ['pd'],
    permissions: ['share', 'adapt', 'commercial', 'no-attribution'],
    conditions: [],
    color: 'gray'
  },
  'pd-old-70': {
    category: 'pd',
    name: '公有领域（作者逝世逾 70 年）',
    fullName: '公有领域 - 作者去世已超过 70 年',
    description: '此作品的作者去世已超过 70 年，根据大多数采用"作者终身加 70 年"著作权保护期限的国家和地区（包括欧盟、美国等）的法律，该作品已进入公有领域。',
    detail: '根据《保护文学和艺术作品伯尔尼公约》的规定，著作权保护期限的最低标准是作者终身加死后 50 年。然而，许多国家和地区已将这一期限延长至作者终身加 70 年，包括：欧盟所有成员国（根据 1993 年的《著作权期限指令》）、美国（1998 年《著作权期限延长法》，又称"桑尼·波诺法"）、澳大利亚、巴西、以色列、俄罗斯、土耳其等。如果作者去世已超过 70 年，其作品在这些国家和地区已进入公有领域。但请注意，在著作权保护期较短的国家（如中国大陆的 50 年），作品可能更早进入公有领域；而在某些国家（如墨西哥的 100 年），作品可能仍受保护。',
    badges: ['pd'],
    permissions: ['share', 'adapt', 'commercial', 'no-attribution'],
    conditions: [],
    color: 'gray'
  },
  'pd-old-50': {
    category: 'pd',
    name: '公有领域（作者逝世逾 50 年）',
    fullName: '公有领域 - 作者去世已超过 50 年',
    description: '此作品的作者去世已超过 50 年，根据采用"作者终身加 50 年"著作权保护期限的国家和地区（包括中国大陆、日本、加拿大等）的法律，该作品已进入公有领域。',
    detail: '《保护文学和艺术作品伯尔尼公约》规定的著作权保护最低期限是作者终身加死后 50 年。许多国家和地区仍然采用这一标准，包括：中国大陆（《中华人民共和国著作权法》）、日本、加拿大、新西兰、韩国、南非等。根据中国大陆《著作权法》第二十三条的规定，公民的作品，其发表权和财产权的保护期为作者终生及其死亡后五十年，截止于作者死亡后第五十年的 12 月 31 日。但请注意，此类作品在采用更长保护期的国家（如欧盟的 70 年）可能仍受著作权保护，在使用时需考虑您所在地区的法律。',
    badges: ['pd'],
    permissions: ['share', 'adapt', 'commercial', 'no-attribution'],
    conditions: [],
    color: 'gray'
  },
  'pd-old-100': {
    category: 'pd',
    name: '公有领域（作者逝世逾 100 年）',
    fullName: '公有领域 - 作者去世已超过 100 年',
    description: '此作品的作者去世已超过 100 年。无论在世界上哪个国家或地区，该作品几乎肯定已进入公有领域，因为没有任何国家的著作权保护期限超过作者终身加 100 年。',
    detail: '当作者去世已超过 100 年时，其作品在全球范围内几乎可以确定已进入公有领域。即使是著作权保护期限最长的墨西哥（作者终身加 100 年），这类作品也已不受保护。这意味着您可以在世界任何地方自由使用这些作品，无需担心著作权问题。许多古典文学、艺术和音乐作品都属于此类，例如莎士比亚、贝多芬、莫扎特、达·芬奇等人的作品。但请注意，对这些公有领域作品的新版本（如新的翻译、编辑、注释或演奏录音）可能产生新的著作权保护。',
    badges: ['pd'],
    permissions: ['share', 'adapt', 'commercial', 'no-attribution'],
    conditions: [],
    color: 'gray'
  },
  'pd-us': {
    category: 'pd',
    name: '公有领域（美国联邦政府作品）',
    fullName: '公有领域 - 美国联邦政府作品',
    description: '此作品由美国联邦政府雇员在其职责范围内创作，根据《美国法典》第 17 编第 105 条的规定，不受美国著作权法保护，在美国属于公有领域。',
    detail: '根据《美国法典》第 17 编第 105 条（17 U.S.C. § 105），美国联邦政府雇员在其职责范围内创作的作品不受美国国内的著作权保护。这包括由美国国会、联邦法院、联邦行政机构（如 NASA、NOAA、CDC、FDA 等）的雇员创作的文件、报告、照片、数据等。但请注意以下几点：（1）这一规定仅适用于美国联邦政府，不适用于州政府或地方政府；（2）联邦政府可以持有通过转让或遗赠获得的著作权；（3）联邦政府可能使用受著作权保护的第三方作品；（4）在美国以外的国家，这些作品可能仍受当地著作权法保护。美国之音（VOA）的作品是一个特例，其作品在全球范围内都属于公有领域。',
    badges: ['pd'],
    permissions: ['share', 'adapt', 'commercial', 'no-attribution'],
    conditions: ['us-pd-only'],
    color: 'gray'
  },
  'pd-us-1929': {
    category: 'pd',
    name: '公有领域（1929 年前在美国发表）',
    fullName: '公有领域 - 1929 年 1 月 1 日前在美国发表',
    description: '此作品于 1929 年 1 月 1 日之前在美国发表。根据美国著作权法，该作品的著作权保护期已届满，现已在美国进入公有领域。',
    detail: '在美国，1929 年 1 月 1 日之前发表的所有作品现已处于公有领域。这是因为美国著作权法经历了多次修订，但最长的著作权保护期限（发表后 95 年）意味着 1929 年之前发表的作品的保护期已全部届满。自 2024 年 1 月 1 日起，1928 年及更早发表的作品进入公有领域。每年的 1 月 1 日，又一年的作品会进入公有领域（例如，2025 年 1 月 1 日起，1929 年发表的作品进入公有领域）。这被称为"公有领域日"（Public Domain Day）。请注意，在美国以外首次发表的作品可能受到不同规则的约束，特别是《乌拉圭回合协定法》（URAA）可能会恢复某些外国作品在美国的著作权。',
    badges: ['pd'],
    permissions: ['share', 'adapt', 'commercial', 'no-attribution'],
    conditions: ['us-pd-only'],
    color: 'gray'
  },
  'pd-cn': {
    category: 'pd',
    name: '公有领域（中国著作权法）',
    fullName: '公有领域 - 根据《中华人民共和国著作权法》',
    description: '此作品根据《中华人民共和国著作权法》的规定，不受著作权保护或著作权保护期已届满，在中国大陆属于公有领域。',
    detail: '根据《中华人民共和国著作权法》第五条，以下内容不适用著作权法保护：（一）法律、法规，国家机关的决议、决定、命令和其他具有立法、行政、司法性质的文件，及其官方正式译文；（二）单纯事实消息；（三）历法、通用数表、通用表格和公式。此外，根据第二十三条，自然人的作品著作权保护期为作者终生及其死亡后五十年；法人或其他组织的作品、著作权由法人或其他组织享有的职务作品，其著作权保护期为五十年。这些期限届满后，作品进入公有领域。请注意，台湾地区适用《中华民国著作权法》，香港和澳门地区有各自的著作权法规，保护期限可能不同。',
    badges: ['pd'],
    permissions: ['share', 'adapt', 'commercial', 'no-attribution'],
    conditions: ['cn-pd-only'],
    color: 'gray'
  },
  'pd-gov': {
    category: 'pd',
    name: '公有领域（政府官方文件）',
    fullName: '公有领域 - 政府官方文件',
    description: '此作品属于政府官方文件，如法律、法规、司法判决、行政命令等，根据许多国家的著作权法规定，此类官方文件不受著作权保护或保护受到限制，属于公有领域。',
    detail: '许多国家的著作权法明确规定，政府官方文件不受著作权保护或保护受到限制。根据《中华人民共和国著作权法》第五条第一项，法律、法规，国家机关的决议、决定、命令和其他具有立法、行政、司法性质的文件，及其官方正式译文，不适用著作权法保护。类似的规定存在于许多其他国家的法律中。日本《著作权法》第 13 条规定，法令、判决、通知等官方文件不受著作权保护。然而，并非所有国家都有此规定——例如英国的政府作品受"皇室版权"（Crown Copyright）保护。在使用政府文件时，应查阅相关国家的具体法律规定。',
    badges: ['pd'],
    permissions: ['share', 'adapt', 'commercial', 'no-attribution'],
    conditions: [],
    color: 'gray'
  },
  'pd-self': {
    category: 'pd',
    name: '公有领域（作者贡献）',
    fullName: '公有领域 - 著作权人自愿贡献',
    description: '此作品的著作权持有人已通过明确的法律声明，自愿放弃对本作品的所有著作权及相关权利，将其贡献至公有领域，供公众自由使用。',
    detail: '著作权持有人可以选择自愿将其作品贡献至公有领域，放弃其著作权及相关权利。这种放弃通常通过明确的书面声明或使用特定的法律工具（如 CC0 公有领域贡献工具）来实现。一旦作品被有效地贡献至公有领域，著作权人就不能撤回这一决定，作品将永久处于公有领域状态。请注意，在某些国家（特别是大陆法系国家），著作人格权（如署名权、保护作品完整权）可能无法完全放弃。在这些情况下，使用 CC0 等工具可以在法律允许的最大范围内放弃权利，并对无法放弃的权利提供广泛的许可。',
    badges: ['pd'],
    permissions: ['share', 'adapt', 'commercial', 'no-attribution'],
    conditions: [],
    color: 'gray'
  },
  'pd-release': {
    category: 'pd',
    name: '公有领域（版权释出）',
    fullName: '公有领域 - 版权所有者明确释出',
    description: '此作品的版权所有者已通过正式声明或授权，明确将该作品释出至公有领域，允许任何人自由使用、修改和分发，不受任何限制。',
    detail: '与"作者贡献"类似，"版权释出"指的是版权所有者（可能是作者本人，也可能是通过转让或继承获得版权的其他人或机构）主动将作品释放到公有领域。这种释出应当有明确的书面记录，例如在作品上标注"Released to the public domain"或类似声明，或者使用 CC0、Unlicense 等法律工具。组织和机构也可能将其拥有版权的作品释出至公有领域，例如某些博物馆将其馆藏艺术品的高分辨率图像释出供公众使用。在使用此类作品时，最好保留对原始释出声明的引用，以便他人验证作品的公有领域状态。',
    badges: ['pd'],
    permissions: ['share', 'adapt', 'commercial', 'no-attribution'],
    conditions: [],
    color: 'gray'
  },
  'pd-simple': {
    category: 'pd',
    name: '公有领域（简单作品）',
    fullName: '公有领域 - 不符合著作权保护的独创性要求',
    description: '此作品因过于简单，不具备著作权法所要求的"独创性"，不符合著作权保护的条件，自始就属于公有领域。这包括简单的几何图形、基本形状、普通字体文字等。',
    detail: '著作权法只保护具有一定"独创性"（originality）的作品。如果一件作品过于简单或平凡，缺乏最低限度的创造性，它就不符合著作权保护的条件，自始就属于公有领域。不同国家对独创性的要求有所不同：美国采用较低的"独立创作加最低创造性"标准（Feist 案确立）；而英国等采用"辛勤原则"（sweat of the brow）的国家可能对简单作品提供更多保护。通常被认为不符合独创性要求的作品包括：简单的几何形状（圆形、三角形、矩形等）、单一颜色、基本的排版设计、常见的符号和图标、简短的标题或短语、简单的图表等。',
    badges: ['pd'],
    permissions: ['share', 'adapt', 'commercial', 'no-attribution'],
    conditions: [],
    color: 'gray'
  },
  'pd-logo': {
    category: 'pd',
    name: '公有领域（简单标志）',
    fullName: '公有领域 - 简单标志',
    description: '此标志仅包含简单的文字、几何形状或基本设计元素，不具备著作权法所要求的独创性，因此不受著作权保护。但请注意，该标志可能仍受商标法保护。',
    detail: '许多商业标志（logo）由于设计过于简单，仅包含基本的文字、几何形状或广泛使用的设计元素，不符合著作权保护的独创性要求。根据美国版权局的规定，仅由"字母、文字、颜色或文字的排版装饰"组成的设计通常不能注册著作权。类似的标准也适用于其他国家。然而，重要的是要区分著作权和商标权：即使一个标志不受著作权保护，它仍可能作为商标受到保护。商标法保护的是标志作为商品或服务来源标识的功能，与著作权法保护创意表达的目的不同。因此，在使用此类标志时，虽然不涉及著作权问题，但仍需注意避免商标侵权或造成消费者混淆。',
    badges: ['pd'],
    permissions: ['share', 'adapt', 'commercial', 'no-attribution'],
    conditions: ['trademark-may-apply'],
    color: 'gray'
  },
  'pd-text': {
    category: 'pd',
    name: '公有领域（简单文字）',
    fullName: '公有领域 - 简单文字或短语',
    description: '此作品仅包含简单的文字、短语、标语或常用表达，不具备著作权法所要求的独创性，不受著作权保护，属于公有领域。',
    detail: '简短的文字、短语、标语、口号通常不受著作权保护，因为它们缺乏足够的独创性。根据美国版权局《实践手册》（Compendium of U.S. Copyright Office Practices）的规定，"文字和短语，如名称、标题、口号"通常不能注册著作权。类似的原则也适用于其他国家。但请注意以下几点：（1）简短的诗歌或歌词片段可能因其高度的创造性而受到保护；（2）某些标语可能作为商标受到保护；（3）大量简短文字的特定排列组合可能构成可保护的编辑作品。一般而言，越长、越具有创造性的文字越可能受到著作权保护。',
    badges: ['pd'],
    permissions: ['share', 'adapt', 'commercial', 'no-attribution'],
    conditions: [],
    color: 'gray'
  },
  'pd-shape': {
    category: 'pd',
    name: '公有领域（几何形状）',
    fullName: '公有领域 - 简单几何形状',
    description: '此图像仅包含简单的几何形状（如圆形、三角形、矩形等），不具备著作权法所要求的独创性，不受著作权保护，属于公有领域。',
    detail: '基本的几何形状——圆形、三角形、正方形、矩形、直线等——被认为是公共领域中的基本元素，任何人都可以自由使用。这些形状过于普遍和基础，缺乏著作权法要求的独创性。美国版权局明确指出，"熟悉的符号或设计"和"简单的几何形状"不能注册著作权。然而，几何形状的特定创意组合、排列或与其他元素的结合可能具有足够的独创性而受到保护。例如，一个由简单圆形和三角形组成的复杂、独特的抽象设计可能受到保护，但单独的圆形或三角形则不会。',
    badges: ['pd'],
    permissions: ['share', 'adapt', 'commercial', 'no-attribution'],
    conditions: [],
    color: 'gray'
  },
  'pd-chem': {
    category: 'pd',
    name: '公有领域（化学结构式）',
    fullName: '公有领域 - 化学结构式',
    description: '此图像是使用标准化学符号和惯例绘制的化学结构式，属于对科学事实的常规表达方式，不具备著作权法所要求的独创性，不受著作权保护。',
    detail: '化学结构式是表示化学物质分子结构的标准图形表示法，使用国际纯粹与应用化学联合会（IUPAC）等组织制定的统一符号和规则。由于化学结构式是对客观科学事实的标准化表达，而非创作者的独创性表达，因此不符合著作权保护的条件。就像数学公式、物理定律的表达一样，化学结构式属于公共领域，任何人都可以自由使用。但请注意，如果化学结构式的呈现方式具有额外的创意元素（如独特的艺术设计、颜色方案、三维渲染等），这些额外元素可能具有独立的著作权。',
    badges: ['pd'],
    permissions: ['share', 'adapt', 'commercial', 'no-attribution'],
    conditions: [],
    color: 'gray'
  },
  'pd-art': {
    category: 'pd',
    name: '公有领域（艺术品复制）',
    fullName: '公有领域 - 公有领域二维艺术品的忠实复制',
    description: '此图像是对已处于公有领域的二维艺术作品（如绘画）的忠实摄影复制。由于该复制品旨在准确再现原作，不包含新的创作性元素，因此其本身也属于公有领域。',
    detail: '当一件二维艺术作品（如绘画、版画、手稿等）进入公有领域后，对该作品的忠实摄影复制是否产生新的著作权，各国法律和法院有不同的立场。在美国，根据 1999 年 Bridgeman Art Library v. Corel Corp. 案的判决，对公有领域二维艺术品的忠实复制不产生新的著作权，因为这种复制缺乏独创性——摄影师的目标是尽可能准确地再现原作，而非创作新的艺术作品。维基共享资源采用了这一立场。然而，在英国等采用"辛勤原则"的国家，此类复制可能仍受保护。此外，对三维艺术品的摄影涉及角度、光线等选择，可能具有独立的著作权。博物馆和图书馆可能通过合同条款限制其馆藏图像的使用，即使这些图像在著作权法下属于公有领域。',
    badges: ['pd'],
    permissions: ['share', 'adapt', 'commercial', 'no-attribution'],
    conditions: ['may-vary-by-jurisdiction'],
    color: 'gray'
  },
  'pd-ineligible': {
    category: 'pd',
    name: '公有领域（不适用著作权）',
    fullName: '公有领域 - 不适用著作权保护',
    description: '此作品属于著作权法明确排除保护的类型，如历法、通用数表、通用公式、单纯的事实信息等，自始就不受著作权保护，属于公有领域。',
    detail: '著作权法保护的是具有独创性的"表达"，而非"思想"或"事实"本身。许多国家的著作权法明确列出了不受保护的内容类型。根据《中华人民共和国著作权法》第五条，以下内容不适用著作权法保护：法律法规和官方文件、单纯事实消息、历法、通用数表、通用表格和公式。类似地，数学公式、科学定律、自然法则、历史事实、统计数据等都属于公共领域，任何人都可以自由使用。但请注意，对这些事实或数据的特定创意表达、编排或呈现方式可能受到保护。例如，一个物理公式本身不受保护，但一本以独特方式解释该公式的教科书可能受到保护。',
    badges: ['pd'],
    permissions: ['share', 'adapt', 'commercial', 'no-attribution'],
    conditions: [],
    color: 'gray'
  },
  'pd-font': {
    category: 'pd',
    name: '公有领域（字体）',
    fullName: '公有领域 - 字体设计',
    description: '在某些司法管辖区（如美国），字体设计本身不受著作权保护，属于公有领域。但字体软件（字体文件）可能作为计算机程序受到保护。',
    detail: '字体设计的著作权保护在不同国家有很大差异。在美国，字体设计本身（字形的视觉外观）传统上不受著作权保护，因为它们被视为实用物品。美国版权局的立场是："字体设计，即一组用于打印或显示的字母、数字和其他符号的特定样式，不受著作权保护。"然而，字体软件（如 TrueType 或 OpenType 字体文件）作为计算机程序可能受到著作权保护。在欧盟，根据 1998 年的《外观设计指令》，字体可以作为外观设计受到保护。在中国大陆，字体设计的可保护性一直存在争议，法院在不同案件中有不同的判决。在使用字体时，除了著作权问题外，还需注意字体的许可协议可能施加的使用限制。',
    badges: ['pd'],
    permissions: ['share', 'adapt', 'commercial', 'no-attribution'],
    conditions: ['may-vary-by-jurisdiction', 'font-file-may-be-protected'],
    color: 'gray'
  },
  'pd-scan': {
    category: 'pd',
    name: '公有领域（扫描件）',
    fullName: '公有领域 - 公有领域作品的扫描件',
    description: '此文件是对已处于公有领域的印刷品或文档的扫描件。由于原始作品已在公有领域，且扫描过程未增加新的创作性元素，因此该扫描件也属于公有领域。',
    detail: '对公有领域印刷材料的扫描是否产生新的著作权，取决于扫描过程是否涉及创造性选择。纯粹的机械复制——旨在尽可能准确地再现原始文档——通常不产生新的著作权，因为扫描者没有做出任何创造性的决定。这与对公有领域二维艺术品的忠实摄影复制的情况类似。然而，如果扫描过程中涉及了创造性的选择（如对褪色文档进行色彩修复、对破损部分进行修复重建等），这些额外的创造性工作可能产生新的著作权。在使用此类扫描件时，最好了解扫描的来源和扫描者的意图，以判断是否存在额外的著作权主张。',
    badges: ['pd'],
    permissions: ['share', 'adapt', 'commercial', 'no-attribution'],
    conditions: [],
    color: 'gray'
  },

  // ==================== GNU 许可 ====================
  'gfdl': {
    category: 'gnu',
    name: 'GFDL',
    fullName: 'GNU 自由文档许可证（GNU Free Documentation License）',
    description: '此作品采用 GNU 自由文档许可证发布。您可以自由复制、修改和分发此作品及其衍生作品，但必须以相同的许可证发布衍生作品，并在分发时附带完整的许可证文本。',
    detail: 'GNU 自由文档许可证（GFDL）是由自由软件基金会（FSF）为 GNU 项目制定的著佐权（copyleft）许可证，主要用于软件文档、教科书和其他参考材料。GFDL 的核心特点是：允许任何人复制、修改和分发作品；要求衍生作品也必须以 GFDL 发布（相同方式共享）；分发时必须附带许可证的完整文本。维基百科在 2009 年之前主要使用 GFDL 作为其内容许可证。GFDL 的一个特殊之处是允许指定"不变章节"（Invariant Sections）、"封面文字"和"封底文字"，但维基百科不使用这些特性。由于 GFDL 要求在任何副本中附带完整的许可证文本（约 4000 字），这使得它在打印单页文档或图像时显得不太实用。因此，许多项目（包括维基百科）后来转向了更简洁的 CC BY-SA 许可证。',
    url: 'https://www.gnu.org/licenses/fdl-1.3.html',
    badges: ['gnu'],
    permissions: ['share', 'adapt', 'commercial'],
    conditions: ['attribution', 'sharealike', 'copyleft', 'include-license'],
    color: 'blue'
  },
  'gpl': {
    category: 'gnu',
    name: 'GPL 3.0',
    fullName: 'GNU 通用公共许可证第 3 版（GNU General Public License v3.0）',
    description: '此作品采用 GNU 通用公共许可证第 3 版发布。您可以自由使用、修改和分发此作品，但衍生作品必须以相同的许可证发布，并且必须提供源代码。',
    detail: 'GNU 通用公共许可证（GPL）是世界上最广泛使用的自由软件许可证，由理查德·斯托曼（Richard Stallman）为 GNU 项目创建。GPL 是一种著佐权（copyleft）许可证，其核心理念是确保软件的自由能够传递给所有用户。GPL 的主要特点包括：赋予用户运行、学习、共享和修改软件的自由；要求衍生作品也必须以 GPL 发布；要求分发时必须提供或允许访问源代码；第 3 版增加了对专利和 DRM 的保护条款。Linux 内核、GCC 编译器、GIMP 图像编辑器等著名软件都采用 GPL 许可证。需要注意的是，GPL 具有"传染性"——如果您在自己的作品中使用了 GPL 许可的代码，整个作品通常也必须以 GPL 发布。',
    url: 'https://www.gnu.org/licenses/gpl-3.0.html',
    badges: ['gnu'],
    permissions: ['share', 'adapt', 'commercial'],
    conditions: ['attribution', 'sharealike', 'copyleft', 'disclose-source'],
    color: 'blue'
  },
  'gpl-2': {
    category: 'gnu',
    name: 'GPL 2.0',
    fullName: 'GNU 通用公共许可证第 2 版（GNU General Public License v2.0）',
    description: '此作品采用 GNU 通用公共许可证第 2 版发布。这是 GPL 的早期版本，仍被许多重要项目使用，包括 Linux 内核。',
    detail: 'GPL 第 2 版发布于 1991 年，是 GPL 许可证家族中使用时间最长、影响最广泛的版本之一。许多重要的开源项目至今仍使用 GPL-2.0，最著名的是 Linux 内核——Linus Torvalds 选择 GPL-2.0 并明确表示不会升级到 GPL-3.0。与 GPL-3.0 相比，GPL-2.0 不包含对专利授权和"Tivoization"（硬件限制）的明确条款，这既是它的局限性，也是某些项目选择它的原因（因为条款更简单）。许多项目采用"GPL-2.0 或更高版本"（GPL-2.0-or-later）的方式发布，允许用户选择适用的 GPL 版本。',
    url: 'https://www.gnu.org/licenses/old-licenses/gpl-2.0.html',
    badges: ['gnu'],
    permissions: ['share', 'adapt', 'commercial'],
    conditions: ['attribution', 'sharealike', 'copyleft', 'disclose-source'],
    color: 'blue'
  },
  'lgpl': {
    category: 'gnu',
    name: 'LGPL',
    fullName: 'GNU 宽通用公共许可证（GNU Lesser General Public License）',
    description: '此作品采用 GNU 宽通用公共许可证发布。这是一种"弱著佐权"许可证，允许在专有软件中链接使用 LGPL 许可的库，而不要求整个程序必须以 LGPL 发布。',
    detail: 'LGPL 最初被称为"GNU 库通用公共许可证"（GNU Library GPL），后改名为"宽通用公共许可证"（Lesser GPL），以更准确地反映其用途——它并不仅仅适用于库。LGPL 的核心特点是：允许专有软件链接（调用）LGPL 许可的库，而不会使整个专有软件受到 copyleft 条款的约束；但对 LGPL 库本身的修改必须以 LGPL 发布。这种设计使得 LGPL 特别适合那些希望被广泛采用的库（如 GNU C 库 glibc），因为它允许商业软件使用这些库而不必公开其自身的源代码。选择 LGPL 还是 GPL 是一个战略决定：GPL 更有利于推动自由软件生态系统，而 LGPL 更有利于库的广泛采用。',
    url: 'https://www.gnu.org/licenses/lgpl-3.0.html',
    badges: ['gnu'],
    permissions: ['share', 'adapt', 'commercial'],
    conditions: ['attribution', 'sharealike-library', 'copyleft'],
    color: 'blue'
  },
  'agpl': {
    category: 'gnu',
    name: 'AGPL 3.0',
    fullName: 'GNU Affero 通用公共许可证第 3 版（GNU Affero General Public License v3.0）',
    description: '此作品采用 GNU Affero 通用公共许可证发布。这是 GPL 的加强版，要求通过网络提供服务的应用也必须公开其源代码，即使该软件没有被"分发"。',
    detail: 'AGPL 是为了解决 GPL 在网络时代的一个"漏洞"而创建的。在 GPL 下，只有当您分发软件时才需要提供源代码；但如果您只是在服务器上运行 GPL 软件为用户提供网络服务（如 SaaS 应用），则不算"分发"，因此不需要公开源代码。AGPL 通过增加一个条款解决了这个问题：如果您修改了 AGPL 软件并通过网络向用户提供服务，您必须向这些用户提供获取修改后源代码的途径。这使得 AGPL 特别适合那些可能被用于 Web 服务的软件。著名的使用 AGPL 的项目包括 Nextcloud（云存储）、Mastodon（社交网络）、MongoDB（在某段时间内）等。',
    url: 'https://www.gnu.org/licenses/agpl-3.0.html',
    badges: ['gnu'],
    permissions: ['share', 'adapt', 'commercial'],
    conditions: ['attribution', 'sharealike', 'copyleft', 'disclose-source', 'network-use'],
    color: 'blue'
  },

  // ==================== 开源许可 ====================
  'mit': {
    category: 'oss',
    name: 'MIT',
    fullName: 'MIT 许可证（MIT License）',
    description: '此作品采用 MIT 许可证发布。这是一种非常宽松的开源许可证，允许任何人自由使用、复制、修改、合并、出版、分发、再许可和/或销售本软件，唯一的条件是在所有副本中保留版权声明和许可声明。',
    detail: 'MIT 许可证（也称为 X11 许可证或 Expat 许可证）是最简洁、最宽松的开源许可证之一，起源于麻省理工学院。它的全文只有约 170 个英文单词，核心条款非常简单：允许任何人免费使用该软件，包括商业用途；允许修改、合并、发布、分发、再许可；唯一的要求是在软件的所有副本中保留版权声明和许可声明；软件按"原样"提供，不提供任何形式的担保。MIT 许可证与 GPL 兼容，因此 MIT 许可的代码可以被纳入 GPL 项目中。许多著名的开源项目使用 MIT 许可证，包括 jQuery、Ruby on Rails、Node.js、React、Vue.js 等。MIT 许可证的简洁性和宽松性使其成为最受欢迎的开源许可证之一。',
    url: 'https://opensource.org/licenses/MIT',
    badges: ['oss'],
    permissions: ['share', 'adapt', 'commercial', 'sublicense'],
    conditions: ['attribution', 'include-copyright'],
    color: 'green'
  },
  'apache': {
    category: 'oss',
    name: 'Apache 2.0',
    fullName: 'Apache 许可证 2.0 版（Apache License 2.0）',
    description: '此作品采用 Apache 许可证 2.0 版发布。这是一种宽松的开源许可证，允许自由使用、修改和分发，同时提供明确的专利授权，要求保留版权声明、许可声明以及对修改的说明。',
    detail: 'Apache 许可证 2.0 版由 Apache 软件基金会制定，是一种与商业友好的宽松开源许可证。其主要特点包括：允许任何目的的使用、修改和分发，包括商业用途；提供明确的专利授权——贡献者向用户授予其贡献中涉及的专利许可（这是与 MIT/BSD 的重要区别）；要求在分发时保留版权声明、许可声明、免责声明以及 NOTICE 文件（如果存在）；要求对修改的文件进行标注，说明该文件已被更改；包含商标使用限制。Apache 许可证与 GPL-3.0 兼容，但与 GPL-2.0 不兼容。著名的使用 Apache 许可证的项目包括 Android、Apache HTTP Server、Kubernetes、TensorFlow、Swift 等。',
    url: 'https://www.apache.org/licenses/LICENSE-2.0',
    badges: ['oss'],
    permissions: ['share', 'adapt', 'commercial', 'patent', 'sublicense'],
    conditions: ['attribution', 'state-changes', 'include-license'],
    color: 'green'
  },
  'bsd-2': {
    category: 'oss',
    name: 'BSD 2-Clause',
    fullName: 'BSD 2-Clause "简化版"许可证（BSD 2-Clause "Simplified" License）',
    description: '此作品采用 BSD 2-Clause 许可证发布。这是一种非常宽松的开源许可证，允许自由使用、修改和分发，唯一的要求是在源代码和二进制分发中保留版权声明和免责声明。',
    detail: 'BSD 2-Clause 许可证，也称为"简化版 BSD"或"FreeBSD 许可证"，是 BSD 许可证家族中最简洁的版本。它只包含两个条款：（1）源代码的再分发必须保留版权声明、条款列表和免责声明；（2）二进制形式的再分发必须在文档和/或其他材料中复制版权声明、条款列表和免责声明。这种许可证没有任何"广告条款"或"非背书条款"，是最接近公有领域的开源许可证之一。BSD 许可证系列具有悠久的历史，起源于加州大学伯克利分校的伯克利软件套件（BSD Unix）。BSD 2-Clause 与 GPL 兼容。',
    url: 'https://opensource.org/licenses/BSD-2-Clause',
    badges: ['oss'],
    permissions: ['share', 'adapt', 'commercial', 'sublicense'],
    conditions: ['attribution'],
    color: 'green'
  },
  'bsd-3': {
    category: 'oss',
    name: 'BSD 3-Clause',
    fullName: 'BSD 3-Clause "新版"或"修订版"许可证（BSD 3-Clause "New" or "Revised" License）',
    description: '此作品采用 BSD 3-Clause 许可证发布。在 BSD 2-Clause 的基础上增加了一条：未经特别书面许可，不得使用版权持有人及其贡献者的名义来为衍生产品进行背书或宣传。',
    detail: 'BSD 3-Clause 许可证，也称为"新 BSD"或"修订版 BSD"，在 BSD 2-Clause 的两个条款基础上增加了第三个条款（"非背书条款"）：未经事先书面许可，不得使用版权持有人或其贡献者的名称来为衍生产品进行背书或促销。这一条款保护了原作者的声誉，防止他人暗示原作者认可或参与了衍生作品。BSD 3-Clause 与 GPL 兼容。早期的 BSD 许可证（4-Clause）还包含一个"广告条款"，要求在所有提及软件功能或使用的广告材料中都要致谢，这一条款后来被认为过于繁琐而被移除，形成了现在的 3-Clause 版本。',
    url: 'https://opensource.org/licenses/BSD-3-Clause',
    badges: ['oss'],
    permissions: ['share', 'adapt', 'commercial', 'sublicense'],
    conditions: ['attribution', 'no-endorsement'],
    color: 'green'
  },
  'isc': {
    category: 'oss',
    name: 'ISC',
    fullName: 'ISC 许可证（ISC License）',
    description: '此作品采用 ISC 许可证发布。这是一种功能上等同于 MIT 和 BSD 2-Clause 的简洁许可证，由互联网系统联盟（ISC）使用。',
    detail: 'ISC 许可证由互联网系统联盟（Internet Systems Consortium）为其软件（如 BIND DNS 服务器）制定。它被认为是功能上等同于 MIT 许可证和 BSD 2-Clause 许可证的简化版本，但措辞更加简洁清晰。ISC 许可证只有两句话：第一句授予自由使用、复制、修改和分发的权限；第二句是免责声明。由于其简洁性和与 MIT/BSD 的功能等效性，ISC 许可证被 OpenBSD 项目推荐为首选的许可证，并被许多开源项目采用。ISC 许可证与 GPL 兼容。',
    url: 'https://opensource.org/licenses/ISC',
    badges: ['oss'],
    permissions: ['share', 'adapt', 'commercial', 'sublicense'],
    conditions: ['attribution'],
    color: 'green'
  },
  'mpl': {
    category: 'oss',
    name: 'MPL 2.0',
    fullName: 'Mozilla 公共许可证 2.0 版（Mozilla Public License 2.0）',
    description: '此作品采用 Mozilla 公共许可证 2.0 版发布。这是一种"弱著佐权"许可证，要求对 MPL 许可的文件进行的修改必须以相同许可证发布，但允许将 MPL 代码与其他许可证的代码组合在较大的作品中。',
    detail: 'MPL 2.0 是由 Mozilla 基金会制定的开源许可证，介于宽松许可证（如 MIT）和强著佐权许可证（如 GPL）之间，被称为"弱著佐权"或"文件级著佐权"许可证。其核心特点是：对 MPL 许可的源代码文件的修改必须以 MPL 发布；但允许将 MPL 代码与使用其他许可证（包括专有许可证）的代码组合成较大的作品；提供明确的专利授权；与 Apache 2.0 和 GPL-2.0+（通过可选的兼容性条款）兼容。这种设计使得 MPL 特别适合那些希望确保其代码的改进能够回馈社区，同时又希望代码能够被商业软件采用的项目。Firefox 浏览器、Thunderbird 邮件客户端等 Mozilla 产品都使用 MPL。',
    url: 'https://www.mozilla.org/en-US/MPL/2.0/',
    badges: ['oss'],
    permissions: ['share', 'adapt', 'commercial', 'patent', 'sublicense'],
    conditions: ['attribution', 'disclose-source-file', 'sharealike-file'],
    color: 'cyan'
  },
  'unlicense': {
    category: 'oss',
    name: 'Unlicense',
    fullName: 'The Unlicense（反许可证）',
    description: '此作品采用 Unlicense 发布，这意味着作者已将其贡献至公有领域，放弃所有著作权，您可以自由地将其用于任何目的，无需署名或遵守任何条件。',
    detail: 'Unlicense 是一种公有领域等效许可声明，旨在让创作者尽可能简单地将其作品贡献至公有领域。它包含两部分：第一部分声明作品属于公有领域；第二部分为那些不承认公有领域贡献的司法管辖区提供了一个备用的宽松许可。Unlicense 的目标是最大限度地减少使用软件的法律障碍，使其真正"自由"——不仅是"免费"（free as in beer），也是"自由"（free as in freedom）。与 CC0 类似，Unlicense 的作品可以被用于任何目的，包括商业用途，无需署名，无需附加任何条件。许多程序员选择 Unlicense 是因为他们相信软件应该尽可能自由，不受任何法律限制。',
    url: 'https://unlicense.org/',
    badges: ['pd'],
    permissions: ['share', 'adapt', 'commercial', 'sublicense', 'no-attribution'],
    conditions: [],
    color: 'gray'
  },

  // ==================== 合理使用 (Fair Use) ====================
  'fair-use': {
    category: 'fair',
    name: '合理使用',
    fullName: '合理使用（Fair Use / Fair Dealing）',
    description: '此内容根据著作权法中的"合理使用"（美国）或"合理处理"（英联邦国家）条款使用受著作权保护的材料。此使用被认为符合评论、批评、新闻报道、教学或学术研究等目的。',
    detail: '合理使用（Fair Use）是美国著作权法中的一项重要原则（《美国法典》第 17 编第 107 条），允许在特定情况下未经著作权人许可使用受保护的作品。判断是否构成合理使用需要考虑四个因素：（1）使用的目的和性质，包括是否具有商业性质或是否用于非营利教育目的；（2）受版权保护作品的性质；（3）所使用部分占作品整体的数量和实质性；（4）使用对作品潜在市场或价值的影响。英联邦国家（如英国、加拿大、澳大利亚）使用类似的"合理处理"（Fair Dealing）原则，但通常限于特定目的（如研究、批评、新闻报道）。中国《著作权法》第二十四条也规定了类似的合理使用情形。合理使用是一种抗辩理由，而非授权许可，其适用性需要根据具体情况判断，存在一定的法律不确定性。',
    badges: ['fair'],
    permissions: [],
    conditions: ['fair-use-only', 'limited-context', 'case-by-case'],
    color: 'orange'
  },
  'fair-use-logo': {
    category: 'fair',
    name: '合理使用（商标/标志）',
    fullName: '合理使用 - 商标或标志',
    description: '此商标或标志在本文中用于辨识相关的组织、公司、产品或服务。这种使用被认为属于合理使用，因为它仅用于说明和辨识目的，而非商业推广。',
    detail: '商标和公司标志的合理使用是一个复杂的领域，涉及著作权法和商标法的交叉。在著作权法下，标志图像可能因为足够简单而不受著作权保护（参见 pd-logo），或者因为用于评论、新闻报道等目的而属于合理使用。在商标法下，使用他人商标来准确描述或指称商标所有者的产品或服务通常是被允许的（"指示性合理使用"或"提名性合理使用"）。本标志的使用符合以下条件：仅用于辨识和说明相关实体，不暗示任何关联或背书关系；图像分辨率降低以防止用于伪造或冒充；使用范围和语境仅限于信息性目的。但请注意，对商标的使用不应造成消费者混淆或稀释商标的显著性。',
    badges: ['fair'],
    permissions: [],
    conditions: ['fair-use-only', 'identification-only', 'low-resolution'],
    color: 'orange'
  },
  'fair-use-cover': {
    category: 'fair',
    name: '合理使用（封面）',
    fullName: '合理使用 - 书籍、唱片或其他出版物封面',
    description: '此封面图像用于辨识或评论相关的书籍、唱片、电影或其他出版物。这种使用被认为属于合理使用，因为它服务于评论、批评或信息性目的。',
    detail: '书籍、唱片、电影、游戏等出版物的封面艺术通常受著作权保护。然而，在评论、批评、介绍或讨论这些作品时使用其封面图像通常被认为属于合理使用。这种使用的合理性基于以下考量：使用目的是信息性的（帮助读者辨识所讨论的作品）或批评性的（作为评论的视觉参考）；封面图像虽然可能具有艺术价值，但其主要功能是商业性的（吸引消费者）；通常只使用低分辨率版本，不足以替代对原作品的购买；这种使用实际上可能促进而非损害原作品的市场价值。封面艺术的使用应当伴随对相关作品的实质性讨论或评论，而非仅仅作为装饰。',
    badges: ['fair'],
    permissions: [],
    conditions: ['fair-use-only', 'commentary-only', 'low-resolution'],
    color: 'orange'
  },
  'fair-use-screenshot': {
    category: 'fair',
    name: '合理使用（截图）',
    fullName: '合理使用 - 软件、游戏、网站或影视截图',
    description: '此截图用于评论、说明或讨论相关的软件、游戏、网站或影视作品。这种使用被认为属于合理使用，因为它服务于信息性或批评性目的。',
    detail: '软件界面、游戏画面、网站页面或影视作品的截图可能涉及多重著作权（界面设计、图形元素、角色形象等）。在以下情况下，使用截图通常被认为属于合理使用：用于评论、批评或分析相关作品的功能、设计或内容；用于新闻报道或教育目的；用于技术支持或故障排除的说明；使用的是代表性的、有限的画面，而非作品的大量内容；不会替代对原作品的正常消费。游戏和电影公司通常对用于评论和宣传目的的截图持宽容态度，因为这有助于推广其产品。然而，对于涉及剧透、泄露未发布内容或可能影响销售的使用，著作权人可能会提出异议。',
    badges: ['fair'],
    permissions: [],
    conditions: ['fair-use-only', 'commentary-only', 'limited-excerpt'],
    color: 'orange'
  },
  'fair-use-poster': {
    category: 'fair',
    name: '合理使用（海报）',
    fullName: '合理使用 - 电影、活动或产品宣传海报',
    description: '此海报图像用于辨识或评论相关的电影、活动或产品。这种使用被认为属于合理使用，因为它服务于信息性或批评性目的。',
    detail: '电影海报、活动海报、产品宣传图等通常是专门委托创作的艺术作品，受著作权保护。然而，在以下情况下使用海报图像通常被认为属于合理使用：用于评论、批评或讨论相关电影、活动或产品；用于新闻报道或历史记录；用于教育目的（如研究电影海报的设计演变）；帮助读者辨识所讨论的主题。海报的合理使用应当与实质性的内容讨论相结合，而非仅作为装饰。通常应使用低分辨率版本，不足以用于印刷或替代官方发行。对于正在上映或即将发行的作品，海报的使用可能更敏感，因为它可能影响宣传效果。',
    badges: ['fair'],
    permissions: [],
    conditions: ['fair-use-only', 'commentary-only', 'low-resolution'],
    color: 'orange'
  },
  'fair-use-portrait': {
    category: 'fair',
    name: '合理使用（人物照片）',
    fullName: '合理使用 - 公众人物照片',
    description: '此照片用于辨识所讨论的人物。由于无法获得自由授权的替代图像，根据合理使用原则使用此受著作权保护的照片。',
    detail: '对于公众人物（如政治家、演员、运动员、历史人物等）的照片，在缺乏可用的自由授权图像时，使用受著作权保护的照片可能被认为属于合理使用。这种使用的正当性基于以下因素：公众对该人物的外貌有了解的合法兴趣；该人物的公众形象使得其照片具有新闻价值；没有合理可用的替代图像（对于在世人物，通常很难获得自由授权的照片）；使用是辨识性的，而非商业或装饰性的。但请注意：对于在世的非公众人物，应尽量获得本人同意或使用自由授权的图像；照片的使用应当与对该人物的实质性讨论相结合；应优先寻找公有领域或自由授权的替代图像。',
    badges: ['fair'],
    permissions: [],
    conditions: ['fair-use-only', 'identification-only', 'no-free-alternative'],
    color: 'orange'
  },
  'fair-use-historic': {
    category: 'fair',
    name: '合理使用（历史图像）',
    fullName: '合理使用 - 具有历史意义的图像',
    description: '此历史图像用于记录和说明重要的历史事件、人物或现象。由于历史原因，无法获得自由授权的替代图像，因此根据合理使用原则使用。',
    detail: '具有历史意义的图像——如重大历史事件的照片、已故历史人物的肖像、已不存在的建筑或景观的记录——对于历史研究和公众教育具有重要价值。当这些图像仍受著作权保护且无法获得自由授权的替代图像时，其使用可能被认为属于合理使用。这种使用的正当性考量包括：图像的历史文献价值高于其商业价值；所描绘的事件或对象无法重新创作或拍摄；使用服务于教育和信息传播目的；不存在可用的自由授权替代图像。但请注意，"历史性"不能成为使用任何旧照片的借口——图像必须对所讨论的历史主题具有真正的相关性和文献价值。',
    badges: ['fair'],
    permissions: [],
    conditions: ['fair-use-only', 'historic-significance', 'no-free-alternative', 'documentary-purpose'],
    color: 'orange'
  },
  'fair-use-music': {
    category: 'fair',
    name: '合理使用（音乐片段）',
    fullName: '合理使用 - 音乐片段',
    description: '此音乐片段用于评论、批评、教学或学术研究目的。根据合理使用原则，仅使用了简短的、有代表性的片段，不构成对完整作品的替代。',
    detail: '音乐作品通常受到严格的著作权保护，包括词曲著作权和录音著作权。在以下情况下，使用简短的音乐片段可能被认为属于合理使用：用于音乐评论或批评（如分析某首歌曲的和声结构或歌词含义）；用于教育目的（如音乐课程中的示例）；用于新闻报道（如报道某场音乐活动）；用于学术研究。关键考量因素包括：使用片段的长度（通常不超过 30 秒或整首歌曲的很小比例）；使用的目的（批评性和教育性使用比商业使用更可能被认为合理）；对作品市场的影响（使用不应替代对原作的购买）。请注意，即使是很短的片段，如果是该作品最具代表性或最有价值的部分（如歌曲的副歌），也可能不被认为是合理使用。',
    badges: ['fair'],
    permissions: [],
    conditions: ['fair-use-only', 'commentary-only', 'brief-excerpt'],
    color: 'orange'
  },
  'fair-use-film': {
    category: 'fair',
    name: '合理使用（影视内容）',
    fullName: '合理使用 - 影视片段或静帧',
    description: '此影视内容（片段或静帧）用于评论、批评、教学或学术研究目的。根据合理使用原则，仅使用了用于说明讨论要点所必需的最小量内容。',
    detail: '电影、电视节目和其他视听作品受到著作权保护。在以下情况下，使用影视片段或静帧可能被认为属于合理使用：用于影评或影视批评（分析电影的导演手法、表演、摄影等）；用于教育目的（如电影研究课程中的示例）；用于新闻报道（如报道某部电影的争议场景）；用于学术研究（如分析特定导演的视觉风格）。合理使用的考量因素包括：使用内容的长度和比例（应是整部作品的很小部分）；使用的目的和性质（转化性使用更可能被认为合理）；使用内容的性质（核心情节转折比普通场景更敏感）；对市场的影响（不应替代对原作的观看）。静帧图像的使用通常比视频片段更容易被接受，因为单帧图像无法替代观看电影的体验。',
    badges: ['fair'],
    permissions: [],
    conditions: ['fair-use-only', 'commentary-only', 'brief-excerpt'],
    color: 'orange'
  },

  // ==================== 版权保留 ====================
  'arr': {
    category: 'proprietary',
    name: '版权所有',
    fullName: '保留所有权利（All Rights Reserved）',
    description: '此作品受著作权保护，著作权人保留所有权利。未经著作权人书面许可，不得复制、修改、分发或以任何方式使用此作品。',
    detail: '"保留所有权利"（All Rights Reserved）是著作权的默认状态。在大多数国家，作品一经创作完成即自动受到著作权保护，无需注册或标注版权声明。在此状态下，著作权人享有以下专有权利：复制权（复制作品的权利）；发行权（向公众提供作品副本的权利）；改编权（创作演绎作品的权利）；表演权（公开表演作品的权利）；展示权（公开展示作品的权利）；传播权（通过网络传播作品的权利）。任何人未经著作权人许可行使这些权利，即构成著作权侵权（合理使用等法定例外情形除外）。这是所有许可声明中限制最严格的状态。',
    badges: ['copyright'],
    permissions: [],
    conditions: ['all-rights-reserved', 'no-use-without-permission'],
    color: 'red'
  },
  'permission': {
    category: 'proprietary',
    name: '经授权使用',
    fullName: '经版权所有者授权使用',
    description: '此作品受著作权保护，但已获得著作权人的特别授权在此处使用。此授权可能仅限于特定的使用方式、范围和期限，不构成对其他人或其他用途的许可。',
    detail: '此作品的使用已获得著作权人的明确许可。这种许可可能是：专门为此特定使用授予的一次性许可；针对特定个人、组织或平台授予的许可；附带特定条件（如署名要求、使用范围限制、时间限制等）的许可；通过正式的许可协议、电子邮件、书面信函或其他方式授予。重要提示：此处显示的授权仅适用于当前的使用情境。如果您希望使用此作品，您必须自行联系著作权人获取许可。此授权不构成对其他人使用此作品的许可，也不构成对其他使用方式的许可。在适用的情况下，应保留对授权证据（如许可信函、电子邮件等）的记录。',
    badges: ['permission'],
    permissions: ['limited-use'],
    conditions: ['with-permission', 'specific-context', 'non-transferable'],
    color: 'purple'
  },
  'restricted': {
    category: 'proprietary',
    name: '受限使用',
    fullName: '受限使用许可',
    description: '此作品根据特定的使用条款提供，使用受到限制。请仔细阅读并遵守适用的使用条款、服务条款或最终用户许可协议。',
    detail: '此作品在特定条款和条件下提供使用，这些条款可能限制使用的方式、范围、目的或期限。常见的限制类型包括：仅限非商业使用；仅限个人使用；仅限教育用途；仅限特定地区使用；禁止修改或创作衍生作品；禁止再分发或再许可；需要定期续费或订阅；使用可能受到技术措施（DRM）的限制。在使用此作品之前，务必仔细阅读适用的使用条款、服务条款或最终用户许可协议（EULA），确保您的预期使用符合这些条款。违反使用条款可能导致使用权被终止，并可能承担法律责任。',
    badges: ['copyright'],
    permissions: ['limited-use'],
    conditions: ['specific-terms', 'read-license'],
    color: 'red'
  }
};

// 徽章定义
const LICENSE_BADGES = {
  'by': { label: 'BY', title: '署名', color: '#f59e0b' },
  'sa': { label: 'SA', title: '相同方式共享', color: '#3b82f6' },
  'nc': { label: 'NC', title: '非商业性使用', color: '#ef4444' },
  'nd': { label: 'ND', title: '禁止演绎', color: '#8b5cf6' },
  'zero': { label: '0', title: '公有领域贡献', color: '#6b7280' },
  'pd': { label: 'PD', title: '公有领域', color: '#6b7280' },
  'gnu': { label: 'GNU', title: 'GNU 许可', color: '#a855f7' },
  'oss': { label: 'OSS', title: '开源许可', color: '#22c55e' },
  'fair': { label: 'FU', title: '合理使用', color: '#f97316' },
  'copyright': { label: '©', title: '版权所有', color: '#dc2626' },
  'permission': { label: '✓', title: '经授权', color: '#7c3aed' }
};

const PERMISSIONS = {
  'share': '分享',
  'adapt': '改编',
  'commercial': '商业使用',
  'patent': '专利授权',
  'sublicense': '再许可',
  'no-attribution': '无需署名',
  'limited-use': '有限使用'
};

const CONDITIONS = {
  'attribution': '署名',
  'sharealike': '相同方式共享',
  'sharealike-file': '文件级相同共享',
  'sharealike-library': '库级相同共享',
  'noncommercial': '非商业使用',
  'noderivatives': '禁止演绎',
  'copyleft': 'Copyleft',
  'disclose-source': '公开源码',
  'disclose-source-file': '公开修改文件源码',
  'state-changes': '说明变更',
  'include-license': '附带许可文本',
  'include-copyright': '保留版权声明',
  'network-use': '网络使用须公开',
  'no-endorsement': '禁止背书',
  'us-pd-only': '仅在美国属公有领域',
  'cn-pd-only': '仅在中国大陆属公有领域',
  'trademark-may-apply': '可能受商标法保护',
  'font-file-may-be-protected': '字体文件可能受保护',
  'may-vary-by-jurisdiction': '不同司法管辖区可能不同',
  'fair-use-only': '仅限合理使用',
  'limited-context': '限定使用场景',
  'case-by-case': '需个案判断',
  'identification-only': '仅用于辨识',
  'commentary-only': '仅用于评论',
  'low-resolution': '低分辨率',
  'limited-excerpt': '有限摘录',
  'historic-significance': '历史意义',
  'no-free-alternative': '无自由替代',
  'documentary-purpose': '文献目的',
  'brief-excerpt': '简短摘录',
  'all-rights-reserved': '保留所有权利',
  'no-use-without-permission': '未经许可不得使用',
  'with-permission': '经授权',
  'specific-context': '特定场景',
  'non-transferable': '不可转让',
  'specific-terms': '特定条款',
  'read-license': '请阅读许可'
};

// ================================================================
// 辅助函数
// ================================================================

function getModelDisplay(modelKey) {
  if (!modelKey) return null;
  if (modelKey.includes('|') || modelKey.includes('/')) {
    const sep = modelKey.includes('|') ? '|' : '/';
    const parts = modelKey.split(sep).map(s => s.trim());
    return { name: parts[0] || modelKey, company: parts[1] || '' };
  }
  const key = modelKey.toLowerCase();
  return AI_MODELS_PRESET[key] || { name: modelKey, company: '' };
}

function getLicenseInfo(licenseKey, version) {
  if (!licenseKey) return null;
  const key = licenseKey.toLowerCase().replace(/_/g, '-');
  const license = LICENSES[key];
  if (!license) {
    return { category: 'custom', name: licenseKey, fullName: licenseKey, description: '', detail: '', badges: [], permissions: [], conditions: [], color: 'gray' };
  }
  if (version && license.category === 'cc') {
    return { ...license, name: license.name.replace('4.0', version), fullName: license.fullName.replace('4.0', version) };
  }
  return license;
}

function parseAttributes(attrString) {
  const attrs = {};
  const regex = /(\w+)=["']([^"']*)["']|(\w+)=(\S+)/g;
  let match;
  while ((match = regex.exec(attrString)) !== null) {
    const key = match[1] || match[3];
    const value = match[2] || match[4];
    attrs[key.toLowerCase()] = value;
  }
  return attrs;
}

function renderInlineMarkdown(md, text) {
  if (!text) return '';
  return md.renderInline(text);
}

// ================================================================
// SVG 图标
// ================================================================

const ICONS = {
  robot: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="10" x="3" y="11" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/><line x1="8" x2="8" y1="16" y2="16"/><line x1="16" x2="16" y1="16" y2="16"/></svg>',
  sparkles: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>',
  wand: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 4V2"/><path d="M15 16v-2"/><path d="M8 9h2"/><path d="M20 9h2"/><path d="M17.8 11.8 19 13"/><path d="M15 9h0"/><path d="M17.8 6.2 19 5"/><path d="m3 21 9-9"/><path d="M12.2 6.2 11 5"/></svg>',
  pencil: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>',
  languages: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 8 6 6"/><path d="m4 14 6-6 2-3"/><path d="M2 5h12"/><path d="M7 2h1"/><path d="m22 22-5-10-5 10"/><path d="M14 18h6"/></svg>',
  zap: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
  'file-text': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg>',
  mic: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>',
  image: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>',
  'volume-2': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>',
  video: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m22 8-6 4 6 4V8Z"/><rect width="14" height="12" x="2" y="6" rx="2" ry="2"/></svg>',
  code: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>',
  music: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>',
  box: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>',
  database: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5V19A9 3 0 0 0 21 19V5"/><path d="M3 12A9 3 0 0 0 21 12"/></svg>',
  'align-left': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 6.1H3"/><path d="M21 12.1H3"/><path d="M15.1 18H3"/></svg>',
  cc: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1.41 15.06c-2.37 0-3.92-1.67-3.92-4.03s1.55-4.09 3.89-4.09c1.13 0 1.95.36 2.58.89l-.95 1.39c-.42-.35-.87-.58-1.52-.58-1.13 0-1.88.93-1.88 2.34 0 1.46.73 2.37 1.91 2.37.63 0 1.15-.23 1.58-.64l.89 1.35c-.68.61-1.55 1-2.58 1zm5.71 0c-2.37 0-3.92-1.67-3.92-4.03s1.55-4.09 3.89-4.09c1.13 0 1.95.36 2.58.89l-.95 1.39c-.42-.35-.87-.58-1.52-.58-1.13 0-1.88.93-1.88 2.34 0 1.46.73 2.37 1.91 2.37.63 0 1.15-.23 1.58-.64l.89 1.35c-.68.61-1.55 1-2.58 1z"/></svg>',
  scale: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/></svg>',
  shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
  'external-link': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" x2="21" y1="14" y2="3"/></svg>',
  unlock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg>',
  lock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',
  'file-check': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="m9 15 2 2 4-4"/></svg>'
};

function getIcon(name) {
  return ICONS[name] || ICONS['file-text'];
}

// ================================================================
// HTML 生成
// ================================================================

function renderAIDeclaration(md, attrs) {
  const type = AI_TYPES[attrs.type] || AI_TYPES['generated'];
  const media = MEDIA_TYPES[attrs.media] || MEDIA_TYPES['text'];
  const model = getModelDisplay(attrs.model);
  const text = attrs.text ? renderInlineMarkdown(md, attrs.text) : '';
  const showDetail = attrs.detail === 'true' || attrs.detail === '1';
  
  let html = `<div class="vp-doc"><div class="license-block ai-declaration" data-type="${attrs.type || 'generated'}" data-media="${attrs.media || 'text'}">`;
  html += `<div class="license-header">`;
  html += `<div class="license-icon ai-icon">${getIcon('robot')}</div>`;
  html += `<div class="license-info">`;
  html += `<div class="license-title">`;
  html += `<span class="ai-type-badge">${getIcon(type.icon)}<span>${type.label}</span></span>`;
  if (model) {
    html += `<span class="ai-model-badge">${model.name}`;
    if (model.company) html += `<small>${model.company}</small>`;
    html += `</span>`;
  }
  html += `</div>`;
  html += `<div class="license-subtitle"><span class="media-type">${getIcon(media.icon)}<span>${media.label}</span></span><span class="separator">·</span><span>此${media.label}${type.desc}</span></div>`;
  html += `</div></div>`;
  
  // Body with description
  html += `<div class="license-body">`;
  if (showDetail && type.detail) {
    html += `<p class="license-description">${type.detail}</p>`;
  }
  html += `</div>`;
  
  if (text) html += `<div class="license-text">${text}</div>`;
  html += `</div></div>`;
  return html;
}

function renderLicenseDeclaration(md, attrs) {
  const license = getLicenseInfo(attrs.type, attrs.version);
  if (!license) return '';
  
  const text = attrs.text ? renderInlineMarkdown(md, attrs.text) : '';
  const author = attrs.author || '';
  const year = attrs.year || '';
  const source = attrs.source || '';
  const work = attrs.work || '';
  const showDetail = attrs.detail === 'true' || attrs.detail === '1';
  
  let icon = 'scale';
  if (license.category === 'cc') icon = 'cc';
  else if (license.category === 'pd') icon = 'unlock';
  else if (license.category === 'gnu') icon = 'file-check';
  else if (license.category === 'oss') icon = 'code';
  else if (license.category === 'fair') icon = 'shield';
  else if (license.category === 'proprietary') icon = 'lock';
  
  let html = `<div class="vp-doc"><div class="license-block license-declaration license-${license.category}" data-license="${attrs.type}" data-category="${license.category}">`;
  html += `<div class="license-header">`;
  html += `<div class="license-icon">${getIcon(icon)}</div>`;
  html += `<div class="license-info">`;
  html += `<div class="license-title"><span class="license-name">${license.name}</span>`;
  if (license.badges && license.badges.length > 0) {
    html += `<span class="license-badges">`;
    for (const badge of license.badges) {
      const b = LICENSE_BADGES[badge];
      if (b) html += `<span class="license-badge" style="background:${b.color}" title="${b.title}">${b.label}</span>`;
    }
    html += `</span>`;
  }
  html += `</div>`;
  html += `<div class="license-subtitle"><span>${license.fullName}</span></div>`;
  html += `</div>`;
  if (license.url) {
    html += `<a href="${license.url}" target="_blank" rel="noopener noreferrer" class="license-link" title="查看许可协议">${getIcon('external-link')}</a>`;
  }
  html += `</div>`;
  
  html += `<div class="license-body">`;
  
  // Description (always show) and Detail (optional)
  if (license.description) {
    html += `<p class="license-description">${license.description}</p>`;
  }
  if (showDetail && license.detail) {
    html += `<div class="license-detail">${license.detail}</div>`;
  }
  
  // Metadata
  if (author || year || source || work) {
    html += `<div class="license-meta">`;
    if (work) html += `<span class="license-meta-item"><strong>作品：</strong>${work}</span>`;
    if (author) html += `<span class="license-meta-item"><strong>作者：</strong>${author}</span>`;
    if (year) html += `<span class="license-meta-item"><strong>年份：</strong>${year}</span>`;
    if (source) html += `<span class="license-meta-item"><strong>来源：</strong>${source}</span>`;
    html += `</div>`;
  }
  
  // Permissions and conditions
  if ((license.permissions && license.permissions.length > 0) || (license.conditions && license.conditions.length > 0)) {
    html += `<div class="license-details">`;
    if (license.permissions && license.permissions.length > 0) {
      html += `<div class="license-permissions"><span class="license-label">允许：</span>`;
      for (const p of license.permissions) html += `<span class="license-perm license-perm-yes">${PERMISSIONS[p] || p}</span>`;
      html += `</div>`;
    }
    if (license.conditions && license.conditions.length > 0) {
      html += `<div class="license-conditions"><span class="license-label">条件：</span>`;
      for (const c of license.conditions) html += `<span class="license-cond">${CONDITIONS[c] || c}</span>`;
      html += `</div>`;
    }
    html += `</div>`;
  }
  
  html += `</div>`;
  if (text) html += `<div class="license-text">${text}</div>`;
  html += `</div></div>`;
  return html;
}

// ================================================================
// Markdown-it 插件
// ================================================================

export function licenseDeclarationPlugin(md) {
  const originalHtmlBlock = md.renderer.rules.html_block;
  
  md.renderer.rules.html_block = function(tokens, idx, options, env, self) {
    const content = tokens[idx].content.trim();
    
    const aiMatch = content.match(/^<ai\s+([^>]*?)\s*\/?>$/i);
    if (aiMatch) return renderAIDeclaration(md, parseAttributes(aiMatch[1]));
    
    const licenseMatch = content.match(/^<license\s+([^>]*?)\s*\/?>$/i);
    if (licenseMatch) return renderLicenseDeclaration(md, parseAttributes(licenseMatch[1]));
    
    const ccMatch = content.match(/^<cc\s+([^>]*?)\s*\/?>$/i);
    if (ccMatch) {
      const attrs = parseAttributes(ccMatch[1]);
      const type = attrs.type ? (attrs.type.startsWith('cc-') ? attrs.type : `cc-${attrs.type}`) : 'cc-by-sa';
      return renderLicenseDeclaration(md, { ...attrs, type });
    }
    
    if (originalHtmlBlock) return originalHtmlBlock(tokens, idx, options, env, self);
    return self.renderToken(tokens, idx, options);
  };
  
  const originalHtmlInline = md.renderer.rules.html_inline;
  
  md.renderer.rules.html_inline = function(tokens, idx, options, env, self) {
    const content = tokens[idx].content.trim();
    
    const aiMatch = content.match(/^<ai\s+([^>]*?)\s*\/?>$/i);
    if (aiMatch) return renderAIDeclaration(md, parseAttributes(aiMatch[1]));
    
    const licenseMatch = content.match(/^<license\s+([^>]*?)\s*\/?>$/i);
    if (licenseMatch) return renderLicenseDeclaration(md, parseAttributes(licenseMatch[1]));
    
    const ccMatch = content.match(/^<cc\s+([^>]*?)\s*\/?>$/i);
    if (ccMatch) {
      const attrs = parseAttributes(ccMatch[1]);
      const type = attrs.type ? (attrs.type.startsWith('cc-') ? attrs.type : `cc-${attrs.type}`) : 'cc-by-sa';
      return renderLicenseDeclaration(md, { ...attrs, type });
    }
    
    if (originalHtmlInline) return originalHtmlInline(tokens, idx, options, env, self);
    return self.renderToken(tokens, idx, options);
  };
}

export { AI_TYPES, MEDIA_TYPES, AI_MODELS_PRESET, LICENSES, LICENSE_BADGES, PERMISSIONS, CONDITIONS };