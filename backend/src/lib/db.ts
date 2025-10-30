import {config} from '../config/config';
import mongoose from 'mongoose';

mongoose.connect(config.DB_URL);

const catSchema = new mongoose.Schema({
    name: String,
    age: Number,
    breed: String,
});

const catModel = mongoose.model('Cat', catSchema);