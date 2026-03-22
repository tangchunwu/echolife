import type { DialogueTree } from '../../types/game';

export const pastDialogue: DialogueTree = {
  id: 'past_chapter1',
  chapter: 1,
  scene: 'past',
  startNodeId: 'past_1',
  nodes: {
    past_1: {
      id: 'past_1',
      speaker: 'narrator',
      text: '你踏入了过去的世界。一间温暖的房间出现在眼前——阳光透过旧窗帘洒在木地板上，书架上堆满了泛黄的书籍。',
      nextNodeId: 'past_2',
      autoAdvance: true,
      delay: 3000,
    },
    past_2: {
      id: 'past_2',
      speaker: 'narrator',
      text: '房间中央，一个年轻的身影正背对着你，翻阅着一本旧日记。那是——过去的你。',
      nextNodeId: 'past_3',
    },
    past_3: {
      id: 'past_3',
      speaker: 'past-self',
      text: '……嗯？你是谁？等等，你看起来很像——像我？',
      options: [
        {
          key: 'honest',
          text: '我是未来的你。我从时间裂隙来到这里。',
          nextNodeId: 'past_4a',
        },
        {
          key: 'gentle',
          text: '别害怕，我是来找你的。我们需要谈谈。',
          nextNodeId: 'past_4b',
        },
        {
          key: 'playful',
          text: '你好，小时候的我。好久不见啊。',
          nextNodeId: 'past_4c',
        },
      ],
    },
    past_4a: {
      id: 'past_4a',
      speaker: 'past-self',
      text: '未来的我？这……这是真的吗？我一直在写日记，记录那些奇怪的梦——梦见自己在一个漂浮的大厅里。',
      nextNodeId: 'past_5',
    },
    past_4b: {
      id: 'past_4b',
      speaker: 'past-self',
      text: '谈谈？你的声音……好熟悉。就像是我自己的声音，但更加——沉稳。',
      nextNodeId: 'past_5',
    },
    past_4c: {
      id: 'past_4c',
      speaker: 'past-self',
      text: '哈哈，"小时候的我"？你说话的方式好奇怪。但不知为什么，我觉得你没有在骗我。',
      nextNodeId: 'past_5',
      onEnter: { setFlag: 'playful_past' },
    },
    past_5: {
      id: 'past_5',
      speaker: 'past-self',
      text: '我正在读这本日记——里面记录了很多我快要遗忘的事情。有一段记忆……关于一个很重要的承诺。',
      options: [
        {
          key: 'ask_promise',
          text: '什么承诺？告诉我。',
          nextNodeId: 'past_6a',
        },
        {
          key: 'share_feeling',
          text: '我知道那种感觉。有些记忆在时间中变得模糊了。',
          nextNodeId: 'past_6b',
        },
      ],
    },

    // === BRANCH A: The Promise Path ===
    past_6a: {
      id: 'past_6a',
      speaker: 'past-self',
      text: '承诺要永远记住那些重要的人和时刻。但日记里的文字正在消失，就像记忆本身在被侵蚀……',
      nextNodeId: 'past_6a2',
    },
    past_6a2: {
      id: 'past_6a2',
      speaker: 'past-self',
      text: '等等……日记的最后几页被什么东西粘住了。好像夹着什么——要一起翻开看看吗？',
      options: [
        {
          key: 'search_diary',
          text: '让我来帮你。一起翻开它。',
          nextNodeId: 'past_6a3_search',
        },
        {
          key: 'accept_fading',
          text: '有些东西消失了就消失了。重要的是我们还记得承诺本身。',
          nextNodeId: 'past_6a3_accept',
        },
      ],
    },
    past_6a3_search: {
      id: 'past_6a3_search',
      speaker: 'narrator',
      text: '你小心翼翼地撕开粘合的书页。一个古旧的罗盘从中滑落——它的指针在微微颤动，似乎在指向某个看不见的方向。',
      nextNodeId: 'past_6a4_search',
      onEnter: { addItem: 'broken_compass' },
    },
    past_6a4_search: {
      id: 'past_6a4_search',
      speaker: 'past-self',
      text: '这是……！我想起来了，这是我在那个梦里捡到的。梦里有个声音说："当你迷失方向时，它会为你指路。"',
      nextNodeId: 'past_7',
      onEnter: { setFlag: 'searched_diary' },
    },
    past_6a3_accept: {
      id: 'past_6a3_accept',
      speaker: 'past-self',
      text: '也许你说得对……承诺本身比写下它的文字更重要。谢谢你，我觉得释怀了一些。',
      nextNodeId: 'past_7',
      onEnter: { setFlag: 'accepted_fading' },
    },

    // === BRANCH B: The Empathy Path ===
    past_6b: {
      id: 'past_6b',
      speaker: 'past-self',
      text: '你也有同样的感觉？……说起来，我最近一直在画一幅画。每次醒来都会加几笔，但画的内容我自己也看不太懂。',
      nextNodeId: 'past_6b2',
      onEnter: { setFlag: 'empathetic_past' },
    },
    past_6b2: {
      id: 'past_6b2',
      speaker: 'past-self',
      text: '你要看看吗？也许……你能告诉我这幅画画的是什么？',
      options: [
        {
          key: 'recognize_drawing',
          text: '让我看看。（仔细端详那幅画）',
          nextNodeId: 'past_6b3_recognize',
        },
        {
          key: 'dont_remember',
          text: '老实说，我也遗忘了很多东西。但我们可以一起想起来。',
          nextNodeId: 'past_6b3_together',
        },
      ],
    },
    past_6b3_recognize: {
      id: 'past_6b3_recognize',
      speaker: 'narrator',
      text: '画上描绘的是三个身影站在一个光环之中，周围是碎裂的钟面和流淌的星光。这不是普通的画——这是对未来的预言。',
      nextNodeId: 'past_6b4_recognize',
    },
    past_6b4_recognize: {
      id: 'past_6b4_recognize',
      speaker: 'past-self',
      text: '你的表情变了……你认出了什么，对不对？拿着这幅画吧——我有种感觉，你比我更需要它。',
      nextNodeId: 'past_7',
      onEnter: { addItem: 'broken_compass', setFlag: 'recognized_drawing' },
    },
    past_6b3_together: {
      id: 'past_6b3_together',
      speaker: 'past-self',
      text: '嗯……一起想起来。我喜欢这个说法。不管怎样，能遇到未来的自己就已经很神奇了。',
      nextNodeId: 'past_7',
      onEnter: { setFlag: 'bonded_past' },
    },

    // === CONVERGE ===
    past_7: {
      id: 'past_7',
      speaker: 'past-self',
      text: '对了——日记里掉出来一样东西！是一个发着光的碎片……你拿着它吧，也许它对你有用。',
      nextNodeId: 'past_8',
      onEnter: { addItem: 'memory_fragment_1' },
    },
    past_8: {
      id: 'past_8',
      speaker: 'past-self',
      text: '未来的我……你过得好吗？你有没有实现那些我现在许下的愿望？',
      options: [
        {
          key: 'optimistic',
          text: '有些实现了，有些还在路上。但我从未停下脚步。',
          nextNodeId: 'past_9a',
        },
        {
          key: 'honest_answer',
          text: '说实话，很多事情和想象的不一样。但经历本身就是最好的答案。',
          nextNodeId: 'past_9b',
        },
        {
          key: 'reassure',
          text: '放心，未来比你想象的更有趣。继续做你喜欢的事。',
          nextNodeId: 'past_9c',
        },
        {
          key: 'compass_hint',
          text: '我不确定……但我找到了一些线索。也许这个罗盘能告诉我们答案。',
          nextNodeId: 'past_9d',
          condition: { item: 'broken_compass' },
        },
      ],
    },
    past_9a: {
      id: 'past_9a',
      speaker: 'past-self',
      text: '那就好……知道未来的自己还在努力，我觉得安心了很多。谢谢你来看我。',
      nextNodeId: 'past_10',
    },
    past_9b: {
      id: 'past_9b',
      speaker: 'past-self',
      text: '经历本身就是答案……我记住这句话了。虽然有点伤感，但我能感觉到你变得更强了。',
      nextNodeId: 'past_10',
      onEnter: { setFlag: 'honest_past' },
    },
    past_9c: {
      id: 'past_9c',
      speaker: 'past-self',
      text: '真的吗？太好了！我会继续画画、继续写日记、继续做那些让我快乐的事！',
      nextNodeId: 'past_10',
    },
    past_9d: {
      id: 'past_9d',
      speaker: 'past-self',
      text: '罗盘！你找到了那个梦中的罗盘！它的指针在动——指向那扇门的方向。我觉得它在告诉你接下来该去哪里。',
      nextNodeId: 'past_10',
      onEnter: { setFlag: 'compass_activated' },
    },
    past_10: {
      id: 'past_10',
      speaker: 'past-self',
      text: '对了，我在日记里还看到一段话："当你找到所有记忆碎片，通往未来的门就会打开。" 也许你该去找更多碎片了。',
      nextNodeId: 'past_10b',
      onEnter: { addItem: 'memory_fragment_2' },
    },
    past_10b: {
      id: 'past_10b',
      speaker: 'narrator',
      text: '两块记忆碎片汇聚在一起，散发出冰蓝色的光芒——一把晶莹的钥匙在光芒中凝聚成形。通往未来的道路，已经打开。',
      nextNodeId: 'past_11',
      autoAdvance: true,
      delay: 3000,
      onEnter: { addItem: 'time_key_future' },
    },
    past_11: {
      id: 'past_11',
      speaker: 'past-self',
      text: '再见了，未来的我。希望下次见面时，我们都能记住今天的对话。',
      nextNodeId: null,
    },
  },
};
