import subscriptionsModel from "../models/subscriptions";
import examsModel from "../models/exams";

class SubscriptionsDAO {
  // GET /api/subscription  -> getAll
  async getAll() {
    return await subscriptionsModel.find();
  }

  // GET /api/subscription/:id  -> getById
  async getById(id: string) {
    return await subscriptionsModel.findById(id);
  }

  // POST /api/subscription/new  -> create
  async create(subscriptionData: any) {
    const doc = new subscriptionsModel(subscriptionData);
    return await doc.save();
  }

  // POST /api/subscription/:id/calc  -> calcById
  async calcById(id: string) {
    const sub = await subscriptionsModel.findById(id);
    if (!sub) throw new Error("Subscription not found");

    const exam = await examsModel.findById(sub.examId);
    if (!exam) throw new Error("Exam not found");

    let score = 0;

    const correctByQuestion = new Map<string, Set<string>>();
    for (const q of exam.questions || []) {
      const set = new Set<string>();
      for (const a of q.answers || []) {
        if (a.isCorrect) set.add(String(a._id));
      }
      correctByQuestion.set(String(q._id), set);
    }

    for (const ua of sub.answers || []) {
      const corr = correctByQuestion.get(String(ua.questionId));
      if (!corr) continue;
      if (corr.has(String(ua.answerId))) score += 1;
    }

    sub.score = score;
    await sub.save();

    return { _id: sub._id, score };
  }

  // DELETE /api/subscription/:id  -> deleteById
  async deleteById(id: string) {
    return await subscriptionsModel.findByIdAndDelete(id);
  }
}

export default SubscriptionsDAO;
