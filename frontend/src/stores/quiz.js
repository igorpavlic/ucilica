import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useApi } from '../composables/useApi'

export const useQuizStore = defineStore('quiz', () => {
  const api = useApi()

  const attemptId = ref('')
  const questions = ref([])
  const loadingQuiz = ref(false)
  const exhausted = ref(false)
  const exhaustedMsg = ref('')
  const currentQ = ref(0)
  const selectedIdx = ref(null)
  const answered = ref(false)
  const isCorrect = ref(false)
  const correctIdx = ref(null)
  const correctAnswerText = ref('')
  const inputAnswer = ref('')
  const correctCount = ref(0)
  const quizAnswers = ref([])
  const questionStartTime = ref(Date.now())

  function resetSession() {
    attemptId.value = ''
    questions.value = []
    loadingQuiz.value = false
    exhausted.value = false
    exhaustedMsg.value = ''
    currentQ.value = 0
    selectedIdx.value = null
    answered.value = false
    isCorrect.value = false
    correctIdx.value = null
    correctAnswerText.value = ''
    inputAnswer.value = ''
    correctCount.value = 0
    quizAnswers.value = []
    questionStartTime.value = Date.now()
  }

  async function loadQuiz(topicId, count = 7) {
    resetSession()
    loadingQuiz.value = true
    try {
      const data = await api.get(`/quiz/${topicId}?count=${count}`)
      attemptId.value = data.attemptId || ''
      exhausted.value = !!data.exhausted
      exhaustedMsg.value = data.message || ''
      questions.value = data.questions || []
      questionStartTime.value = Date.now()
      return data
    } finally {
      loadingQuiz.value = false
    }
  }

  function recordAnswer(wasCorrect, userAnswer) {
    const timeTaken = Date.now() - questionStartTime.value
    quizAnswers.value.push({
      questionId: questions.value[currentQ.value]._id,
      userAnswer,
      timeTaken
    })
    if (wasCorrect) {
      correctCount.value += 1
    }
  }

  async function checkChoice(index) {
    if (answered.value) return null
    selectedIdx.value = index
    const data = await api.post('/quiz/check', {
      attemptId: attemptId.value,
      questionId: questions.value[currentQ.value]._id,
      answer: index
    })
    answered.value = true
    isCorrect.value = data.isCorrect
    correctIdx.value = data.correctIndex
    correctAnswerText.value = data.correctAnswer
    recordAnswer(data.isCorrect, index)
    return data
  }

  async function checkInput() {
    if (answered.value || !inputAnswer.value.trim()) return null
    const userAnswer = inputAnswer.value.trim()
    const data = await api.post('/quiz/check', {
      attemptId: attemptId.value,
      questionId: questions.value[currentQ.value]._id,
      answer: userAnswer
    })
    answered.value = true
    isCorrect.value = data.isCorrect
    correctIdx.value = data.correctIndex
    correctAnswerText.value = data.correctAnswer
    recordAnswer(data.isCorrect, userAnswer)
    return data
  }

  function advanceQuestion() {
    currentQ.value += 1
    answered.value = false
    selectedIdx.value = null
    isCorrect.value = false
    correctIdx.value = null
    correctAnswerText.value = ''
    inputAnswer.value = ''
    questionStartTime.value = Date.now()
  }

  function hasNextQuestion() {
    return currentQ.value < questions.value.length - 1
  }

  async function submitQuiz(topicId) {
    return api.post('/quiz/submit', {
      attemptId: attemptId.value,
      topicId,
      answers: quizAnswers.value
    })
  }

  return {
    attemptId,
    questions,
    loadingQuiz,
    exhausted,
    exhaustedMsg,
    currentQ,
    selectedIdx,
    answered,
    isCorrect,
    correctIdx,
    correctAnswerText,
    inputAnswer,
    correctCount,
    quizAnswers,
    questionStartTime,
    loadQuiz,
    checkChoice,
    checkInput,
    advanceQuestion,
    hasNextQuestion,
    submitQuiz,
    resetSession,
    loading: api.loading,
    error: api.error
  }
})
