import type { ExerciseIssue } from "./types"

export const issue10: ExerciseIssue = {
  id: "issue-10",
  menuTitle: "第10期 · 完成时",
  title: "第10期：过去/现在完成时",
  subtitle: "have/has done；had done",
  items: [
    {
      n: 1,
      prompt: "火车已经离开了。（火车=train，离开=leave[left]）",
      answers: ["The train has left."],
      explanation:
        "“已经”→现在完成；leave 过去分词 left。",
    },
    {
      n: 2,
      prompt: "我已经知道了这个信息（知道=know[knew/known][vt.]，信息=information）",
      answers: ["I have known this information."],
      explanation:
        "know 过去分词 known。",
    },
    {
      n: 3,
      prompt:
        "他在这家公司已经工作了十年。（公司=company，工作=work[worked/worked][vi.]，句末 for ten years）",
      answers: ["He has worked in this company for ten years."],
      explanation:
        "for ten years 表持续；主语 He→has。",
    },
    {
      n: 4,
      prompt: "昨晚，表演就已经结束了。（表演=performance，结束=over[adj.]）",
      answers: [
        "Last night, the performance had been over.",
        "Last night, the performance was over.",
      ],
      explanation:
        "昨晚已结束→过去完成 had been over 更贴“已经”；was over 也可接受。",
    },
    {
      n: 5,
      prompt: "小明已经见过这棵树了吗？（见到=see[saw/seen]，树=tree）",
      answers: ["Has Xiaoming seen this tree?"],
      explanation:
        "完成时疑问：Have/Has 提前；seen 为分词。",
    },
    {
      n: 6,
      prompt: "你去哪里了？（去=go[went/gone]）",
      answers: ["Where have you gone?"],
      explanation:
        "Where + have + you gone。",
    },
    {
      n: 7,
      prompt:
        "我在中午就已经卖了五个杯子（卖=sell[sold/sold]，杯子=cup，中午=noon，在中午=at noon）",
      answers: ["I had sold five cups at noon."],
      explanation:
        "at noon 表过去点 + 已经→过去完成 had sold。",
    },
    {
      n: 8,
      prompt: "这些家伙完成那些任务了吗？（家伙=guy，完成=complete，任务=task）",
      answers: [
        "Have these guys completed those tasks?",
        "Had these guys completed those tasks?",
      ],
      explanation:
        "时间未限定，现在/过去完成均可。",
    },
    {
      n: 9,
      prompt: "他已经找到线索了（找到=find[found/found]，线索=clue）",
      answers: [
        "He has found the clue.",
        "He has found the clues.",
      ],
      explanation:
        "clue 单复数未限定均可。",
    },
    {
      n: 10,
      prompt:
        "这只猫已经在广场上等一小时了。（广场=square，等=wait[vi.]，小时=hour）",
      answers: [
        "The cat has waited on the square for one hour.",
        "The cat has waited for one hour on the square.",
      ],
      explanation:
        "时间状语常放最后，地点倒数第二。",
    },
    {
      n: 11,
      prompt:
        "你的电话响了八秒。（电话=phone/telephone，响=ring[rang/rung][vi.]，秒=second）",
      answers: ["Your phone has rung for eight seconds."],
      explanation:
        "for eight seconds 表持续；rung 为过去分词。",
    },
    {
      n: 12,
      prompt: "小强已经达成他的目标了。（达成=achieve，目标=goal）",
      answers: [
        "Xiaoqiang has achieved his goal.",
        "Xiaoqiang had achieved his goal.",
      ],
      explanation:
        "has/had 视叙事时间而定。",
    },
    {
      n: 13,
      prompt:
        "他们已经在今天早上逃脱了。（今天早上=this morning，逃脱=escape[vi.]）",
      answers: [
        "They have escaped this morning.",
        "They had escaped this morning.",
      ],
      explanation:
        "若叙述视角已是过去，用 had；相对现在仍可用 have。",
    },
    {
      n: 14,
      prompt: "我把这份报纸撕了。（撕=tear[tore/torn][vt.]，报纸=newspaper）",
      answers: ["I have torn this newspaper."],
      explanation:
        "“把”字句译成主谓宾：I have torn this newspaper.",
    },
    {
      n: 15,
      prompt:
        "小红已经说了一千个单词了（说=say[said/said][vt.]，一千=one thousand，单词=word）",
      answers: [
        "Xiaohong has said one thousand words.",
        "Xiaohong had said one thousand words.",
      ],
      explanation:
        "has said / had said 视语境。",
    },
    {
      n: 16,
      prompt:
        "这头狼已经呼吸了两分钟。（狼=wolf，呼吸=breathe[vi.]，分钟=minute）",
      answers: [
        "This wolf has breathed for two minutes.",
        "This wolf had breathed for two minutes.",
      ],
      explanation:
        "for two minutes 表持续。",
    },
    {
      n: 17,
      prompt:
        "在此刻，这些玉米已经长大了。（时刻=moment，在此刻=at this moment，玉米=corn（不可数），长大=grow up[grew/grown]）",
      answers: ["At this moment, the corn has grown up."],
      explanation:
        "corn 不可数→has；grown up。",
    },
    {
      n: 18,
      prompt:
        "每个人都获得了一份奖品。（每个人=everyone（单数），获得=get[got/gotten]，奖品=prize）",
      answers: [
        "Everyone has got a prize.",
        "Everyone has gotten a prize.",
      ],
      explanation:
        "everyone 作单数→has；got/gotten 均可。",
    },
    {
      n: 19,
      prompt:
        "这些鹿在草地上待了三天了（鹿=deer（单复数同型），草地=grass，待=stay，天=day）",
      answers: ["These deer have stayed on the grass for three days."],
      explanation:
        "deer 复数仍为 deer；多只→have。",
    },
    {
      n: 20,
      prompt:
        "我们已经忘了那次旅程。（忘记=forget[forgot/forgotten][vt.]，旅程=journey）",
      answers: [
        "We have forgotten that journey.",
        "We had forgotten that journey.",
      ],
      explanation:
        "have forgotten / had forgotten 视叙事时间。",
    },
  ],
}
