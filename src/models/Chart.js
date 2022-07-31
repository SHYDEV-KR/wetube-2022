import mongoose from "mongoose";

const chartSchema = new mongoose.Schema({
    companyName: { type: String, required: true },
    createdAt: { type: Date, required: true, default: Date.now() },
    chart: [{ type: String, required: true }],
})

const Chart = mongoose.model("Chart", chartSchema);
export default Chart;