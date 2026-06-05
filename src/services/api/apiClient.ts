// Custom API Client Adapter that routes requests to our Node/Express/MongoDB backend
class ApiQueryBuilder {
  private tableName: string;
  private method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" = "GET";
  private body: any = null;
  private selectCols: string = "*";
  private filters: { col: string; val: any }[] = [];
  private orderCol: string = "";
  private isAscending: boolean = true;
  private isSingle: boolean = false;

  constructor(tableName: string) {
    this.tableName = tableName;
  }

  select(columns: string = "*") {
    this.selectCols = columns;
    return this;
  }

  eq(column: string, value: any) {
    this.filters.push({ col: column, val: value });
    return this;
  }

  order(column: string, { ascending = true } = {}) {
    this.orderCol = column;
    this.isAscending = ascending;
    return this;
  }

  single() {
    this.isSingle = true;
    return this;
  }

  insert(data: any) {
    this.method = "POST";
    this.body = data;
    return this;
  }

  update(data: any) {
    this.method = "PUT";
    this.body = data;
    return this;
  }

  delete() {
    this.method = "DELETE";
    return this;
  }

  async then(onfulfilled?: (value: any) => any, onrejected?: (reason: any) => any) {
    try {
      const result = await this.execute();
      if (onfulfilled) return onfulfilled(result);
      return result;
    } catch (err) {
      if (onrejected) return onrejected(err);
      throw err;
    }
  }

  async catch(onrejected?: (reason: any) => any) {
    try {
      const result = await this.then();
      return result;
    } catch (err) {
      if (onrejected) return onrejected(err);
      throw err;
    }
  }

  async finally(onfinally?: () => void) {
    try {
      return await this.then();
    } finally {
      if (onfinally) onfinally();
    }
  }

  private async execute() {
    // Map table names to endpoints
    let endpoint = `/api/${this.tableName.replace("_", "-")}`;
    if (this.tableName === "blog_posts") {
      endpoint = "/api/blog";
    } else if (this.tableName === "analytics_events") {
      endpoint = "/api/analytics";
    }

    let url = endpoint;
    const idFilter = this.filters.find((f) => f.col === "id");
    const slugFilter = this.filters.find((f) => f.col === "slug");

    if (
      idFilter &&
      (this.method === "PUT" || this.method === "DELETE" || this.method === "PATCH")
    ) {
      url = `${endpoint}/${idFilter.val}`;
    } else if (slugFilter && this.method === "GET") {
      url = `${endpoint}/${slugFilter.val}`;
    }

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    const token = localStorage.getItem("sb-token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const options: RequestInit = {
      method: this.method,
      headers,
    };

    if (this.body) {
      const payload = (Array.isArray(this.body) && this.body.length === 1)
        ? this.body[0]
        : this.body;
      options.body = JSON.stringify(payload);
    }

    try {
      const response = await fetch(url, options);

      if (!response.ok) {
        const errBody = await response.json().catch(() => ({}));
        return {
          data: null,
          error: new Error(errBody.error || `HTTP error ${response.status}`),
        };
      }

      let data = await response.json();

      // Normalize IDs (MongoDB returns _id instead of id)
      const normalizeId = (item: any) => {
        if (item && typeof item === "object") {
          if (item._id && !item.id) {
            item.id = item._id;
          }
        }
        return item;
      };

      if (Array.isArray(data)) {
        data = data.map(normalizeId);

        // 1. Apply local filtering for GET requests
        if (this.method === "GET" && this.filters.length > 0) {
          data = data.filter((item) => {
            return this.filters.every((filter) => {
              // Skip slug/id filters since we resolved them in the URL
              if (filter.col === "slug" || filter.col === "id") return true;
              
              const itemVal = item[filter.col];
              return String(itemVal) === String(filter.val);
            });
          });
        }

        // 2. Apply local sorting for GET requests
        if (this.method === "GET" && this.orderCol) {
          data.sort((a: any, b: any) => {
            let valA = a[this.orderCol];
            let valB = b[this.orderCol];

            if (valA === undefined || valB === undefined) return 0;

            // Handle date objects or date strings
            if (this.orderCol === "created_at" || this.orderCol === "updated_at") {
              const timeA = new Date(valA).getTime();
              const timeB = new Date(valB).getTime();
              if (!isNaN(timeA) && !isNaN(timeB)) {
                return this.isAscending ? timeA - timeB : timeB - timeA;
              }
            }

            if (typeof valA === "string" && typeof valB === "string") {
              return this.isAscending
                ? valA.localeCompare(valB)
                : valB.localeCompare(valA);
            }

            return this.isAscending
              ? valA > valB ? 1 : -1
              : valA < valB ? 1 : -1;
          });
        }

        if (this.isSingle) {
          data = data[0] || null;
        }
      } else {
        data = normalizeId(data);
      }

      return { data, error: null };
    } catch (err: any) {
      return { data: null, error: err };
    }
  }
}

const auth = {
  async getSession() {
    const token = localStorage.getItem("sb-token");
    const userJson = localStorage.getItem("sb-user");
    if (!token || !userJson) {
      return { data: { session: null }, error: null };
    }
    try {
      const user = JSON.parse(userJson);
      return {
        data: {
          session: {
            access_token: token,
            user: { id: user.id, email: user.email, ...user },
          } as any,
        },
        error: null,
      };
    } catch (e) {
      return { data: { session: null }, error: null };
    }
  },

  onAuthStateChange(callback: (event: string, session: any) => void) {
    this.getSession().then(({ data: { session } }) => {
      callback("SIGNED_IN", session);
    });
    return {
      data: {
        subscription: {
          unsubscribe: () => {},
        },
      },
    };
  },

  async signInWithPassword({ email, password }: any) {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { data: null, error: new Error(data.error || "Failed to login") };
      }
      localStorage.setItem("sb-token", data.token);
      localStorage.setItem("sb-user", JSON.stringify(data.user));

      return {
        data: {
          user: { id: data.user.id, email: data.user.email },
          session: { access_token: data.token },
        },
        error: null,
      };
    } catch (err: any) {
      return { data: null, error: err };
    }
  },

  async signOut() {
    localStorage.removeItem("sb-token");
    localStorage.removeItem("sb-user");
    return { error: null };
  },
};

export const apiClient = {
  from(tableName: string) {
    return new ApiQueryBuilder(tableName);
  },
  auth,
};
export default apiClient;
