import { NextRequest, NextResponse } from "next/server";
import * as llamaIndex from "llamaindex";
import fs from "fs/promises";
import * as path from "path";
export async function GET(request: NextRequest) {
  const greeting = "Hello World!!";
  const json = {
    greeting: await main(),
  };

  return NextResponse.json(json);
}
async function main() {
  try {
    const filePath = path.join(__dirname, "../../../../../public/essay.txt"); // Load essay from abramov.txt in Node
    const essay = await fs.readFile(filePath, "utf-8");

    // Create Document object with essay
    const document = new llamaIndex.Document({ text: essay });

    // Split text and create embeddings. Store them in a VectorStoreIndex
    const index = await llamaIndex.VectorStoreIndex.fromDocuments([document]);

    // Query the index
    const queryEngine = index.asQueryEngine();
    const response = await queryEngine.query({
      query: "Who is my manager",
    });
    return response.toString();
  } catch (error) {
    console.log(error);

    NextResponse.json(error);
  }
}
