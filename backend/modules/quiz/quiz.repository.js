const { ObjectId } = require('mongodb');
const { getDb } = require('../../db/mongo');

async function getTopicById(id) {
  return await getCollection('topics').findOne({ _id: id });
}

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

    async createAttemptIndexes() {
      await collection('quiz_attempts').createIndex({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 6 });
      await collection('quiz_attempts').createIndex({ user_id: 1, createdAt: -1 });
    },

    toObjectId(value) {
      if (!ObjectId.isValid(value)) return null;
      return new ObjectId(value);
    }
  };
}

module.exports = { quizRepository };
