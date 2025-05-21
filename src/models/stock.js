import mongoose from "mongoose";

const commonSchema = {
  sno: { type: Number, required: true, unique: true },
  product: { type: String, required: true, unique: true },
  packing: [{ type: String }],
  quantity: [{ type: String }],
  container: [{ type: String }],
};

// Define individual schemas
const DustSchema = new mongoose.Schema(commonSchema);
const WaterSolubleSchema = new mongoose.Schema(commonSchema);
const BioSchema = new mongoose.Schema(commonSchema);
const MicronutrientsSchema = new mongoose.Schema(commonSchema);
const LiquidFertilizersSchema = new mongoose.Schema(commonSchema);
const GranulesSchema = new mongoose.Schema(commonSchema);
const RatolSchema = new mongoose.Schema(commonSchema);
const AtharvSchema = new mongoose.Schema(commonSchema);
const OthersSchema = new mongoose.Schema(commonSchema);

// Export all models (avoid model overwrite on re-import)
export const Dust = mongoose.models.Dust || mongoose.model("Dust", DustSchema);
export const WaterSoluble = mongoose.models.WaterSoluble || mongoose.model("WaterSoluble", WaterSolubleSchema);
export const Bio = mongoose.models.Bio || mongoose.model("Bio", BioSchema);
export const Micronutrients = mongoose.models.Micronutrients || mongoose.model("Micronutrients", MicronutrientsSchema);
export const LiquidFertilizers = mongoose.models.LiquidFertilizers || mongoose.model("LiquidFertilizers", LiquidFertilizersSchema);
export const Granules = mongoose.models.Granules || mongoose.model("Granules", GranulesSchema);
export const Ratol = mongoose.models.Ratol || mongoose.model("Ratol", RatolSchema);
export const Atharv = mongoose.models.Atharv || mongoose.model("Atharv", AtharvSchema);
export const Others = mongoose.models.Others || mongoose.model("Others", OthersSchema);

