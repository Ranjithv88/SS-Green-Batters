import { connectMongoDB } from "@/lib/mongodb"
import { Atharv, Dust, WaterSoluble, Bio, Micronutrients, LiquidFertilizers, Granules, Ratol, Others } from "@/models/stock"

const modelMap = { Atharv, Dust, WaterSoluble, Bio, Micronutrients, LiquidFertilizers, Granules, Ratol, Others }

export async function GET(_, { params }) {
  try {
    await connectMongoDB()
    const name = await params
    const model = modelMap[name.name]
    if (!model) return new Response(JSON.stringify({ status: 400, message: `Invalid model name: ${name}` }), { status: 400, headers: { "Content-Type": "application/json" }, })
    const products = await model.find({})
    if (products.length === 0) return new Response(JSON.stringify({ status: 404, message: "No data found." }), { status: 404, headers: { "Content-Type": "application/json" }, })
    return new Response(JSON.stringify({ status: 200, products }), { status: 200, headers: { "Content-Type": "application/json" }, })
  } catch (error) {
    console.error("Error fetching products:", error)
    return new Response( JSON.stringify({ status: 500, message: "Internal server error", error: error.message }), { status: 500, headers: { "Content-Type": "application/json" } })
  }
}

export async function POST(request, { params }) {
  try {
    await connectMongoDB()
    const name = await params
    const model = modelMap[name.name]
    console.log("modelName", name.name)
    if (!model) return new Response(JSON.stringify({ status: 400, message: `Invalid model name: ${name}` }),{ status: 400, headers: { "Content-Type": "application/json" } });
    const body = await request.json()
    const productsArray = body.json
    if (!Array.isArray(productsArray)) return new Response(JSON.stringify({ status: 400, message: "`json` must be an array of product entries." }),{ status: 400, headers: { "Content-Type": "application/json" } })
    const invalidItems = productsArray.filter(item => item?.sno == null || item?.product == null);
    if (invalidItems.length > 0) return new Response(JSON.stringify({status: 400,message: "Some items are missing `sno` or `product`.",invalidItems}),{ status: 400, headers: { "Content-Type": "application/json" } })
    const inserted = await model.insertMany(productsArray)
    return new Response(JSON.stringify({ status: 200, products: inserted }),{ status: 200, headers: { "Content-Type": "application/json" } })
  } catch (err) {
    console.error("Error inserting products:", err)
    return new Response(JSON.stringify({ status: 500, message: "Internal server error", error: err.message }),{ status: 500, headers: { "Content-Type": "application/json" } })
  }
}
 

