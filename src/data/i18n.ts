/**
 * i18n.ts — interface copy in the three supported languages.
 *
 * Wedding *content* lives in `wedding.ts`; this file holds the words that
 * belong to the interface itself: navigation, buttons, form labels and the
 * small section headings that frame the content.
 */

import type { Lang, Localized } from "./wedding";

/** How each language names itself in the switcher. */
export const languageShortNames: Record<Lang, string> = {
  en: "ENG",
  zh: "中文",
  kh: "ខ្មែរ",
};

/** The BCP 47 tag written onto `<html lang>` for each language. */
export const htmlLang: Record<Lang, string> = {
  en: "en",
  zh: "zh-Hans",
  kh: "km",
};

/** Weekday headings for the calendar grid, Monday first. */
export const weekdayNames: Record<Lang, readonly string[]> = {
  en: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  zh: ["一", "二", "三", "四", "五", "六", "日"],
  kh: ["ចន្ទ", "អង្គារ៍", "ពុធ", "ព្រហស្បតិ៍", "សុក្រ", "សៅរ៍", "អាទិត្យ"],
};

/** Month names, January first, for the head of the calendar. */
export const monthNames: Record<Lang, readonly string[]> = {
  en: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],
  zh: [
    "一月",
    "二月",
    "三月",
    "四月",
    "五月",
    "六月",
    "七月",
    "八月",
    "九月",
    "十月",
    "十一月",
    "十二月",
  ],
  kh: [
    "មករា",
    "កុម្ភៈ",
    "មីនា",
    "មេសា",
    "ឧសភា",
    "មិថុនា",
    "កក្កដា",
    "សីហា",
    "កញ្ញា",
    "តុលា",
    "វិច្ឆិកា",
    "ធ្នូ",
  ],
};

