// O'zbek → Ingliz | A1 | Unit 1: The Basics
// 5 ta dars × 5 mashq = 25 mashq

export interface SeedExercise {
  type: 'TRANSLATE_TEXT' | 'BUILD_SENTENCE' | 'LISTEN_AND_TYPE' | 'MATCH_PAIRS' | 'SELECT_IMAGE' | 'FILL_IN_BLANK' | 'MULTIPLE_CHOICE'
  question: string
  correctAnswer: string
  wrongAnswers: string[]
  explanation?: string
  difficulty?: number
  words?: { text: string; translation: string; level?: string; category?: string }[]
}

export interface SeedLesson {
  order: number
  title: string
  exercises: SeedExercise[]
}

export const UZ_EN_BASICS: { unitTitle: string; unitColor: string; unitIcon: string; lessons: SeedLesson[] } = {
  unitTitle: 'Unit 1: The Basics',
  unitColor: '#a03f2e',
  unitIcon: '📚',
  lessons: [
    // ─── Lesson 1: Greetings ──────────────────
    {
      order: 1,
      title: 'Salomlashish',
      exercises: [
        {
          type: 'TRANSLATE_TEXT',
          question: 'Salom',
          correctAnswer: 'Hello',
          wrongAnswers: ['Goodbye', 'Thank you', 'Please'],
          difficulty: 1,
          words: [{ text: 'Hello', translation: 'Salom', category: 'Salomlashish', level: 'A1' }],
        },
        {
          type: 'TRANSLATE_TEXT',
          question: 'Xayr',
          correctAnswer: 'Goodbye',
          wrongAnswers: ['Hello', 'Sorry', 'Please'],
          difficulty: 1,
          words: [{ text: 'Goodbye', translation: 'Xayr', category: 'Salomlashish', level: 'A1' }],
        },
        {
          type: 'MULTIPLE_CHOICE',
          question: '"Rahmat" inglizchada qanday?',
          correctAnswer: 'Thank you',
          wrongAnswers: ['Sorry', 'Please', 'Goodbye'],
          difficulty: 1,
          words: [{ text: 'Thank you', translation: 'Rahmat', category: 'Salomlashish', level: 'A1' }],
        },
        {
          type: 'BUILD_SENTENCE',
          question: 'Salom, qandaysiz?',
          correctAnswer: 'Hello, how are you',
          wrongAnswers: ['How are you, hello', 'Hello, what your name', 'Hello, who are you'],
          difficulty: 2,
        },
        {
          type: 'TRANSLATE_TEXT',
          question: 'Yaxshi, rahmat',
          correctAnswer: 'Good, thank you',
          wrongAnswers: ['Bad, sorry', 'Hello, please', 'Goodbye, thanks'],
          difficulty: 2,
        },
      ],
    },

    // ─── Lesson 2: Introductions ──────────────
    {
      order: 2,
      title: 'Tanishish',
      exercises: [
        {
          type: 'TRANSLATE_TEXT',
          question: 'Mening ismim Aziz',
          correctAnswer: 'My name is Aziz',
          wrongAnswers: ['I am Aziz name', 'Aziz is my', 'Name my Aziz'],
          difficulty: 1,
        },
        {
          type: 'BUILD_SENTENCE',
          question: 'Sening isming nima?',
          correctAnswer: 'What is your name',
          wrongAnswers: ['Your name what is', 'What name your', 'Is name what'],
          difficulty: 2,
        },
        {
          type: 'TRANSLATE_TEXT',
          question: 'Men o\'qituvchiman',
          correctAnswer: 'I am a teacher',
          wrongAnswers: ['I a teacher', 'I am teacher a', 'Teacher I am'],
          difficulty: 2,
          words: [{ text: 'teacher', translation: 'o\'qituvchi', category: 'Kasblar', level: 'A1' }],
        },
        {
          type: 'MULTIPLE_CHOICE',
          question: '"Talaba" inglizchada?',
          correctAnswer: 'Student',
          wrongAnswers: ['Teacher', 'Doctor', 'Engineer'],
          difficulty: 1,
          words: [{ text: 'Student', translation: 'talaba', category: 'Kasblar', level: 'A1' }],
        },
        {
          type: 'TRANSLATE_TEXT',
          question: 'Tanishganimdan xursandman',
          correctAnswer: 'Nice to meet you',
          wrongAnswers: ['Happy to know', 'Glad meet you', 'Nice you meet'],
          difficulty: 2,
        },
      ],
    },

    // ─── Lesson 3: Numbers ────────────────────
    {
      order: 3,
      title: 'Raqamlar',
      exercises: [
        {
          type: 'TRANSLATE_TEXT',
          question: 'bir',
          correctAnswer: 'one',
          wrongAnswers: ['two', 'three', 'four'],
          difficulty: 1,
          words: [{ text: 'one', translation: 'bir', category: 'Raqamlar', level: 'A1' }],
        },
        {
          type: 'TRANSLATE_TEXT',
          question: 'besh',
          correctAnswer: 'five',
          wrongAnswers: ['four', 'six', 'three'],
          difficulty: 1,
          words: [{ text: 'five', translation: 'besh', category: 'Raqamlar', level: 'A1' }],
        },
        {
          type: 'MULTIPLE_CHOICE',
          question: '"o\'n" inglizchada?',
          correctAnswer: 'ten',
          wrongAnswers: ['eight', 'eleven', 'twenty'],
          difficulty: 1,
          words: [{ text: 'ten', translation: 'o\'n', category: 'Raqamlar', level: 'A1' }],
        },
        {
          type: 'TRANSLATE_TEXT',
          question: 'Mening yoshim yigirma',
          correctAnswer: 'I am twenty years old',
          wrongAnswers: ['My age twenty', 'I twenty old years', 'Twenty I am'],
          difficulty: 3,
          words: [{ text: 'twenty', translation: 'yigirma', category: 'Raqamlar', level: 'A1' }],
        },
        {
          type: 'BUILD_SENTENCE',
          question: 'Necha yoshdasiz?',
          correctAnswer: 'How old are you',
          wrongAnswers: ['How are old you', 'Age you what', 'Old how are you'],
          difficulty: 2,
        },
      ],
    },

    // ─── Lesson 4: Family ─────────────────────
    {
      order: 4,
      title: 'Oila',
      exercises: [
        {
          type: 'TRANSLATE_TEXT',
          question: 'Ona',
          correctAnswer: 'mother',
          wrongAnswers: ['father', 'sister', 'brother'],
          difficulty: 1,
          words: [{ text: 'mother', translation: 'ona', category: 'Oila', level: 'A1' }],
        },
        {
          type: 'TRANSLATE_TEXT',
          question: 'Ota',
          correctAnswer: 'father',
          wrongAnswers: ['mother', 'son', 'daughter'],
          difficulty: 1,
          words: [{ text: 'father', translation: 'ota', category: 'Oila', level: 'A1' }],
        },
        {
          type: 'MULTIPLE_CHOICE',
          question: '"Singil" inglizchada?',
          correctAnswer: 'sister',
          wrongAnswers: ['brother', 'aunt', 'cousin'],
          difficulty: 1,
          words: [{ text: 'sister', translation: 'singil', category: 'Oila', level: 'A1' }],
        },
        {
          type: 'TRANSLATE_TEXT',
          question: 'Mening akam bor',
          correctAnswer: 'I have a brother',
          wrongAnswers: ['I a brother have', 'My brother I have', 'Brother I am'],
          difficulty: 2,
          words: [{ text: 'brother', translation: 'aka', category: 'Oila', level: 'A1' }],
        },
        {
          type: 'BUILD_SENTENCE',
          question: 'Bizning oilamiz katta',
          correctAnswer: 'Our family is big',
          wrongAnswers: ['Our big family is', 'Family our is big', 'Big our family is'],
          difficulty: 2,
          words: [{ text: 'family', translation: 'oila', category: 'Oila', level: 'A1' }],
        },
      ],
    },

    // ─── Lesson 5: Colors ─────────────────────
    {
      order: 5,
      title: 'Ranglar',
      exercises: [
        {
          type: 'TRANSLATE_TEXT',
          question: 'Qizil',
          correctAnswer: 'red',
          wrongAnswers: ['blue', 'green', 'yellow'],
          difficulty: 1,
          words: [{ text: 'red', translation: 'qizil', category: 'Ranglar', level: 'A1' }],
        },
        {
          type: 'TRANSLATE_TEXT',
          question: 'Ko\'k',
          correctAnswer: 'blue',
          wrongAnswers: ['red', 'green', 'black'],
          difficulty: 1,
          words: [{ text: 'blue', translation: 'ko\'k', category: 'Ranglar', level: 'A1' }],
        },
        {
          type: 'TRANSLATE_TEXT',
          question: 'Yashil',
          correctAnswer: 'green',
          wrongAnswers: ['blue', 'red', 'white'],
          difficulty: 1,
          words: [{ text: 'green', translation: 'yashil', category: 'Ranglar', level: 'A1' }],
        },
        {
          type: 'MULTIPLE_CHOICE',
          question: '"Oq" inglizchada?',
          correctAnswer: 'white',
          wrongAnswers: ['black', 'gray', 'yellow'],
          difficulty: 1,
          words: [{ text: 'white', translation: 'oq', category: 'Ranglar', level: 'A1' }],
        },
        {
          type: 'TRANSLATE_TEXT',
          question: 'Mening sevimli rangim ko\'k',
          correctAnswer: 'My favorite color is blue',
          wrongAnswers: ['My color favorite blue', 'Blue is my favorite', 'I favorite blue color'],
          difficulty: 3,
        },
      ],
    },
  ],
}
