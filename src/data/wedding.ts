/**
 * wedding.ts — every piece of wedding content lives here.
 *
 * Components never hard-code names, dates, copy or image paths; they read from
 * this object. To make the invitation your own you should only need to edit
 * this file and drop replacement photographs into `public/images/`.
 */

export const LANGUAGES = ["en", "zh", "kh"] as const;

export type Lang = (typeof LANGUAGES)[number];

/** A string in each of the three supported languages. */
export type Localized = Record<Lang, string>;

/** Photo ratios the layout knows how to frame without distorting the image. */
export type Ratio = "9/16" | "4/5" | "3/4" | "1/1" | "16/9" | "8/5";

export type Photo = {
  src: string;
  alt: Localized;
  ratio: Ratio;
};

/** How a gallery photo sits in the editorial grid. */
export type GallerySpan = "full" | "half" | "wide";

export type GalleryPhoto = Photo & { span: GallerySpan };

export type StoryChapter = {
  id: string;
  year: string;
  title: Localized;
  body: Localized;
  photo: Photo;
};

/** One kind of thing that can fall over the invitation. */
export type PetalPiece = {
  src: string;
  /** Relative chance of being picked, against the other pieces. */
  weight: number;
  minSize: number;
  maxSize: number;
  maxOpacity: number;
};

/** One line on the running order of the day. */
export type ScheduleItem = {
  id: string;
  time: Localized;
  title: Localized;
  /** Optional line under the title. */
  note?: Localized;
};