export const ui = {
  cover: {
    open: {
      en: "Open invitation",
      zh: "开启请柬",
      kh: "បើកធៀបអញ្ជើញ",
    },
  },

  language: {
    label: { en: "Language", zh: "语言", kh: "ភាសា" },
  },

  music: {
    play: { en: "Play music", zh: "播放音乐", kh: "បើកតន្ត្រី" },
    pause: { en: "Pause music", zh: "暂停音乐", kh: "ផ្អាកតន្ត្រី" },
  },

  couple: {
    eyebrow: { en: "The couple", zh: "新人", kh: "គូស្វាមីភរិយា" },
    bride: { en: "Bride", zh: "新娘", kh: "កូនក្រមុំ" },
    groom: { en: "Groom", zh: "新郎", kh: "កូនកំលោះ" },
  },

  story: {
    eyebrow: { en: "Our story", zh: "我们的故事", kh: "រឿងរ៉ាវរបស់យើង" },
    title: {
      en: "How we\ngot here",
      zh: "我们\n一路走来",
      kh: "របៀប\nដែលយើងមកដល់ទីនេះ",
    },
  },

  calendar: {
    weddingDay: {
      en: "Our wedding day",
      zh: "我们的大喜之日",
      kh: "ថ្ងៃមង្គលការរបស់យើង",
    },
    saveTheDate: {
      en: "Save the date in your calendar",
      zh: "记得把这一天写进日历",
      kh: "កត់ទុកក្នុងប្រតិទិនរបស់អ្នក",
    },
  },

  countdown: {
    title: {
      en: "Counting down\nto our day",
      zh: "距离我们的\n大喜之日",
      kh: "រាប់ថយក្រោយ\nទៅកាន់ថ្ងៃរបស់យើង",
    },
    days: { en: "Days", zh: "天", kh: "ថ្ងៃ" },
    hours: { en: "Hours", zh: "时", kh: "ម៉ោង" },
    minutes: { en: "Minutes", zh: "分", kh: "នាទី" },
    seconds: { en: "Seconds", zh: "秒", kh: "វិនាទី" },
    today: {
      en: "Today is our day",
      zh: "今天就是我们的大喜之日",
      kh: "ថ្ងៃនេះគឺជាថ្ងៃរបស់យើង",
    },
  },

  schedule: {
    eyebrow: {
      en: "Wedding schedule",
      zh: "当日流程",
      kh: "កាលវិភាគមង្គលការ",
    },
    title: {
      en: "The day,\nhour by hour",
      zh: "这一天的\n时间安排",
      kh: "ថ្ងៃនោះ\nម៉ោងម្តងៗ",
    },
    intro: {
      en: "A little timeline of our special day.",
      zh: "我们这个特别日子的小小时间表。",
      kh: "កាលវិភាគខ្លីៗនៃថ្ងៃពិសេសរបស់យើង។",
    },
  },

  location: {
    eyebrow: { en: "The venue", zh: "婚礼场地", kh: "ទីកន្លែង" },
    openMaps: {
      en: "Open in Google Maps",
      zh: "在 Google 地图中打开",
      kh: "បើកក្នុង Google Maps",
    },
  },

  gallery: {
    eyebrow: { en: "Gallery", zh: "相册", kh: "វិចិត្រសាល" },
    title: {
      en: "Moments\nalong the way",
      zh: "沿途的\n点点滴滴",
      kh: "ពេលវេលា\nតាមផ្លូវ",
    },
    open: { en: "View photo", zh: "查看照片", kh: "មើលរូបភាព" },
    close: { en: "Close", zh: "关闭", kh: "បិទ" },
    previous: { en: "Previous photo", zh: "上一张", kh: "រូបភាពមុន" },
    next: { en: "Next photo", zh: "下一张", kh: "រូបភាពបន្ទាប់" },
  },

  video: {
    eyebrow: { en: "Our film", zh: "影片", kh: "ខ្សែភាពយន្ត" },
    play: { en: "Play film", zh: "播放影片", kh: "បើកខ្សែភាពយន្ត" },
  },

  wishes: {
    eyebrow: { en: "Guest wishes", zh: "宾客祝福", kh: "ពាក្យជូនពរ" },
    title: {
      en: "Leave a\nfew words",
      zh: "留下\n您的祝福",
      kh: "ទុកពាក្យ\nពេចន៍ខ្លីៗ",
    },
    name: { en: "Name", zh: "称呼", kh: "ឈ្មោះ" },
    namePlaceholder: { en: "Your name", zh: "您的称呼", kh: "ឈ្មោះរបស់អ្នក" },
    message: { en: "Message", zh: "祝福语", kh: "សារ" },
    messagePlaceholder: {
      en: "Write your wish for the couple",
      zh: "写下您对新人的祝福",
      kh: "សរសេរពាក្យជូនពររបស់អ្នក",
    },
    submit: { en: "Send wish", zh: "送出祝福", kh: "ផ្ញើពាក្យជូនពរ" },
    submitting: { en: "Sending…", zh: "送出中…", kh: "កំពុងផ្ញើ…" },
    empty: {
      en: "Be the first to leave a wish.",
      zh: "成为第一位留下祝福的人。",
      kh: "ក្លាយជាអ្នកដំបូងដែលទុកពាក្យជូនពរ។",
    },
    thanks: {
      en: "Thank you for your kind words.",
      zh: "谢谢您的祝福。",
      kh: "សូមអរគុណសម្រាប់ពាក្យពេចន៍ដ៏ល្អ។",
    },
    errorFields: {
      en: "Please add your name and a message.",
      zh: "请填写称呼与祝福语。",
      kh: "សូមបញ្ចូលឈ្មោះ និងសាររបស់អ្នក។",
    },
    justNow: { en: "Just now", zh: "刚刚", kh: "ទើបតែឥឡូវ" },
    storedLocally: {
      en: "Wishes you add are kept on this device.",
      zh: "您留下的祝福会保存在此设备上。",
      kh: "ពាក្យជូនពររបស់អ្នកត្រូវបានរក្សាទុកក្នុងឧបករណ៍នេះ។",
    },
    errorSend: {
      en: "Something went wrong. Please try again.",
      zh: "送出失败，请再试一次。",
      kh: "មានបញ្ហាកើតឡើង។ សូមព្យាយាមម្តងទៀត។",
    },
  },

  closing: {
    thankYou: { en: "Thank you", zh: "谢谢您", kh: "សូមអរគុណ" },
    line: {
      en: "For being part of our story.",
      zh: "感谢您成为我们故事的一部分。",
      kh: "សម្រាប់ការក្លាយជាផ្នែកមួយនៃរឿងរ៉ាវរបស់យើង។",
    },
    backToTop: { en: "Back to top", zh: "回到顶部", kh: "ត្រឡប់ទៅលើ" },
  },

  common: {
    skipToContent: {
      en: "Skip to invitation",
      zh: "跳至请柬内容",
      kh: "រំលងទៅកាន់ធៀបអញ្ជើញ",
    },
  },
} satisfies Record<string, Record<string, Localized>>;

export type UiDictionary = typeof ui;
