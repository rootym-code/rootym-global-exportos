import type {
    FollowUp,
  } from "@/lib/generated/prisma";
  
  export interface FollowUpSearchDocument {
    id: string;
    content: string;
  }
  
  export class FollowUpSearchIndex {
    private readonly documents =
      new Map<
        string,
        FollowUpSearchDocument
      >();
  
    index(
      followUp: Pick<
        FollowUp,
        | "id"
        | "title"
        | "description"
        | "status"
      >,
    ) {
      this.documents.set(
        followUp.id,
        {
          id: followUp.id,
          content: [
            followUp.title,
            followUp.description ?? "",
            followUp.status,
          ]
            .join(" ")
            .toLowerCase(),
        },
      );
    }
  
    remove(id: string) {
      this.documents.delete(id);
    }
  
    clear() {
      this.documents.clear();
    }
  
    search(
      query: string,
    ): string[] {
      const keyword =
        query.trim().toLowerCase();
  
      if (!keyword) {
        return [];
      }
  
      return [...this.documents.values()]
        .filter((document) =>
          document.content.includes(
            keyword,
          ),
        )
        .map((document) => document.id);
    }
  
    size() {
      return this.documents.size;
    }
  }
  
  const followUpSearchIndex =
    new FollowUpSearchIndex();
  
  export default followUpSearchIndex;