import type { DialogueTree } from '../../types/game';

export const paradoxDialogue: DialogueTree = {
  id: 'paradox_chapter3',
  chapter: 3,
  scene: 'paradox',
  startNodeId: 'paradox_1',
  nodes: {
    paradox_1: {
      id: 'paradox_1',
      speaker: 'narrator',
      text: '三条时间线在这里交汇。空间本身在扭曲——色彩在偏移，几何在弯曲。这就是悖论空间。',
      nextNodeId: 'paradox_2',
      autoAdvance: true,
      delay: 3000,
    },
    paradox_2: {
      id: 'paradox_2',
      speaker: 'narrator',
      text: '过去的你和未来的你都已经在这里了，他们站在一个三角形平台的两端，等待着你。',
      nextNodeId: 'paradox_3',
    },
    paradox_3: {
      id: 'paradox_3',
      speaker: 'past-self',
      text: '你来了！我一直在等——这个地方好奇怪，所有东西都在变来变去。',
      nextNodeId: 'paradox_3b',
    },
    paradox_3b: {
      id: 'paradox_3b',
      speaker: 'past-self',
      text: '……对了，我又想起一些事了。在你离开之后，那间房间里的沙漏开始发出嗡嗡声。有个碎片从里面飘了出来。',
      nextNodeId: 'paradox_3c',
    },
    paradox_3c: {
      id: 'paradox_3c',
      speaker: 'narrator',
      text: '过去的你递过来一块闪烁的碎片——这是沙漏碎片，其中的沙粒似乎在逆流。',
      nextNodeId: 'paradox_4',
      onEnter: { addItem: 'hourglass_shard' },
    },
    paradox_4: {
      id: 'paradox_4',
      speaker: 'future-self',
      text: '时间裂隙已经到达临界点了。看——周围的空间正在碎裂。我们必须现在行动。',
      nextNodeId: 'paradox_5',
    },
    paradox_5: {
      id: 'paradox_5',
      speaker: 'future-self',
      text: '将所有记忆碎片放到平台中央的光柱中。三个时间线的意识需要共鸣，才能修复裂隙。',
      options: [
        {
          key: 'ready',
          text: '我准备好了。让我们一起修复时间线。',
          nextNodeId: 'paradox_6',
        },
        {
          key: 'hesitate',
          text: '等一下，如果失败了会怎样？',
          nextNodeId: 'paradox_5b',
        },
      ],
    },
    paradox_5b: {
      id: 'paradox_5b',
      speaker: 'future-self',
      text: '如果失败……所有时间线都会归于虚无。但不要恐惧——我们三个在一起，没有过不去的悖论。',
      nextNodeId: 'paradox_6',
    },
    paradox_6: {
      id: 'paradox_6',
      speaker: 'narrator',
      text: '记忆碎片开始发光，从你的手中飘起，汇聚到光柱之中。三个时间线的能量开始共振。',
      nextNodeId: 'paradox_7',
    },
    paradox_7: {
      id: 'paradox_7',
      speaker: 'past-self',
      text: '我能感觉到……所有的记忆都在回来了！那些遗忘的时刻、那些重要的人……',
      nextNodeId: 'paradox_8',
    },
    paradox_8: {
      id: 'paradox_8',
      speaker: 'future-self',
      text: '裂隙正在闭合。但我们需要做最后一个选择——三条时间线的未来，由你来决定。',
      options: [
        {
          key: 'merge',
          text: '让三条时间线合而为一，我们本就是一个完整的存在。',
          nextNodeId: 'ending_merge',
          effect: { setFlag: 'ending_merge' },
        },
        {
          key: 'separate',
          text: '让每条时间线保持独立，各自拥有自己的故事。',
          nextNodeId: 'ending_separate',
          effect: { setFlag: 'ending_separate' },
        },
        {
          key: 'transcend',
          text: '超越时间线——不是合并也不是分离，而是学会在任何时间中自由行走。',
          nextNodeId: 'ending_transcend',
          effect: { setFlag: 'ending_transcend' },
        },
        {
          key: 'loop',
          text: '我知道真相了——造成这一切的是我们自己。我选择打破这个循环。',
          nextNodeId: 'ending_loop',
          condition: { item: 'temporal_lens' },
          effect: { setFlag: 'ending_loop' },
        },
      ],
    },

    // === ENDING: MERGE ===
    ending_merge: {
      id: 'ending_merge',
      speaker: 'narrator',
      text: '三道光芒交织在一起，化为一道耀眼的白光。过去、现在、未来——所有的记忆与经历融为一体。',
      nextNodeId: 'ending_merge_2',
    },
    ending_merge_2: {
      id: 'ending_merge_2',
      speaker: 'narrator',
      text: '你不再是碎片化的存在。过去的天真、现在的坚韧、未来的智慧——全部汇聚成了完整的你。时间裂隙永远地闭合了。',
      nextNodeId: 'ending_final',
    },

    // === ENDING: SEPARATE ===
    ending_separate: {
      id: 'ending_separate',
      speaker: 'narrator',
      text: '三道光芒各自绽放，形成三道独立的彩虹。每条时间线重新稳定下来，各自继续自己的旅程。',
      nextNodeId: 'ending_separate_2',
    },
    ending_separate_2: {
      id: 'ending_separate_2',
      speaker: 'narrator',
      text: '虽然分离，但你们之间的羁绊永远存在。过去的自己会继续成长，未来的自己会继续守望。而你，将珍惜当下的每一刻。',
      nextNodeId: 'ending_final',
    },

    // === ENDING: TRANSCEND ===
    ending_transcend: {
      id: 'ending_transcend',
      speaker: 'narrator',
      text: '三道光芒化为一个旋转的光环，悬浮在你的周围。时间不再是一条线，而是一个你可以自由探索的空间。',
      nextNodeId: 'ending_transcend_2',
    },
    ending_transcend_2: {
      id: 'ending_transcend_2',
      speaker: 'narrator',
      text: '你获得了在时间中穿行的能力。过去不再是遗憾，未来不再是恐惧——因为你随时可以回来，随时可以出发。',
      nextNodeId: 'ending_final',
    },

    // === ENDING: ETERNAL LOOP (SECRET) ===
    ending_loop: {
      id: 'ending_loop',
      speaker: 'narrator',
      text: '你举起时间透镜——裂痕中的身影全部转过头来，看向你。那些身影……是无数个版本的你，在无数次循环中做出同样的选择。',
      nextNodeId: 'ending_loop_2',
    },
    ending_loop_2: {
      id: 'ending_loop_2',
      speaker: 'future-self',
      text: '你……你真的看到了？没有人到这一步过。在所有的时间线中，你是第一个收集到所有线索的人。',
      nextNodeId: 'ending_loop_3',
    },
    ending_loop_3: {
      id: 'ending_loop_3',
      speaker: 'past-self',
      text: '那个罗盘……它一直在指向这里，对吗？指向这个选择。',
      nextNodeId: 'ending_loop_4',
    },
    ending_loop_4: {
      id: 'ending_loop_4',
      speaker: 'narrator',
      text: '你将透镜放在光柱中央。裂痕不是闭合了——而是开始倒退。时间在倒流，但不是回到过去。而是回到裂隙最初产生之前。',
      nextNodeId: 'ending_loop_5',
    },
    ending_loop_5: {
      id: 'ending_loop_5',
      speaker: 'narrator',
      text: '循环被打破了。不再有裂隙，不再有悖论，不再有时间旅行——因为那个最初决定改变过去的念头，从未发生过。这是唯一一个真正的终结。',
      nextNodeId: 'ending_final',
    },

    // === FINAL ===
    ending_final: {
      id: 'ending_final',
      speaker: 'narrator',
      text: '感谢你完成了这段时空旅程。记住——无论在哪条时间线上，你都不是孤独的。因为过去和未来的自己，永远与你同在。',
      nextNodeId: null,
    },
  },
};
