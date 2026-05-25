import type { Exercise, AnswerResult } from '@/types'
import { TranslateText } from './exercises/TranslateText'
import { BuildSentence } from './exercises/BuildSentence'
import { ListenType } from './exercises/ListenType'
import { SpeakCheck } from './exercises/SpeakCheck'
import { MatchPairs } from './exercises/MatchPairs'
import { SelectImage } from './exercises/SelectImage'
import { FillInBlank } from './exercises/FillInBlank'
import { MultipleChoice } from './exercises/MultipleChoice'

interface Props {
  exercise: Exercise
  answer: string
  onAnswerChange: (answer: string) => void
  result: AnswerResult
}

export function ExerciseRenderer({ exercise, answer, onAnswerChange, result }: Props) {
  const props = { answer, onAnswerChange, result }

  switch (exercise.type) {
    case 'TRANSLATE_TEXT':
      return <TranslateText exercise={exercise} {...props} />
    case 'BUILD_SENTENCE':
      return <BuildSentence exercise={exercise} {...props} />
    case 'LISTEN_AND_TYPE':
      return <ListenType exercise={exercise} {...props} />
    case 'SPEAK_AND_CHECK':
      return <SpeakCheck exercise={exercise} {...props} />
    case 'MATCH_PAIRS':
      return <MatchPairs exercise={exercise} {...props} />
    case 'SELECT_IMAGE':
      return <SelectImage exercise={exercise} {...props} />
    case 'FILL_IN_BLANK':
      return <FillInBlank exercise={exercise} {...props} />
    case 'MULTIPLE_CHOICE':
      return <MultipleChoice exercise={exercise} {...props} />
    default:
      return <TranslateText exercise={exercise} {...props} />
  }
}
