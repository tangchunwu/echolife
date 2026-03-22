import type { DialogueTree } from '../../types/game';

export const hallDialogue: DialogueTree = {
  id: 'hall_intro',
  chapter: 1,
  scene: 'hall',
  startNodeId: 'hall_1',
  nodes: {
    hall_1: {
      id: 'hall_1',
      speaker: 'narrator',
      text: '你在一片虚无中醒来。四周漂浮着光芒碎片，脚下是一个悬浮的圆形平台。',
      nextNodeId: 'hall_2',
      autoAdvance: true,
      delay: 3000,
    },
    hall_2: {
      id: 'hall_2',
      speaker: 'narrator',
      text: '平台中央矗立着一个巨大的沙漏，沙粒在其中逆流而上。三扇发光的门环绕着你——分别通往过去、现在与未来。',
      nextNodeId: 'hall_3',
      autoAdvance: true,
      delay: 3500,
    },
    hall_3: {
      id: 'hall_3',
      speaker: 'narrator',
      text: '一个声音在你脑海中响起……',
      nextNodeId: 'hall_4',
    },
    hall_4: {
      id: 'hall_4',
      speaker: 'narrator',
      text: '"旅者，你已在时间的裂缝中迷失。要找到回去的路，你必须面对过去的自己、认识未来的自己。"',
      options: [
        {
          key: 'curious',
          text: '这是什么地方？我为什么会在这里？',
          nextNodeId: 'hall_5a',
        },
        {
          key: 'brave',
          text: '告诉我需要做什么，我准备好了。',
          nextNodeId: 'hall_5b',
        },
        {
          key: 'confused',
          text: '过去的自己？未来的自己？这不可能……',
          nextNodeId: 'hall_5c',
        },
      ],
    },
    hall_5a: {
      id: 'hall_5a',
      speaker: 'narrator',
      text: '"这里是时间裂隙——所有时间线交汇的节点。你的记忆出现了裂痕，只有与不同时间的自己对话，才能修复它们。"',
      nextNodeId: 'hall_6',
    },
    hall_5b: {
      id: 'hall_5b',
      speaker: 'narrator',
      text: '"勇气可嘉。但记住，在时间的迷宫中，最大的敌人往往是自己。"',
      nextNodeId: 'hall_6',
      onEnter: { setFlag: 'brave_start' },
    },
    hall_5c: {
      id: 'hall_5c',
      speaker: 'narrator',
      text: '"在这里，不可能只是一个尚未被理解的可能。你很快就会明白。"',
      nextNodeId: 'hall_6',
    },
    hall_6: {
      id: 'hall_6',
      speaker: 'narrator',
      text: '"沙漏中藏有你需要的第一把钥匙。走近它，触碰你的命运。"',
      nextNodeId: 'hall_7',
    },
    hall_7: {
      id: 'hall_7',
      speaker: 'narrator',
      text: '沙漏发出耀眼的光芒，一个碎片从中飘出——这是通往过去的钥匙。',
      nextNodeId: null,
      onEnter: { addItem: 'time_key_past' },
    },
  },
};

export const hallReturnDialogue: DialogueTree = {
  id: 'hall_return',
  chapter: 1,
  scene: 'hall',
  startNodeId: 'hr_1',
  nodes: {
    hr_1: {
      id: 'hr_1',
      speaker: 'narrator',
      text: '你回到了时间裂隙大厅。沙漏中的沙粒流动得更快了。',
      options: [
        {
          key: 'check_hourglass',
          text: '再次观察沙漏',
          nextNodeId: 'hr_2',
        },
        {
          key: 'explore',
          text: '查看传送门',
          nextNodeId: null,
        },
      ],
    },
    hr_2: {
      id: 'hr_2',
      speaker: 'narrator',
      text: '沙漏发出微弱的脉动。每一次脉动，都像是时间在叹息。你感觉到更多的记忆正在等待被发现。',
      nextNodeId: null,
    },
  },
};
