
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

    // ✅ NEW: random by topic
    getRandomQuestionsByTopic(topicId, limit) {
      return collection('questions')
        .aggregate([
          { $match: { topic_id: topicId, isActive: true } },
          { $sample: { size: limit } }
        ])
        .toArray();
    },

    // ✅ NEW: insert
    insertQuestions(questions) {
      if (!questions?.length) return Promise.resolve();
      return collection('questions').insertMany(questions);
    },

    // ✅ NEW: hashes
    async getAllQuestionHashes(subject) {
      const docs = await collection('questions')
        .find({ subject }, { projection: { hash: 1 } })
        .toArray();
      return docs.map(d => d.hash).filter(Boolean);
    },

    // ✅ NEW: recently played
    async getRecentlyPlayedQuestionIds(userId) {
      if (!userId) return [];

      const attempts = await collection('quiz_attempts')
        .find(
          { user_id: userId },
          { projection: { question_ids: 1 }, sort: { createdAt: -1 }, limit: 10 }
        )
        .toArray();

      return attempts.flatMap(a => a.question_ids || []);
    },

    toObjectId(value) {
      if (!ObjectId.isValid(value)) return null;
      return new ObjectId(value);
    }
  };
}

module.exports = { quizRepository };