export const wedding = {
  /* ---- The couple ------------------------------------------------------ */
  couple: {
    bride: {
      name: "Lita",
      displayName: { en: "Lita", zh: "丽塔", kh: "លីតា" } as Localized,
      fullName: {
        en: "Lita Sreyneang",
        zh: "丽塔 · 斯雷妮昂",
        kh: "លីតា ស្រីនាង",
      } as Localized,
      note: {
        en: "Daughter of Mr. & Mrs. Sokha",
        zh: "索卡先生与夫人之女",
        kh: "បុត្រីរបស់លោក និងលោកស្រី សុខា",
      } as Localized,
      photo: {
        src: "/images/bride.webp",
        ratio: "4/5",
        alt: {
          en: "Portrait of the bride",
          zh: "新娘肖像",
          kh: "រូបភាពកូនក្រមុំ",
        },
      } as Photo,
    },
    groom: {
      name: "Kim",
      displayName: { en: "Kim", zh: "金", kh: "គីម" } as Localized,
      fullName: {
        en: "Kim Vanthorn",
        zh: "金 · 万通",
        kh: "គីម វ៉ាន់ធន",
      } as Localized,
      note: {
        en: "Son of Mr. & Mrs. Vanthorn",
        zh: "万通先生与夫人之子",
        kh: "បុត្ររបស់លោក និងលោកស្រី វ៉ាន់ធន",
      } as Localized,
      photo: {
        src: "/images/groom.webp",
        ratio: "4/5",
        alt: {
          en: "Portrait of the groom",
          zh: "新郎肖像",
          kh: "រូបភាពកូនកំលោះ",
        },
      } as Photo,
    },
  },

  /* ---- The day --------------------------------------------------------- */
  /** The moment the countdown counts towards. Offset is Indochina Time. */
  date: "2026-12-20T09:00:00+07:00",

  dateLabel: {
    en: "20 December 2026",
    zh: "二〇二六年十二月二十日",
    kh: "ថ្ងៃទី ២០ ខែធ្នូ ឆ្នាំ ២០២៦",
  } as Localized,

  dateShort: {
    en: "20.12.2026",
    zh: "20.12.2026",
    kh: "២០.១២.២០២៦",
  } as Localized,

  dayOfWeek: {
    en: "Sunday",
    zh: "星期日",
    kh: "ថ្ងៃអាទិត្យ",
  } as Localized,

  /* ---- Cover ----------------------------------------------------------- */
  cover: {
    photo: {
      src: "/images/cover.webp",
      ratio: "9/16",
      alt: {
        en: "The couple photographed in warm evening light",
        zh: "暖光中的新人合影",
        kh: "រូបគូស្វាមីភរិយាក្នុងពន្លឺរះល្ងាច",
      },
    } as Photo,
    kicker: {
      en: "Together with our families",
      zh: "偕同双方家人",
      kh: "រួមជាមួយក្រុមគ្រួសារទាំងសងខាង",
    } as Localized,
  },

  /* ---- Hero ------------------------------------------------------------ */
  hero: {
    photo: {
      src: "/images/hero.webp",
      ratio: "4/5",
      alt: {
        en: "The couple standing together",
        zh: "并肩而立的新人",
        kh: "គូស្វាមីភរិយាឈរជាមួយគ្នា",
      },
    } as Photo,
  },

  /* ---- Opening message ------------------------------------------------- */
  message: {
    en: "With joyful hearts\nand the blessings of our families,\n\nwe invite you to celebrate\nour special day with us.",
    zh: "怀着喜悦的心\n在双方家人的祝福之下，\n\n诚挚邀请您\n与我们共度这个特别的日子。",
    kh: "ដោយបេះដូងពោរពេញដោយសេចក្តីរីករាយ\nនិងពរជ័យពីក្រុមគ្រួសារទាំងសងខាង\n\nយើងខ្ញុំសូមគោរពអញ្ជើញលោកអ្នក\nមកចូលរួមអបអរថ្ងៃពិសេសនេះជាមួយយើងខ្ញុំ។",
  } as Localized,

  verse: {
    en: "“May two hearts keep one road — through every season, in the quiet days and the loud ones alike.”",
    zh: "「愿两颗心从此同行，风雨同路，岁岁平安。」",
    kh: "«សូមឲ្យបេះដូងទាំងពីរដើរជាមួយគ្នា ក្នុងសុភមង្គល និងសេចក្តីស្រឡាញ់ជារៀងរហូត។»",
  } as Localized,

  /* ---- Our story ------------------------------------------------------- */
  story: [
    {
      id: "first-meeting",
      year: "2021",
      title: {
        en: "The first meeting",
        zh: "初次相遇",
        kh: "ការជួបគ្នាលើកដំបូង",
      },
      body: {
        en: "A friend's birthday, a crowded room, and a conversation that lasted long after everyone else had gone home.",
        zh: "朋友的生日聚会，人来人往的房间，一场在众人散去后仍未结束的谈话。",
        kh: "ខួបកំណើតមិត្តភក្តិម្នាក់ បន្ទប់ដ៏មមាញឹក និងការសន្ទនាមួយដែលបន្តយូរ ក្រោយពេលអ្នកផ្សេងបានត្រឡប់ទៅផ្ទះអស់ហើយ។",
      },
      photo: {
        src: "/images/story-01.webp",
        ratio: "4/5",
        alt: {
          en: "The evening they first met",
          zh: "初遇的那个夜晚",
          kh: "រាត្រីដែលពួកគេជួបគ្នាលើកដំបូង",
        },
      },
    },
    {
      id: "our-journey",
      year: "2022",
      title: {
        en: "Our journey",
        zh: "一路同行",
        kh: "ដំណើររបស់យើង",
      },
      body: {
        en: "Two cities, countless late calls, and a hundred small mornings that quietly turned into a life we were building together.",
        zh: "两座城市，无数个深夜通话，还有上百个平凡的清晨，悄悄汇成我们共同的生活。",
        kh: "ទីក្រុងពីរ ការហៅទូរស័ព្ទយប់ជ្រៅរាប់មិនអស់ និងព្រឹកតូចៗរាប់រយ ដែលបានក្លាយទៅជាជីវិតមួយដែលយើងកំពុងកសាងជាមួយគ្នា។",
      },
      photo: {
        src: "/images/story-02.webp",
        ratio: "4/5",
        alt: {
          en: "Travelling together",
          zh: "一起旅行",
          kh: "ធ្វើដំណើរជាមួយគ្នា",
        },
      },
    },
    {
      id: "the-proposal",
      year: "2025",
      title: {
        en: "The proposal",
        zh: "求婚",
        kh: "ការសុំដៃ",
      },
      body: {
        en: "By the river at dusk, with the question already answered long before it was ever asked.",
        zh: "黄昏的河畔，答案其实在提问之前就已经存在了。",
        kh: "នៅមាត់ទន្លេពេលព្រលប់ ចម្លើយបានមានរួចហើយ តាំងពីមុនសំណួរត្រូវបានសួរទៅទៀត។",
      },
      photo: {
        src: "/images/story-03.webp",
        ratio: "4/5",
        alt: {
          en: "The proposal by the river",
          zh: "河畔求婚",
          kh: "ការសុំដៃនៅមាត់ទន្លេ",
        },
      },
    },
    {
      id: "the-wedding",
      year: "2026",
      title: {
        en: "The wedding",
        zh: "婚礼",
        kh: "ពិធីមង្គលការ",
      },
      body: {
        en: "Beginning our next chapter together — and we would love for you to be there as it opens.",
        zh: "我们即将翻开人生的下一页——希望这一页上，也有您的身影。",
        kh: "ចាប់ផ្តើមជំពូកបន្ទាប់ជាមួយគ្នា ហើយយើងខ្ញុំសង្ឃឹមថានឹងមានវត្តមានលោកអ្នកនៅទីនោះផងដែរ។",
      },
      photo: {
        src: "/images/story-04.webp",
        ratio: "4/5",
        alt: {
          en: "Looking ahead together",
          zh: "共同展望",
          kh: "មើលទៅអនាគតជាមួយគ្នា",
        },
      },
    },
  ] as StoryChapter[],

  /* ---- Running order of the day ---------------------------------------- */
  schedule: [
    {
      id: "arrival",
      time: {
        en: "06:00 AM",
        zh: "上午 06:00",
        kh: "ម៉ោង ០៦:០០ ព្រឹក",
      },
      title: {
        en: "Guest arrival & welcome refreshments",
        zh: "宾客入场与迎宾茶点",
        kh: "ភ្ញៀវមកដល់ និងភេសជ្ជៈស្វាគមន៍",
      },
    },
    {
      id: "ceremony",
      time: {
        en: "06:30 AM – 11:30 AM",
        zh: "上午 06:30 – 11:30",
        kh: "ម៉ោង ០៦:៣០ – ១១:៣០ ព្រឹក",
      },
      title: {
        en: "Traditional wedding ceremony",
        zh: "传统婚礼仪式",
        kh: "ពិធីមង្គលការបែបប្រពៃណី",
      },
      note: {
        en: "Cambodian traditional wedding rituals",
        zh: "柬埔寨传统婚礼礼俗",
        kh: "ពិធីតាមបែបប្រពៃណីខ្មែរ",
      },
    },
    {
      id: "lunch",
      time: {
        en: "11:30 AM",
        zh: "上午 11:30",
        kh: "ម៉ោង ១១:៣០ ព្រឹក",
      },
      title: { en: "Lunch", zh: "午宴", kh: "អាហារថ្ងៃត្រង់" },
    },
    {
      id: "break",
      time: {
        en: "01:00 PM – 05:00 PM",
        zh: "下午 01:00 – 05:00",
        kh: "ម៉ោង ០១:០០ – ០៥:០០ រសៀល",
      },
      title: {
        en: "Break / guests return home to rest",
        zh: "休息／宾客返家休憩",
        kh: "សម្រាក / ភ្ញៀវត្រឡប់ទៅផ្ទះសម្រាក",
      },
    },
    {
      id: "dinner",
      time: {
        en: "05:00 PM – 09:00 PM",
        zh: "下午 05:00 – 09:00",
        kh: "ម៉ោង ០៥:០០ – ០៩:០០ ល្ងាច",
      },
      title: {
        en: "Dinner, photo session & celebration",
        zh: "晚宴、合影与庆祝",
        kh: "អាហារពេលល្ងាច ថតរូប និងការអបអរ",
      },
    },
  ] as ScheduleItem[],

  /* ---- Gallery --------------------------------------------------------- */
  gallery: [
    {
      src: "/images/gallery-01.webp",
      ratio: "4/5",
      span: "full",
      alt: { en: "The couple in soft light", zh: "柔光中的新人", kh: "គូស្នេហ៍ក្នុងពន្លឺទន់" },
    },
    {
      src: "/images/gallery-02.webp",
      ratio: "3/4",
      span: "half",
      alt: { en: "Holding hands", zh: "十指相扣", kh: "កាន់ដៃគ្នា" },
    },
    {
      src: "/images/gallery-03.webp",
      ratio: "3/4",
      span: "half",
      alt: { en: "A quiet moment", zh: "静谧的片刻", kh: "ពេលវេលាស្ងប់ស្ងាត់" },
    },
    {
      src: "/images/gallery-04.webp",
      ratio: "16/9",
      span: "wide",
      alt: { en: "Walking by the water", zh: "水边漫步", kh: "ដើរលេងតាមមាត់ទឹក" },
    },
    {
      src: "/images/gallery-05.webp",
      ratio: "4/5",
      span: "full",
      alt: { en: "Portrait at golden hour", zh: "黄昏时分的肖像", kh: "រូបថតពេលថ្ងៃលិច" },
    },
    {
      src: "/images/gallery-06.webp",
      ratio: "1/1",
      span: "half",
      alt: { en: "Details of the day", zh: "当日细节", kh: "ព័ត៌មានលម្អិតនៃថ្ងៃនោះ" },
    },
    {
      src: "/images/gallery-07.webp",
      ratio: "1/1",
      span: "half",
      alt: { en: "Flowers and light", zh: "花与光", kh: "ផ្កា និងពន្លឺ" },
    },
    {
      src: "/images/gallery-08.webp",
      ratio: "8/5",
      span: "wide",
      alt: { en: "Laughing together", zh: "相视而笑", kh: "សើចជាមួយគ្នា" },
    },
    {
      src: "/images/gallery-09.webp",
      ratio: "3/4",
      span: "half",
      alt: { en: "An unposed frame", zh: "自然的瞬间", kh: "ខណៈពេលធម្មជាតិ" },
    },
    {
      src: "/images/gallery-10.webp",
      ratio: "3/4",
      span: "half",
      alt: { en: "Side by side", zh: "并肩而行", kh: "ជាមួយគ្នាម្ខាងៗ" },
    },
  ] as GalleryPhoto[],

  /* ---- Video ----------------------------------------------------------- */
  video: {
    enabled: true,
    /**
     * YouTube, Vimeo and direct MP4 links are all supported. The player only
     * loads after the guest presses play, so the thumbnail costs nothing.
     */
    url: "https://www.youtube.com/watch?v=bu7nU9Mhpyo",
    title: {
      en: "A moment to remember",
      zh: "值得铭记的时刻",
      kh: "ពេលវេលាដែលគួរចងចាំ",
    } as Localized,
    caption: {
      en: "Our pre-wedding film",
      zh: "我们的婚前影片",
      kh: "ខ្សែភាពយន្តមុនអាពាហ៍ពិពាហ៍",
    } as Localized,
    poster: {
      src: "/images/video-thumb.webp",
      ratio: "16/9",
      alt: {
        en: "Still frame from the wedding film",
        zh: "婚礼影片剧照",
        kh: "រូបភាពពីខ្សែភាពយន្ត",
      },
    } as Photo,
  },

  /* ---- Location -------------------------------------------------------- */
  location: {
    venue: {
      en: "Riverside Garden Hall",
      zh: "河畔花园礼堂",
      kh: "សាលមង្គលការ រីវើសាយ ហ្គាឌិន",
    } as Localized,
    address: {
      en: "No. 24, Street 240, Daun Penh\nPhnom Penh, Cambodia",
      zh: "柬埔寨 金边市\n多农奔区 240 街 24 号",
      kh: "ផ្ទះលេខ ២៤ ផ្លូវ ២៤០ ខណ្ឌដូនពេញ\nរាជធានីភ្នំពេញ ព្រះរាជាណាចក្រកម្ពុជា",
    } as Localized,
    note: {
      en: "Parking is available on site from 08:30.",
      zh: "现场停车场于 08:30 起开放。",
      kh: "មានកន្លែងចតរថយន្តនៅនឹងកន្លែង ចាប់ពីម៉ោង ០៨:៣០។",
    } as Localized,
    googleMapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Riverside+Garden+Hall+Phnom+Penh",
    mapPreview: {
      src: "/images/map.webp",
      ratio: "8/5",
      alt: {
        en: "Map showing the venue location",
        zh: "场地位置地图",
        kh: "ផែនទីបង្ហាញទីតាំងកន្លែងប្រារព្ធពិធី",
      },
    } as Photo,
  },

  /* ---- Music ----------------------------------------------------------- */
  music: {
    enabled: true,
    /** Any audio file under `public/audio/` — mp3, m4a/mp4, ogg or wav. */
    url: "/audio/khmer.mp4",
    title: {
      en: "Invitation theme",
      zh: "邀请主题曲",
      kh: "បទភ្លេងអញ្ជើញ",
    } as Localized,
    volume: 0.45,
  },

  /* ---- Decoration ------------------------------------------------------ */
  decor: {
    /**
     * Romduol blossoms and 囍 drifting down over the invitation. Add or remove
     * pieces freely — anything in `public/` works. `weight` controls how often
     * a piece is picked, so the red 囍 stays an occasional accent rather than
     * the main event.
     */
    petals: {
      enabled: true,
      /** How many are in the air at once. */
      count: 18,
      pieces: [
        {
          src: "/romdoul_flower.svg",
          weight: 3,
          minSize: 14,
          maxSize: 28,
          maxOpacity: 0.6,
        },
        {
          src: "/喜.png",
          weight: 1,
          /* Large enough that 囍 still reads as a character, not a blob. */
          minSize: 17,
          maxSize: 28,
          maxOpacity: 0.4,
        },
      ] as PetalPiece[],
    },
  },

  /* ---- Closing --------------------------------------------------------- */
  closing: {
    photo: {
      src: "/images/closing.webp",
      ratio: "9/16",
      alt: {
        en: "The couple walking away together",
        zh: "携手离去的新人",
        kh: "គូស្នេហ៍ដើរចេញជាមួយគ្នា",
      },
    } as Photo,
  },

  /* ---- Guest features -------------------------------------------------- */
  wishes: {
    enabled: true,
    /**
     * Where wishes go. Leave as `null` to keep them in the guest's browser;
     * set it to a form endpoint — a Google Apps Script URL, a Formspree form,
     * your own API route — to start collecting them.
     */
    endpoint: null as string | null,
    /** Shown before any guest has written, so the section is never empty. */
    seed: [
      {
        name: "Sophea & Dara",
        message: {
          en: "So happy for you both. Wishing you a lifetime of quiet mornings and loud laughter.",
          zh: "由衷替你们高兴。愿你们的日子有安静的清晨，也有热闹的笑声。",
          kh: "រីករាយជាមួយអ្នកទាំងពីរណាស់។ សូមជូនពរឲ្យមានព្រឹកស្ងប់ស្ងាត់ និងសំណើចរីករាយពេញមួយជីវិត។",
        } as Localized,
      },
      {
        name: "Lin Wei",
        message: {
          en: "From the first time you introduced us, we knew. Congratulations to you both.",
          zh: "从你们第一次介绍彼此给我们认识时，我们就知道了。祝福你们。",
          kh: "តាំងពីលើកដំបូងដែលអ្នកណែនាំយើងឲ្យស្គាល់គ្នា យើងបានដឹងហើយ។ សូមអបអរសាទរ។",
        } as Localized,
      },
    ],
  },

  /* ---- Site metadata --------------------------------------------------- */
  meta: {
    /** Used for canonical and Open Graph URLs. */
    siteUrl: "https://example.com",
    ogImage: "/images/og.jpg",
  },
};

/** The moment the countdown runs towards. */
export const weddingDate = new Date(wedding.date);
