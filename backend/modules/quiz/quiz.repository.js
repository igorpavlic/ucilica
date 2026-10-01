const { ObjectId } = require('mongodb');
const { getDb } = require('../../db/mongo');

function collection(name) {
  return getDb().collection(name);
}

function quizRepository() {
  return {
    findTopicById(topicId) {
      return collection('topics').findOne({ _id: topicId });
    },

    findSubjectById(subjectId) {
      return collection('subjects').findOne({ _id: subjectId });
    },

    countActiveQuestionsForTopic(topicId) {
      return collection('questions').countDocuments({ topic_id: topicId, isActive: true });
    },

    findQuestionsByIds(questionIds) {
      return collection('questions').find({ _id: { $in: questionIds } }).toArray();
    },

    findQuestionById(questionId) {
      return collection('questions').findOne({ _id: questionId });
    },

    createAttempt(attempt) {
      return collection('quiz_attempts').insertOne(attempt);
    },

    findAttemptById(attemptId) {
      return collection('quiz_attempts').findOne({ _id: attemptId });
    },

    markAttemptCompleted(attemptId) {
      return collection('quiz_attempts').updateOne(
        { _id: attemptId },
        { $set: { completedAt: new Date() } }
      );
    },

    /**
     * Atomsko zauzimanje sesije za predaju. Uspijeva samo jednom: uvjet
     * completedAt: null i postavljanje u istoj operaciji isključuju dvostruki upis.
     */
    async claimAttempt(attemptId) {
      const r = await collection('quiz_attempts').updateOne(
        { _id: attemptId, completedAt: null },
        { $set: { completedAt: new Date() } }
      );
      return (r.modifiedCount ?? r.matchedCount ?? 0) === 1;
    },

    /** Otpusti sesiju ako predaja nije stigla ništa zapisati. */
    releaseAttempt(attemptId) {
      return collection('quiz_attempts').updateOne(
        { _id: attemptId },
        { $set: { completedAt: null } }
      );
    },

    /**
     * Zapiši prvi pokušaj za pitanje sesije (samo ako ga još nema) i broji
     * ponovne pokušaje. Vraća true ako je ovo bio prvi pokušaj.
     */
    async recordFirstCheck(attemptId, questionId, first) {
      const key = `checks.${questionId}`;
      const r = await collection('quiz_attempts').updateOne(
        { _id: attemptId, completedAt: null, [key]: { $exists: false } },
        { $set: { [key]: { ...first, attempts: 1 } } }
      );
      if ((r.modifiedCount ?? r.matchedCount ?? 0) === 1) return true;
      await collection('quiz_attempts').updateOne(
        { _id: attemptId, completedAt: null },
        { $inc: { [`${key}.attempts`]: 1 } }
      );
      return false;
    },

    insertProgress(progress) {
      return collection('progress').insertOne(progress);
    },

    updateUserScoreAndStreak(userId, score, allCorrect) {
      const updateOps = {
        $inc: { totalScore: score },
        $set: { updatedAt: new Date(), streak: allCorrect ? undefined : 0 }
      };

      if (allCorrect) {
        updateOps.$inc.streak = 1;
        delete updateOps.$set.streak;
      }

      return collection('users').updateOne({ _id: userId }, updateOps);
    },

    findSafeUserById(userId) {
      return collection('users').findOne(
        { _id: userId },
        { projection: { password: 0 } }
      );
    },

    /**
     * Elo ocjena djeteta po predmetu. Dijete može dobro zbrajati, a slabo
     * poznavati prirodu — jedna ocjena za sve ne bi ništa značila.
     */
    async findRating(userId, subjectId) {
      const z = await collection('user_ratings').findOne({ user_id: userId, subject_id: subjectId });
      return { rating: z?.rating ?? 1500, odgovora: z?.odgovora ?? 0 };
    },

    saveRating(userId, subjectId, { rating, odgovora }) {
      return collection('user_ratings').updateOne(
        { user_id: userId, subject_id: subjectId },
        { $set: { user_id: userId, subject_id: subjectId, rating, odgovora, updatedAt: new Date() } },
        { upsert: true }
      );
    },

    async createAttemptIndexes() {
      await collection('quiz_attempts').createIndex({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 6 });
      await collection('quiz_attempts').createIndex({ user_id: 1, createdAt: -1 });
      await collection('user_ratings').createIndex({ user_id: 1, subject_id: 1 }, { unique: true });
      await collection('item_ratings').createIndex({ question_id: 1 }, { unique: true });
    },

    toObjectId(value) {
      if (!ObjectId.isValid(value)) return null;
      return new ObjectId(value);
    }
  };
}

module.exports = { quizRepository };
