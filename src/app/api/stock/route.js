import { connectMongoDB } from "@/lib/mongodb";
import * as models from "@/models/stock";

export async function GET(request) {
  try {
    await connectMongoDB();

    const products = await models.Atharv.find({});

    if (products.length === 0) {
      return new Response(
        JSON.stringify({ status: 404, message: "No data found." }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({ status: 200, products }), 
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error fetching products:", error);
    return new Response(
      JSON.stringify({
        status: 500,
        message: "Internal server error",
        error: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

