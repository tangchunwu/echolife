import type { DialogueTree } from '../../types/game';

export const futureDialogue: DialogueTree = {
  id: 'future_chapter2',
  chapter: 2,
  scene: 'future',
  startNodeId: 'future_1',
  nodes: {
    future_1: {
      id: 'future_1',
      speaker: 'narrator',
      text: '你穿过传送门，来到一个截然不同的世界。冷蓝色的光芒笼罩着一切——这是一个漂浮在星空中的空间站。',
      nextNodeId: 'future_2',
      autoAdvance: true,
      delay: 3000,
    },
    future_2: {
      id: 'future_2',
      speaker: 'narrator',
      text: '全息投影在空中浮动，显示着无数数据流。在一面巨大的观景窗前，一个身影静静地望着外面的星空。那是——未来的你。',
      nextNodeId: 'future_3',
    },
    future_3: {
      id: 'future_3',
      speaker: 'future-self',
      text: '……你来了。我一直在等你。',
      options: [
        {
          key: 'surprised',
          text: '你在等我？你知道我会来？',
          nextNodeId: 'future_4a',
        },
        {
          key: 'direct',
          text: '未来的我，你看起来和我想象的不太一样。',
          nextNodeId: 'future_4b',
        },
        {
          key: 'cautious',
          text: '你真的是未来的我吗？你怎么知道我会出现？',
          nextNodeId: 'future_4c',
        },
      ],
    },
    future_4a: {
      id: 'future_4a',
      speaker: 'future-self',
      text: '因为我也曾经站在你现在的位置，穿过那扇门，见到了更远未来的自己。时间是一个环，而我们都是环上的节点。',
      nextNodeId: 'future_5',
    },
    future_4b: {
      id: 'future_4b',
      speaker: 'future-self',
      text: '人总会变的。不过核心的东西——你最在意的那些——一直都没变。你会明白的。',
      nextNodeId: 'future_5',
    },
    future_4c: {
      id: 'future_4c',
      speaker: 'future-self',
      text: '保持警惕是好事。但你应该能感觉到——我们之间的联系。毕竟，我就是你。',
      nextNodeId: 'future_5',
      onEnter: { setFlag: 'cautious_future' },
    },
    future_5: {
      id: 'future_5',
      speaker: 'future-self',
      text: '我需要告诉你一些重要的事。时间裂隙正在扩大，如果我们不修复它，所有时间线——过去、现在、未来——都会崩塌。',
      options: [
        {
          key: 'how_fix',
          text: '我们要怎么修复它？',
          nextNodeId: 'future_6a',
        },
        {
          key: 'why_happening',
          text: '为什么会发生这种事？',
          nextNodeId: 'future_6b',
        },
      ],
    },

    // === BRANCH A: The Plan Path ===
    future_6a: {
      id: 'future_6a',
      speaker: 'future-self',
      text: '你需要收集三条时间线中所有的记忆碎片，然后在悖论空间中将它们汇聚。只有过去、现在和未来的自己同时在场，才能封闭裂隙。',
      nextNodeId: 'future_6a2',
    },
    future_6a2: {
      id: 'future_6a2',
      speaker: 'future-self',
      text: '……这就是全部了。你只需要按计划行动就好。',
      options: [
        {
          key: 'press_further',
          text: '等一下，你的眼神告诉我不止这些。你还隐瞒了什么？',
          nextNodeId: 'future_6a3_press',
        },
        {
          key: 'trust',
          text: '好，我相信你。我们按计划行动。',
          nextNodeId: 'future_7',
        },
      ],
    },
    future_6a3_press: {
      id: 'future_6a3_press',
      speaker: 'future-self',
      text: '……你比我想象的更敏锐。好吧，有一件事我没说——裂隙不是自然产生的。是我造成的。',
      nextNodeId: 'future_6a4_press',
      onEnter: { setFlag: 'knows_truth' },
    },
    future_6a4_press: {
      id: 'future_6a4_press',
      speaker: 'future-self',
      text: '我曾经试图回到过去改变一个决定。每次回去，都留下了一条裂痕。这个透镜记录了每一条裂痕的位置。',
      nextNodeId: 'future_6a5_press',
    },
    future_6a5_press: {
      id: 'future_6a5_press',
      speaker: 'narrator',
      text: '未来的你从外套中取出一个冰冷的透镜，递到你手中。透过它，你可以看到空气中那些肉眼不可见的裂痕——如同玻璃上的裂纹，延伸到虚空之中。',
      nextNodeId: 'future_7',
      onEnter: { addItem: 'temporal_lens' },
    },

    // === BRANCH B: The Truth Path ===
    future_6b: {
      id: 'future_6b',
      speaker: 'future-self',
      text: '因为有人——或者说有某个版本的"我们"——试图改变时间线。每一次篡改都会留下裂痕。这些裂痕累积到了临界点。',
      nextNodeId: 'future_6b2',
      onEnter: { setFlag: 'knows_cause' },
    },
    future_6b2: {
      id: 'future_6b2',
      speaker: 'future-self',
      text: '我不想让你知道太多。有些真相……知道了反而更痛苦。',
      options: [
        {
          key: 'demand_proof',
          text: '不，我需要看到证据。让我自己判断。',
          nextNodeId: 'future_6b3_demand',
        },
        {
          key: 'respect',
          text: '我理解。也许有些事情现在不该知道。',
          nextNodeId: 'future_6b3_respect',
        },
      ],
    },
    future_6b3_demand: {
      id: 'future_6b3_demand',
      speaker: 'future-self',
      text: '……好吧。看看这个。',
      nextNodeId: 'future_6b4_demand',
    },
    future_6b4_demand: {
      id: 'future_6b4_demand',
      speaker: 'narrator',
      text: '未来的你拿出一个透镜——通过它，你看到了无数重叠的时间线，像蛛网一样交织。每条裂痕旁边，都站着一个模糊的身影——那个身影……是你自己。',
      nextNodeId: 'future_6b5_demand',
      onEnter: { addItem: 'temporal_lens' },
    },
    future_6b5_demand: {
      id: 'future_6b5_demand',
      speaker: 'future-self',
      text: '现在你明白了吧？造成这一切的，不是别人——是我们自己。在无数个时间线中，不同版本的我们都在试图修改过去。每一次修改，都让裂隙更大。',
      nextNodeId: 'future_7',
      onEnter: { setFlag: 'saw_truth' },
    },
    future_6b3_respect: {
      id: 'future_6b3_respect',
      speaker: 'future-self',
      text: '谢谢你的理解。知道有些事该放下的人……已经比大多数版本的我们更成熟了。',
      nextNodeId: 'future_7',
      onEnter: { setFlag: 'showed_restraint' },
    },

    // === CONVERGE ===
    future_7: {
      id: 'future_7',
      speaker: 'future-self',
      text: '这是我为你准备的——来自未来的信件，以及通往悖论空间的钥匙碎片。',
      nextNodeId: 'future_8',
      onEnter: { addItem: 'memory_fragment_3' },
    },
    future_8: {
      id: 'future_8',
      speaker: 'future-self',
      text: '在你走之前，我想问你一个问题——如果你可以改变过去的一个决定，你会改变什么？',
      options: [
        {
          key: 'nothing',
          text: '什么都不改变。每个选择都塑造了现在的我。',
          nextNodeId: 'future_9a',
        },
        {
          key: 'something',
          text: '也许会有一些遗憾……但改变过去真的是正确的吗？',
          nextNodeId: 'future_9b',
        },
        {
          key: 'question_back',
          text: '你呢？你有想改变的事吗？',
          nextNodeId: 'future_9c',
        },
        {
          key: 'lens_response',
          text: '我已经通过透镜看到了答案。改变过去只会制造更多裂痕。',
          nextNodeId: 'future_9d',
          condition: { item: 'temporal_lens' },
        },
      ],
    },
    future_9a: {
      id: 'future_9a',
      speaker: 'future-self',
      text: '……很好的回答。我花了很长时间才得出同样的结论。看来有些智慧，不需要等到未来才能拥有。',
      nextNodeId: 'future_10',
      onEnter: { setFlag: 'accepted_past' },
    },
    future_9b: {
      id: 'future_9b',
      speaker: 'future-self',
      text: '这正是关键所在——改变过去的诱惑是巨大的，但每一次改变都会产生新的裂痕。我们要做的不是改变，而是接受和修复。',
      nextNodeId: 'future_10',
    },
    future_9c: {
      id: 'future_9c',
      speaker: 'future-self',
      text: '我吗？……曾经有。但经历了这一切之后，我学会了一件事：与其改变过去，不如珍惜当下。',
      nextNodeId: 'future_10',
      onEnter: { setFlag: 'future_wisdom' },
    },
    future_9d: {
      id: 'future_9d',
      speaker: 'future-self',
      text: '……你用了透镜。你看到了那些裂痕中的身影了吗？那是无数个版本的我们，都在犯同样的错误。而你，是第一个选择直面真相的。',
      nextNodeId: 'future_10',
      onEnter: { setFlag: 'lens_wisdom' },
    },
    future_10: {
      id: 'future_10',
      speaker: 'future-self',
      text: '拿着这个，悖论核心——当你收集到足够的碎片，它会带你到最终的空间。',
      nextNodeId: 'future_11',
      onEnter: { addItem: 'paradox_core' },
    },
    future_11: {
      id: 'future_11',
      speaker: 'future-self',
      text: '去吧，过去的我。在悖论空间中，我们会再次相遇。到那时，三个时间线的我们将一起决定命运。',
      nextNodeId: null,
    },
  },
};
