import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { QdrantClient } from "@qdrant/js-client-rest";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE_PATH = path.join(__dirname, "vector_db.json");

export interface VectorDocument {
  id: string;
  text: string;
  embedding: number[];
  metadata: Record<string, any>;
}

export interface VectorStoreInterface {
  addDocument(id: string, text: string, embedding: number[], metadata?: Record<string, any>): Promise<void>;
  similaritySearch(queryEmbedding: number[], topK?: number): Promise<Array<{ doc: VectorDocument; score: number }>>;
  clear(): Promise<void>;
  isEmpty(): Promise<boolean>;
}

// Helper to generate a deterministic RFC4122 UUID from string ID (required by Qdrant)
function getDeterministicUuid(input: string): string {
  let hash1 = 0;
  let hash2 = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash1 = (hash1 * 31 + char) | 0;
    hash2 = (hash2 * 13 + char) | 0;
  }
  const p1 = Math.abs(hash1).toString(16).padStart(8, "0");
  const p2 = Math.abs(hash2).toString(16).padStart(4, "0");
  const p3 = Math.abs(hash1 ^ hash2).toString(16).padStart(4, "0");
  const p4 = Math.abs(hash2 * 3).toString(16).padStart(4, "0");
  const p5 = Math.abs(hash1 * 7).toString(16).padStart(12, "0");
  return `${p1.substring(0, 8)}-${p2.substring(0, 4)}-${p3.substring(0, 4)}-${p4.substring(0, 4)}-${p5.substring(0, 12)}`;
}

class LocalVectorStore implements VectorStoreInterface {
  private documents: VectorDocument[] = [];

  constructor() {
    this.loadFromDisk();
  }

  private loadFromDisk() {
    try {
      if (fs.existsSync(DB_FILE_PATH)) {
        const data = fs.readFileSync(DB_FILE_PATH, "utf-8");
        this.documents = JSON.parse(data);
        console.log(`[VectorStore] Loaded ${this.documents.length} vectors from persistent storage.`);
      }
    } catch (error) {
      console.error(`[VectorStore] Error loading database: ${(error as Error).message}`);
    }
  }

  private saveToDisk() {
    try {
      fs.writeFileSync(DB_FILE_PATH, JSON.stringify(this.documents, null, 2), "utf-8");
    } catch (error) {
      console.error(`[VectorStore] Error saving database to disk: ${(error as Error).message}`);
    }
  }

  async addDocument(id: string, text: string, embedding: number[], metadata: Record<string, any> = {}): Promise<void> {
    this.documents = this.documents.filter((doc) => doc.id !== id);
    this.documents.push({ id, text, embedding, metadata });
    this.saveToDisk();
  }

  cosineSimilarity(vecA: number[], vecB: number[]): number {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    const len = Math.min(vecA.length, vecB.length);
    for (let i = 0; i < len; i++) {
      dotProduct += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }
    if (normA === 0 || normB === 0) return 0;
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  async similaritySearch(queryEmbedding: number[], topK: number = 3): Promise<Array<{ doc: VectorDocument; score: number }>> {
    const results = this.documents.map((doc) => {
      const score = this.cosineSimilarity(queryEmbedding, doc.embedding);
      return { doc, score };
    });
    return results.sort((a, b) => b.score - a.score).slice(0, topK);
  }

  async clear(): Promise<void> {
    this.documents = [];
    this.saveToDisk();
  }

  async isEmpty(): Promise<boolean> {
    return this.documents.length === 0;
  }
}

class QdrantVectorStore implements VectorStoreInterface {
  private client: QdrantClient;
  private collectionName = "portfolio_collection";

  constructor(url: string, apiKey?: string) {
    this.client = new QdrantClient({ url, apiKey });
    this.initCollection();
  }

  private async initCollection() {
    try {
      const collections = await this.client.getCollections();
      const exists = collections.collections.some((c) => c.name === this.collectionName);
      if (!exists) {
        // text-embedding-004 vectors are 768 dimensions
        await this.client.createCollection(this.collectionName, {
          vectors: {
            size: 768,
            distance: "Cosine",
          },
        });
        console.log(`[Qdrant] Created collection "${this.collectionName}".`);
      }
    } catch (err) {
      console.warn("⚠️ [Qdrant] Failed to initialize collection:", (err as Error).message);
    }
  }

  async addDocument(id: string, text: string, embedding: number[], metadata: Record<string, any> = {}): Promise<void> {
    try {
      const pointId = getDeterministicUuid(id);
      await this.client.upsert(this.collectionName, {
        points: [
          {
            id: pointId,
            vector: embedding,
            payload: { text, ...metadata },
          },
        ],
      });
    } catch (err) {
      console.error("[Qdrant] addDocument error:", err);
    }
  }

  async similaritySearch(queryEmbedding: number[], topK: number = 3): Promise<Array<{ doc: VectorDocument; score: number }>> {
    try {
      const results = await this.client.search(this.collectionName, {
        vector: queryEmbedding,
        limit: topK,
        with_payload: true,
      });
      return results.map((r) => ({
        doc: {
          id: String(r.id),
          text: String(r.payload?.text || ""),
          embedding: [],
          metadata: r.payload || {},
        },
        score: r.score,
      }));
    } catch (err) {
      console.error("[Qdrant] search error:", err);
      return [];
    }
  }

  async clear(): Promise<void> {
    try {
      await this.client.deleteCollection(this.collectionName);
      await this.initCollection();
    } catch (err) {
      console.error("[Qdrant] clear error:", err);
    }
  }

  async isEmpty(): Promise<boolean> {
    try {
      const info = await this.client.getCollection(this.collectionName);
      return (info.points_count || 0) === 0;
    } catch (err) {
      return true;
    }
  }
}

// Instantiate vector store based on QDRANT_URL environment variable
const qdrantUrl = process.env.QDRANT_URL;
const qdrantApiKey = process.env.QDRANT_API_KEY;
let storeInstance: VectorStoreInterface;

if (qdrantUrl) {
  console.log(`🔌 [VectorStore] Connecting to Qdrant at ${qdrantUrl}...`);
  storeInstance = new QdrantVectorStore(qdrantUrl, qdrantApiKey);
} else {
  console.log("ℹ️ [VectorStore] QDRANT_URL not configured. Running local vector store.");
  storeInstance = new LocalVectorStore();
}

export const vectorStore = storeInstance;
