import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useApi } from '../composables/useApi'
import { jeMijesano, jeDnevni, razredIz } from '../composables/mijesano'

export const useQuizStore = defineStore('quiz', () => {
  const api = useApi()

  const attemptId = ref('')
  const questions = ref([])
  const loadingQuiz = ref(false)
  const exhausted = ref(false)
  const exhaustedMsg = ref('')
  // Opseg miješanog ponavljanja: { nacin: 'oznaceno'|'vjezbano'|'sve', brojTema }
  const opseg = ref(null)
  const currentQ = ref(0)
  const selectedIdx = ref(null)
  const answered = ref(false)
  const isCorrect = ref(false)
  const correctIdx = ref(null)
  const correctAnswerText = ref('')
  const objasnjenje = ref('')
  const redoslijed = ref([])
  const inputAnswer = ref('')
  const correctCount = ref(0)
  const quizAnswers = ref([])
  const questionStartTime = ref(Date.now())
  // Spajanje parova: { lijeviId: desniId }
  const veze = ref({})
  const odabranLijevi = ref(null)
  const tocnihVeza = ref(0)
  // Rezultat po vezi nakon provjere: { lijeviId: true|false }
  const vezeTocne = ref({})
  // Provjera u tijeku — brzi višestruki klikovi ne smiju poslati više zahtjeva
  const provjeravam = ref(false)

  function resetSession() {
    attemptId.value = ''
    questions.value = []
    loadingQuiz.value = false
    exhausted.value = false
    exhaustedMsg.value = ''
    opseg.value = null
    currentQ.value = 0
    selectedIdx.value = null
    answered.value = false
    isCorrect.value = false
    correctIdx.value = null
    correctAnswerText.value = ''
    objasnjenje.value = ''
    redoslijed.value = []
    inputAnswer.value = ''
    correctCount.value = 0
    quizAnswers.value = []
    questionStartTime.value = Date.now()
    veze.value = {}
    odabranLijevi.value = null
    tocnihVeza.value = 0
    vezeTocne.value = {}
    provjeravam.value = false
  }

  /**
   * Jedna provjera odjednom. `answered` postaje istinit tek nakon odgovora
   * servera, pa bez ove brave dvostruki klik šalje dva zahtjeva.
   */
  async function jednaProvjera(fn) {
    if (answered.value || provjeravam.value) return null
    provjeravam.value = true
    try {
      return await fn()
    } finally {
      provjeravam.value = false
    }
  }

  async function loadQuiz(topicId, count = 7) {
    resetSession()
    loadingQuiz.value = true
    try {
      const endpoint = jeDnevni(topicId)
        ? `/quiz/dnevni/${razredIz(topicId)}`
        : topicId.startsWith('review-')
          ? `/quiz/review/${razredIz(topicId)}?count=${count}`
          : `/quiz/${topicId}?count=${count}`
      const data = await api.get(endpoint)
      attemptId.value = data.attemptId || ''
      // Dnevni izazov koji je danas već riješen prikazuje se kao „nema pitanja”, s porukom.
      exhausted.value = !!data.exhausted || !!data.odigrano
      exhaustedMsg.value = data.message || ''
      opseg.value = data.opseg || null
      questions.value = data.questions || []
      redoslijed.value = [...(questions.value[0]?.answers || [])]
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

  function checkChoice(index) {
    return jednaProvjera(() => _checkChoice(index))
  }

  async function _checkChoice(index) {
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
    objasnjenje.value = data.objasnjenje || ''
    recordAnswer(data.isCorrect, index)
    return data
  }

  function checkInput() {
    if (!inputAnswer.value.trim()) return Promise.resolve(null)
    return jednaProvjera(_checkInput)
  }

  async function _checkInput() {
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
    objasnjenje.value = data.objasnjenje || ''
    recordAnswer(data.isCorrect, userAnswer)
    return data
  }

  /** Klik na lijevi stupac — odabir ili poništavanje */
  function odaberiLijevi (id) {
    if (answered.value) return
    odabranLijevi.value = odabranLijevi.value === id ? null : id
  }

  /** Klik na desni stupac — spaja s odabranim lijevim */
  function spoji (desniId) {
    if (answered.value || odabranLijevi.value === null) return
    const nove = { ...veze.value }
    // jedan desni smije biti vezan samo na jedan lijevi
    for (const [l, d] of Object.entries(nove)) {
      if (d === desniId) delete nove[l]
    }
    nove[odabranLijevi.value] = desniId
    veze.value = nove
    odabranLijevi.value = null
  }

  function razvezi (lijeviId) {
    if (answered.value) return
    const nove = { ...veze.value }
    delete nove[lijeviId]
    veze.value = nove
  }

  /** Predaja spajanja — tek kad su svi parovi povezani */
  function checkMatch () {
    return jednaProvjera(_checkMatch)
  }

  async function _checkMatch () {
    const p = questions.value[currentQ.value]
    if (!p) return null
    if (Object.keys(veze.value).length !== (p.lijevo?.length || 0)) return null

    const data = await api.post('/quiz/check', {
      attemptId: attemptId.value,
      questionId: p._id,
      answer: veze.value
    })
    answered.value = true
    isCorrect.value = data.isCorrect
    correctAnswerText.value = data.correctAnswer
    objasnjenje.value = data.objasnjenje || ''
    tocnihVeza.value = data.tocnihVeza ?? 0
    vezeTocne.value = data.vezeTocne || {}
    recordAnswer(data.isCorrect, veze.value)
    return data
  }

  function pomakniStavku(index, delta) {
    const next = index + delta
    if (answered.value || next < 0 || next >= redoslijed.value.length) return
    const items = [...redoslijed.value]
    ;[items[index], items[next]] = [items[next], items[index]]
    redoslijed.value = items
  }

  function checkStructured(answer) {
    return jednaProvjera(() => _checkStructured(answer))
  }

  async function _checkStructured(answer) {
    const data = await api.post('/quiz/check', {
      attemptId: attemptId.value, questionId: questions.value[currentQ.value]._id, answer
    })
    answered.value = true
    isCorrect.value = data.isCorrect
    correctAnswerText.value = data.correctAnswer
    objasnjenje.value = data.objasnjenje || ''
    recordAnswer(data.isCorrect, answer)
    return data
  }

  function advanceQuestion() {
    currentQ.value += 1
    answered.value = false
    selectedIdx.value = null
    isCorrect.value = false
    correctIdx.value = null
    correctAnswerText.value = ''
    objasnjenje.value = ''
    redoslijed.value = [...(questions.value[currentQ.value]?.answers || [])]
    inputAnswer.value = ''
    veze.value = {}
    odabranLijevi.value = null
    tocnihVeza.value = 0
    vezeTocne.value = {}
    questionStartTime.value = Date.now()
  }

  function hasNextQuestion() {
    return currentQ.value < questions.value.length - 1
  }

  async function submitQuiz(topicId) {
    return api.post('/quiz/submit', {
      attemptId: attemptId.value,
      ...(jeMijesano(topicId)
        ? { reviewGrade: Number(razredIz(topicId)) } : { topicId }),
      answers: quizAnswers.value
    })
  }

  return {
    attemptId,
    questions,
    loadingQuiz,
    exhausted,
    exhaustedMsg,
    opseg,
    currentQ,
    selectedIdx,
    answered,
    isCorrect,
    correctIdx,
    correctAnswerText,
    objasnjenje,
    redoslijed,
    inputAnswer,
    veze,
    odabranLijevi,
    tocnihVeza,
    vezeTocne,
    provjeravam,
    correctCount,
    quizAnswers,
    questionStartTime,
    loadQuiz,
    checkChoice,
    checkInput,
    checkMatch,
    checkStructured,
    pomakniStavku,
    odaberiLijevi,
    spoji,
    razvezi,
    advanceQuestion,
    hasNextQuestion,
    submitQuiz,
    resetSession,
    loading: api.loading,
    error: api.error
  }
})
