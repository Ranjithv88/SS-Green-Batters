import { connectMongoDB } from "@/lib/mongodb"
import { getServerSession } from "next-auth"
import { authOptions } from "../../../auth/[...nextauth]/route"
import { Atharv, Dust, WaterSoluble, Bio, Micronutrients, LiquidFertilizers, Granules, Ratol, Others } from "@/models/stock"

const modelMap = { Atharv, Dust, WaterSoluble, Bio, Micronutrients, LiquidFertilizers, Granules, Ratol, Others }

export async function POST(req, { params }) {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "admin") return new Response(JSON.stringify({ message: "Forbidden" }),{ status: 403, headers: { "Content-Type": "application/json" } })
    try {
        await connectMongoDB()
        const { name } = await params
        console.log(name)
        const { id } = await req.json()
        const model = modelMap[name]
        if (!model) return new Response(JSON.stringify({ message: `Invalid model name: ${name}` }), { status: 400 })
        const product = await model.findById(id)
        if (!product) return new Response(JSON.stringify({ message: 'Product not found' }), { status: 404 })
        return new Response(JSON.stringify({ status: 200, product }), {status: 200, headers: { 'Content-Type': 'application/json' }})
    } catch (error) {
        return new Response(JSON.stringify({ message: 'Server error', error: error.message }), { status: 500 })
    }
}

