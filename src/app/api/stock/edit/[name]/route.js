import { connectMongoDB } from "@/lib/mongodb"
import { getServerSession } from "next-auth"
import { authOptions } from "../../../auth/[...nextauth]/route"
import { Atharv, Dust, WaterSoluble, Bio, Micronutrients, LiquidFertilizers, Granules, Ratol, Others } from "@/models/stock"
import mongoose from 'mongoose'

const modelMap = { Atharv, Dust, WaterSoluble, Bio, Micronutrients, LiquidFertilizers, Granules, Ratol, Others }

export async function POST(request, { params }) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== "admin") return new Response(JSON.stringify({ message: "Forbidden" }),{ status: 403, headers: { "Content-Type": "application/json" } })
  try {
    await connectMongoDB()
    const name = await params
    const model = modelMap[name.name]
    if (!model) return new Response(JSON.stringify({ status: 400, message: `Invalid model name: ${name}` }),{ status: 400, headers: { "Content-Type": "application/json" } })
    const body = await request.json()
    let saved
    if (Array.isArray(body)) return new Response(JSON.stringify({ status: 412, message: 'Data Was Array' }),{ status: 412, headers: { "Content-Type": "application/json" } })
    else {
      const sanitizeArray = (arr) =>Array.isArray(arr) ? arr.map(item => item === '' ? '-' : item) : ['-'];
      const newEntry = new model({
        sno: body.sno,
        product: body.product,
        packing: sanitizeArray(body.packing),
        quantity: sanitizeArray(body.quantity),
        container: sanitizeArray(body.container)
      })
      saved = await newEntry.save()
    }
    return new Response(JSON.stringify(saved),{ status: 201, headers: { "Content-Type": "application/json" } })
  } catch (error) {
    if (error.code === 11000 && error.keyPattern?.product) return new Response(JSON.stringify({ error: `The product name "${error.keyValue.product}" is already in use.` }),{ status: 409, headers: { "Content-Type": "application/json" } })
    return new Response(JSON.stringify({ error: error.message }),{ status: 500, headers: { "Content-Type": "application/json" } })
  }
}

export async function PUT(request, { params }) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== "admin") return new Response(JSON.stringify({ message: "Forbidden" }), {status: 403, headers: { "Content-Type": "application/json" }})
  try {
    await connectMongoDB()
    const [modelName, documentId] = params.name.split('+')
    const model = modelMap[modelName]
    if (!model) return new Response(JSON.stringify({ message: `Invalid model name: ${modelName}` }), { status: 400, headers: { "Content-Type": "application/json" }})
    if (!documentId || !mongoose.Types.ObjectId.isValid(documentId)) return new Response(JSON.stringify({ error: 'Invalid or missing ID' }), { status: 400, headers: { 'Content-Type': 'application/json' }})
    const body = await request.json()
    const sanitizeArray = (arr) =>Array.isArray(arr) ? arr.map(item => item === '' ? '-' : item) : ['-'];
    const newEntry = new model({
      _id: documentId,
      sno: body.sno,
      product: body.product,
      packing: sanitizeArray(body.packing),
      quantity: sanitizeArray(body.quantity),
      container: sanitizeArray(body.container)
    })
    const updatedDoc = await model.findByIdAndUpdate( documentId, { $set: newEntry },{ new: true, runValidators: true })
    if (!updatedDoc) return new Response(JSON.stringify({ error: 'Resource not found' }), { status: 404, headers: { 'Content-Type': 'application/json' }})
    return new Response(JSON.stringify({message: 'Updated successfully'}), { status: 200, headers: { 'Content-Type': 'application/json' }})
  } catch (error) {
    console.error('PUT error:', error)
    if (error.code === 11000 && error.keyPattern?.product) return new Response(JSON.stringify({ error: `The product name "${error.keyValue.product}" is already in use.` }),{ status: 409, headers: { "Content-Type": "application/json" } })
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { "Content-Type": "application/json" }})
  }
}

export async function DELETE(_, { params }) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== "admin") return new Response(JSON.stringify({ message: "Forbidden" }),{ status: 403, headers: { "Content-Type": "application/json" } })
  try {
    await connectMongoDB()
    const name = await params
    const [modelName, documentId] = params.name.split('+')
    const model = modelMap[modelName]
    console.log(model)
    if (!model) return new Response(JSON.stringify({ status: 400, message: `Invalid model name: ${name}` }),{ status: 400, headers: { "Content-Type": "application/json" } })
    if (!documentId) return new Response(JSON.stringify({ error: 'Missing ID in request ' }), { status: 400, headers: { 'Content-Type': 'application/json' },})
    const result = await model.findByIdAndDelete(documentId)
    if (!result) return new Response(JSON.stringify({ error: 'Resource not found' }), { status: 404, headers: { 'Content-Type': 'application/json' },})
    return new Response(JSON.stringify({ message: 'Deleted successfully' }), { status: 200, headers: { 'Content-Type': 'application/json' },})
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }),{ status: 500, headers: { "Content-Type": "application/json" } })
  }
}

