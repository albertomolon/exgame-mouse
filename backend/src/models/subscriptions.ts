import mongoose from "mongoose"; 

interface ISubscription {
    _id: string;
    student_id: string;
    exam_id: string;
    questions: ISubscription[];
}

interface ISubscriptionQuestion {
    question_id: string;
    responses: ISubscriptionAnswer[];
}

interface ISubscriptionAnswer {
    answer_id: string;
}

const subscriptionSchema = new mongoose.Schema<ISubscription>({
    _id: {type: String, required: true, unique: true},
    student_id: { type: String, required: true },
    exam_id: { type: String, required: true },
    questions: { type: [Object], default: [] },
});

export const subscriptionModel = mongoose.model<ISubscription>("Subscription", subscriptionSchema);
export default ISubscription;