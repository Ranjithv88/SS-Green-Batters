import { connectMongoDB } from "@/lib/mongodb"
// import { getServerSession } from "next-auth"
// import { authOptions } from "../auth/[...nextauth]/route"
import { Atharv, Dust, WaterSoluble, Bio, Micronutrients, LiquidFertilizers, Granules, Ratol, Others } from "@/models/stock"

const modelMap = { Atharv, Dust, WaterSoluble, Bio, Micronutrients, LiquidFertilizers, Granules, Ratol, Others }

export async function POST(request, { params }) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== "admin")
    return new Response(JSON.stringify({ message: "Forbidden" }), { status: 403 })
  try {
    await connectMongoDB()
    const name = await params
    const model = modelMap[name.name]
    if (!model)
      return new Response(JSON.stringify({ status: 400, message: `Invalid model name: ${name}` }), { status: 400, headers: { "Content-Type": "application/json" }, })
    const body = await request.json()
    const newEntry = new model(body);
    const saved = await newEntry.save();
    return new Response(JSON.stringify(saved), { status: 201 });
  } catch (error) {
    if (error.code === 11000) 
      if (error.keyPattern?.product) 
        return new Response(JSON.stringify({ error: `The product name "${error.keyValue.product}" is already in use.`,}), { status: 409 });
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

