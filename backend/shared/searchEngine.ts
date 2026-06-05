import { MeiliSearch } from "meilisearch";
import Fuse from "fuse.js";

export interface SearchDocument {
  id: string;
  title: string;
  content: string;
  type: "blog" | "project" | "experience" | "skill";
  url: string;
}

export interface SearchResult {
  id: string;
  title: string;
  content: string;
  type: string;
  url: string;
  score?: number;
  highlights?: {
    title?: string;
    content?: string;
  };
}

export interface SearchEngineInterface {
  indexDocuments(documents: SearchDocument[]): Promise<void>;
  search(query: string, options?: { limit?: number }): Promise<SearchResult[]>;
  clear(): Promise<void>;
}

class FuseSearchEngine implements SearchEngineInterface {
  private documents: SearchDocument[] = [];
  private fuse: Fuse<SearchDocument> | null = null;

  async indexDocuments(documents: SearchDocument[]): Promise<void> {
    this.documents = documents;
    this.fuse = new Fuse(documents, {
      keys: [
        { name: "title", weight: 2 },
        { name: "content", weight: 1 }
      ],
      includeScore: true,
      includeMatches: true,
      threshold: 0.4,
    });
    console.log(`[SearchEngine] Fuse.js indexed ${documents.length} documents.`);
  }

  async search(query: string, options?: { limit?: number }): Promise<SearchResult[]> {
    if (!this.fuse) return [];
    const limit = options?.limit || 10;
    const results = this.fuse.search(query);

    return results.slice(0, limit).map((r) => {
      const titleMatches = r.matches?.find(m => m.key === "title");
      const contentMatches = r.matches?.find(m => m.key === "content");

      const highlightTitle = titleMatches ? highlightText(r.item.title, titleMatches.indices) : r.item.title;
      const highlightContent = contentMatches ? highlightText(r.item.content, contentMatches.indices) : r.item.content;

      return {
        id: r.item.id,
        title: r.item.title,
        content: r.item.content,
        type: r.item.type,
        url: r.item.url,
        score: r.score ? 1 - r.score : 0,
        highlights: {
          title: highlightTitle,
          content: highlightContent
        }
      };
    });
  }

  async clear(): Promise<void> {
    this.documents = [];
    this.fuse = null;
  }
}

function highlightText(text: string, indices: readonly [number, number][]): string {
  let result = "";
  let lastIndex = 0;
  const sorted = [...indices].sort((a, b) => a[0] - b[0]);
  
  for (const [start, end] of sorted) {
    if (start > lastIndex) {
      result += text.substring(lastIndex, start);
    }
    result += `<mark class="bg-primary/20 text-primary font-semibold">${text.substring(start, end + 1)}</mark>`;
    lastIndex = end + 1;
  }
  if (lastIndex < text.length) {
    result += text.substring(lastIndex);
  }
  return result;
}

class MeiliSearchEngine implements SearchEngineInterface {
  private client: MeiliSearch;
  private indexName = "portfolio_search";

  constructor(host: string, apiKey?: string) {
    this.client = new MeiliSearch({ host, apiKey });
  }

  async indexDocuments(documents: SearchDocument[]): Promise<void> {
    try {
      const index = this.client.index(this.indexName);
      await index.addDocuments(documents);
      console.log(`[SearchEngine] Meilisearch sent ${documents.length} documents for indexing.`);
    } catch (err: any) {
      console.error("[SearchEngine Meilisearch] Indexing error:", err.message);
    }
  }

  async search(query: string, options?: { limit?: number }): Promise<SearchResult[]> {
    try {
      const index = this.client.index(this.indexName);
      const limit = options?.limit || 10;
      const searchRes = await index.search(query, {
        limit,
        attributesToHighlight: ["title", "content"],
        highlightPreTag: '<mark class="bg-primary/20 text-primary font-semibold">',
        highlightPostTag: "</mark>"
      });

      return searchRes.hits.map((hit: any) => {
        return {
          id: hit.id,
          title: hit.title,
          content: hit.content,
          type: hit.type,
          url: hit.url,
          score: 1,
          highlights: {
            title: hit._formatted?.title || hit.title,
            content: hit._formatted?.content || hit.content
          }
        };
      });
    } catch (err: any) {
      console.error("[SearchEngine Meilisearch] Search error:", err.message);
      return [];
    }
  }

  async clear(): Promise<void> {
    try {
      const index = this.client.index(this.indexName);
      await index.deleteAllDocuments();
    } catch (err: any) {
      console.error("[SearchEngine Meilisearch] Clear error:", err.message);
    }
  }
}

// Instantiate search engine helper based on MEILISEARCH_HOST environment variable
const meiliHost = process.env.MEILISEARCH_HOST;
const meiliKey = process.env.MEILISEARCH_API_KEY;
let engineInstance: SearchEngineInterface;

if (meiliHost) {
  console.log(`🔌 [SearchEngine] Connecting to Meilisearch at ${meiliHost}...`);
  engineInstance = new MeiliSearchEngine(meiliHost, meiliKey);
} else {
  console.log("ℹ️ [SearchEngine] MEILISEARCH_HOST not configured. Running in-memory Fuse.js search engine.");
  engineInstance = new FuseSearchEngine();
}

export const searchEngine = engineInstance;
