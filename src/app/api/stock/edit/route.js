import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/route"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== "admin")
    return new Response(JSON.stringify({ message: "Forbidden" }), { status: 403 })
  return new Response(JSON.stringify({ message: "Welcome Admin!" }), { status: 200 })
}

