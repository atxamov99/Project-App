// Unit 1: The Basics
// Lessons: Greetings, Introductions, Numbers 1-10, Colors
// Checkpoint: Checkpoint 1

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

export const UZ_EN_UNIT1: { unitTitle: string; unitColor: string; unitIcon: string; lessons: SeedLesson[] } = {
  unitTitle: 'Unit 1: The Basics',
  unitColor: '#58CC02',
  unitIcon: '⭐',
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
          words: [{ text: 'Hello', translation: 'Salom', category: 'Greetings', level: 'A1' }]
        },
        {
          type: 'TRANSLATE_TEXT',
          question: 'Xayr',
          correctAnswer: 'Goodbye',
          wrongAnswers: ['Hello', 'Sorry', 'Please'],
          difficulty: 1,
          words: [{ text: 'Goodbye', translation: 'Xayr', category: 'Greetings', level: 'A1' }]
        },
        {
          type: 'TRANSLATE_TEXT',
          question: 'Rahmat',
          correctAnswer: 'Thank you',
          wrongAnswers: ['Sorry', 'Goodbye', 'Hello'],
          difficulty: 1,
          words: [{ text: 'Thank you', translation: 'Rahmat', category: 'Greetings', level: 'A1' }]
        },
        {
          type: 'TRANSLATE_TEXT',
          question: 'Iltimos',
          correctAnswer: 'Please',
          wrongAnswers: ['Thank you', 'Sorry', 'Yes'],
          difficulty: 1,
          words: [{ text: 'Please', translation: 'Iltimos', category: 'Greetings', level: 'A1' }]
        },
        {
          type: 'TRANSLATE_TEXT',
          question: 'Kechirasiz',
          correctAnswer: 'Sorry',
          wrongAnswers: ['Please', 'Hello', 'Goodbye'],
          difficulty: 1,
          words: [{ text: 'Sorry', translation: 'Kechirasiz', category: 'Greetings', level: 'A1' }]
        },
        {
          type: 'TRANSLATE_TEXT',
          question: 'Ha',
          correctAnswer: 'Yes',
          wrongAnswers: ['No', 'Maybe', 'Please'],
          difficulty: 1,
          words: [{ text: 'Yes', translation: 'Ha', category: 'Greetings', level: 'A1' }]
        },
        {
          type: 'TRANSLATE_TEXT',
          question: "Yo'q",
          correctAnswer: 'No',
          wrongAnswers: ['Yes', 'Maybe', 'Hello'],
          difficulty: 1,
          words: [{ text: 'No', translation: "Yo'q", category: 'Greetings', level: 'A1' }]
        },
        {
          type: 'MULTIPLE_CHOICE',
          question: '"Salom" inglizcha nima?',
          correctAnswer: 'Hello',
          wrongAnswers: ['Goodbye', 'Thank you', 'Please'],
          difficulty: 1
        },
        {
          type: 'MULTIPLE_CHOICE',
          question: '"Thank you" o\'zbekcha...',
          correctAnswer: 'Rahmat',
          wrongAnswers: ['Salom', 'Xayr', 'Iltimos'],
          difficulty: 1
        },
        {
          type: 'BUILD_SENTENCE',
          question: 'Salom, qandaysiz? (inglizcha)',
          correctAnswer: 'Hello, how are you?',
          wrongAnswers: ['when', 'what', 'where'],
          difficulty: 1
        }
      ]
    },
    // ─── Lesson 2: Introductions ──────────────
    {
      order: 2,
      title: 'O\'zini tanishtirish',
      exercises: [
        {
          type: 'TRANSLATE_TEXT',
          question: 'Mening ismim Kamola.',
          correctAnswer: 'My name is Kamola.',
          wrongAnswers: ['Her name is Kamola.', 'I am Kamola.', 'Your name is Kamola.'],
          difficulty: 1,
          words: [{ text: 'Kamola', translation: 'Mening ismim', category: 'Names', level: 'A1' }]
        },
        {
          type: 'TRANSLATE_TEXT',
          question: 'Men o\'quvchiman.',
          correctAnswer: 'I am a student.',
          wrongAnswers: ['I am a teacher.', 'I am a doctor.', 'I am a worker.'],
          difficulty: 1,
          words: [{ text: 'student', translation: 'o\'quvchi', category: 'Occupation', level: 'A1' }]
        },
        {
          type: 'TRANSLATE_TEXT',
          question: 'Men O\'zbekistonliktman.',
          correctAnswer: 'I am from Uzbekistan.',
          wrongAnswers: ['I live in Uzbekistan.', 'I visit Uzbekistan.', 'I know Uzbekistan.'],
          difficulty: 1,
          words: [{ text: 'Uzbekistan', translation: 'O\'zbekiston', category: 'Countries', level: 'A1' }]
        },
        {
          type: 'TRANSLATE_TEXT',
          question: 'Xursand bo\'ldim.',
          correctAnswer: 'Nice to meet you.',
          wrongAnswers: ['See you later.', 'Goodbye.', 'How are you?'],
          difficulty: 1
        },
        {
          type: 'TRANSLATE_TEXT',
          question: 'Siz kimsiniz?',
          correctAnswer: 'Who are you?',
          wrongAnswers: ['Where are you?', 'How are you?', 'What are you?'],
          difficulty: 1
        },
        {
          type: 'MULTIPLE_CHOICE',
          question: '"My name is" o\'zbekcha nima?',
          correctAnswer: 'Mening ismim',
          wrongAnswers: ['Sening ismim', 'Uning ismim', 'Bizning ismimiz'],
          difficulty: 1
        },
        {
          type: 'MULTIPLE_CHOICE',
          question: '"Men o\'quvchiman" inglizcha...',
          correctAnswer: 'I am a student',
          wrongAnswers: ['I am a teacher', 'I am a doctor', 'I am a cook'],
          difficulty: 1
        },
        {
          type: 'FILL_IN_BLANK',
          question: 'My name ___ Jasur.',
          correctAnswer: 'is',
          wrongAnswers: ['am', 'are', 'be'],
          difficulty: 1
        },
        {
          type: 'FILL_IN_BLANK',
          question: 'I ___ from Uzbekistan.',
          correctAnswer: 'am',
          wrongAnswers: ['is', 'are', 'be'],
          difficulty: 1
        },
        {
          type: 'BUILD_SENTENCE',
          question: 'Men O\'zbekistonliktman (inglizcha)',
          correctAnswer: 'I am from Uzbekistan',
          wrongAnswers: ['she', 'he', 'we'],
          difficulty: 1
        }
      ]
    },
    // ─── Lesson 3: Numbers 1-10 ────────────────
    {
      order: 3,
      title: 'Raqamlar 1-10',
      exercises: [
        {
          type: 'TRANSLATE_TEXT',
          question: 'Bir',
          correctAnswer: 'One',
          wrongAnswers: ['Two', 'Three', 'Four'],
          difficulty: 1,
          words: [{ text: 'One', translation: 'Bir', category: 'Numbers', level: 'A1' }]
        },
        {
          type: 'TRANSLATE_TEXT',
          question: 'Ikki',
          correctAnswer: 'Two',
          wrongAnswers: ['One', 'Three', 'Four'],
          difficulty: 1,
          words: [{ text: 'Two', translation: 'Ikki', category: 'Numbers', level: 'A1' }]
        },
        {
          type: 'TRANSLATE_TEXT',
          question: 'Uch',
          correctAnswer: 'Three',
          wrongAnswers: ['Two', 'One', 'Four'],
          difficulty: 1,
          words: [{ text: 'Three', translation: 'Uch', category: 'Numbers', level: 'A1' }]
        },
        {
          type: 'TRANSLATE_TEXT',
          question: 'To\'rt',
          correctAnswer: 'Four',
          wrongAnswers: ['Three', 'Five', 'Six'],
          difficulty: 1,
          words: [{ text: 'Four', translation: 'To\'rt', category: 'Numbers', level: 'A1' }]
        },
        {
          type: 'TRANSLATE_TEXT',
          question: 'Besh',
          correctAnswer: 'Five',
          wrongAnswers: ['Four', 'Six', 'Seven'],
          difficulty: 1,
          words: [{ text: 'Five', translation: 'Besh', category: 'Numbers', level: 'A1' }]
        },
        {
          type: 'TRANSLATE_TEXT',
          question: 'Olti',
          correctAnswer: 'Six',
          wrongAnswers: ['Five', 'Seven', 'Eight'],
          difficulty: 1,
          words: [{ text: 'Six', translation: 'Olti', category: 'Numbers', level: 'A1' }]
        },
        {
          type: 'TRANSLATE_TEXT',
          question: 'Yetti',
          correctAnswer: 'Seven',
          wrongAnswers: ['Six', 'Eight', 'Nine'],
          difficulty: 1,
          words: [{ text: 'Seven', translation: 'Yetti', category: 'Numbers', level: 'A1' }]
        },
        {
          type: 'TRANSLATE_TEXT',
          question: 'Sakkiz',
          correctAnswer: 'Eight',
          wrongAnswers: ['Seven', 'Nine', 'Ten'],
          difficulty: 1,
          words: [{ text: 'Eight', translation: 'Sakkiz', category: 'Numbers', level: 'A1' }]
        },
        {
          type: 'TRANSLATE_TEXT',
          question: 'To\'qqiz',
          correctAnswer: 'Nine',
          wrongAnswers: ['Eight', 'Seven', 'Ten'],
          difficulty: 1,
          words: [{ text: 'Nine', translation: 'To\'qqiz', category: 'Numbers', level: 'A1' }]
        },
        {
          type: 'TRANSLATE_TEXT',
          question: 'O\'n',
          correctAnswer: 'Ten',
          wrongAnswers: ['Nine', 'Eight', 'Eleven'],
          difficulty: 1,
          words: [{ text: 'Ten', translation: 'O\'n', category: 'Numbers', level: 'A1' }]
        }
      ]
    },
    // ─── Lesson 4: Colors ─────────────────────
    {
      order: 4,
      title: 'Ranglar',
      exercises: [
        {
          type: 'TRANSLATE_TEXT',
          question: 'Qizil',
          correctAnswer: 'Red',
          wrongAnswers: ['Blue', 'Green', 'Yellow'],
          difficulty: 1,
          words: [{ text: 'Red', translation: 'Qizil', category: 'Colors', level: 'A1' }]
        },
        {
          type: 'TRANSLATE_TEXT',
          question: 'Ko\'k',
          correctAnswer: 'Blue',
          wrongAnswers: ['Red', 'Green', 'Yellow'],
          difficulty: 1,
          words: [{ text: 'Blue', translation: 'Ko\'k', category: 'Colors', level: 'A1' }]
        },
        {
          type: 'TRANSLATE_TEXT',
          question: 'Yashil',
          correctAnswer: 'Green',
          wrongAnswers: ['Blue', 'Red', 'Yellow'],
          difficulty: 1,
          words: [{ text: 'Green', translation: 'Yashil', category: 'Colors', level: 'A1' }]
        },
        {
          type: 'TRANSLATE_TEXT',
          question: 'Sariq',
          correctAnswer: 'Yellow',
          wrongAnswers: ['Red', 'Blue', 'Green'],
          difficulty: 1,
          words: [{ text: 'Yellow', translation: 'Sariq', category: 'Colors', level: 'A1' }]
        },
        {
          type: 'TRANSLATE_TEXT',
          question: 'Oq',
          correctAnswer: 'White',
          wrongAnswers: ['Black', 'Gray', 'Brown'],
          difficulty: 1,
          words: [{ text: 'White', translation: 'Oq', category: 'Colors', level: 'A1' }]
        },
        {
          type: 'TRANSLATE_TEXT',
          question: 'Qora',
          correctAnswer: 'Black',
          wrongAnswers: ['White', 'Gray', 'Brown'],
          difficulty: 1,
          words: [{ text: 'Black', translation: 'Qora', category: 'Colors', level: 'A1' }]
        },
        {
          type: 'TRANSLATE_TEXT',
          question: 'To\'q sariq',
          correctAnswer: 'Orange',
          wrongAnswers: ['Yellow', 'Red', 'Pink'],
          difficulty: 1,
          words: [{ text: 'Orange', translation: 'To\'q sariq', category: 'Colors', level: 'A1' }]
        },
        {
          type: 'TRANSLATE_TEXT',
          question: 'Binafsha',
          correctAnswer: 'Purple',
          wrongAnswers: ['Pink', 'Orange', 'Blue'],
          difficulty: 1,
          words: [{ text: 'Purple', translation: 'Binafsha', category: 'Colors', level: 'A1' }]
        },
        {
          type: 'TRANSLATE_TEXT',
          question: 'Jigarrang',
          correctAnswer: 'Brown',
          wrongAnswers: ['Black', 'Gray', 'Orange'],
          difficulty: 1,
          words: [{ text: 'Brown', translation: 'Jigarrang', category: 'Colors', level: 'A1' }]
        },
        {
          type: 'MULTIPLE_CHOICE',
          question: '"Blue" o\'zbekcha...',
          correctAnswer: 'Ko\'k',
          wrongAnswers: ['Qizil', 'Yashil', 'Sariq'],
          difficulty: 1
        }
      ]
    },
    // ─── Lesson 5: Checkpoint 1 ────────────────
    {
      order: 5,
      title: 'Tekshiruv 1',
      exercises: [
        {
          type: 'MULTIPLE_CHOICE',
          question: '"Hello" o\'zbekcha...',
          correctAnswer: 'Salom',
          wrongAnswers: ['Xayr', 'Rahmat', 'Iltimos'],
          difficulty: 1
        },
        {
          type: 'TRANSLATE_TEXT',
          question: 'Uch',
          correctAnswer: 'Three',
          wrongAnswers: ['Two', 'Four', 'One'],
          difficulty: 1,
          words: [{ text: 'Three', translation: 'Uch', category: 'Numbers', level: 'A1' }]
        },
        {
          type: 'TRANSLATE_TEXT',
          question: 'Ko\'k',
          correctAnswer: 'Blue',
          wrongAnswers: ['Red', 'Green', 'Yellow'],
          difficulty: 1,
          words: [{ text: 'Blue', translation: 'Ko\'k', category: 'Colors', level: 'A1' }]
        },
        {
          type: 'FILL_IN_BLANK',
          question: 'My name ___ Ali.',
          correctAnswer: 'is',
          wrongAnswers: ['am', 'are', 'were'],
          difficulty: 1
        },
        {
          type: 'MULTIPLE_CHOICE',
          question: 'Qizil inglizcha...',
          correctAnswer: 'Red',
          wrongAnswers: ['Blue', 'Green', 'Yellow'],
          difficulty: 1
        },
        {
          type: 'TRANSLATE_TEXT',
          question: 'Besh',
          correctAnswer: 'Five',
          wrongAnswers: ['Four', 'Six', 'Three'],
          difficulty: 1,
          words: [{ text: 'Five', translation: 'Besh', category: 'Numbers', level: 'A1' }]
        },
        {
          type: 'TRANSLATE_TEXT',
          question: 'Rahmat',
          correctAnswer: 'Thank you',
          wrongAnswers: ['Please', 'Sorry', 'Goodbye'],
          difficulty: 1,
          words: [{ text: 'Thank you', translation: 'Rahmat', category: 'Greetings', level: 'A1' }]
        },
        {
          type: 'MULTIPLE_CHOICE',
          question: '"Two" o\'zbekcha...',
          correctAnswer: 'Ikki',
          wrongAnswers: ['Bir', 'Uch', 'To\'rt'],
          difficulty: 1
        },
        {
          type: 'BUILD_SENTENCE',
          question: 'Salom, mening ismim Jasur (inglizcha)',
          correctAnswer: 'Hello, my name is Jasur',
          wrongAnswers: ['goodbye', 'her', 'their'],
          difficulty: 1
        }
      ]
    }
  ]
}