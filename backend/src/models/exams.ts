import mongoose from "mongoose"; 

interface IExam {
    _id: string;
    name: string;
    created_at: Date;
    updated_at: Date;
    created_by: string;
    schedule_date: Date;
    max_time: number;
    questions: IQuestion[];
}

interface IQuestion {
    _id: string;
    text: string;
    type: "multiple_choice" | "true_false" | "short_answer";
    answers: IAnswer[];
}

interface IAnswer {
    _id: string;
    text: string;
    type: "correct" | "incorrect";
}


const examSchema = new mongoose.Schema<IExam>({
    _id: {type: String, required: true, unique: true},
    name: { type: String, required: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    created_by: { type: String, required: true },
    schedule_date: { type: Date, required: true }, 
    max_time: { type: Number, required: true }, 
    questions: { type: [Object], default: [] }, 
});

export const examModel = mongoose.model<IExam>("Exam", examSchema);
export default IExam;