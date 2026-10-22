import { httpClient } from "./http-client";

export interface PostImage {
  id: string;
  url: string;
  postId: string;
  publicId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  thumbnail: string;
  thumbnailPublicId: string;
  createdAt: string;
  updatedAt: string;
  images?: PostImage[];
}

export interface PostsResponse {
  message: string;
  data: Post[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface PostDetailResponse {
  message: string;
  data: Post;
}

export interface GetPostsParams {
  page?: number;
  limit?: number;
  search?: string;
}

async function getPostsRequest(params: Record<string, string | number>): Promise<PostsResponse> {
  try {
    const response = await httpClient.get("/posts", { params });
    return response.data;
  } catch {
    const response = await httpClient.get("/post", { params });
    return response.data;
  }
}

export const postsService = {
  getPosts: async (options: GetPostsParams | number = {}): Promise<PostsResponse> => {
    if (typeof options === "number") {
      return getPostsRequest({ page: 1, limit: options });
    }

    const { page = 1, limit = 10, search } = options;
    const params: Record<string, string | number> = { page, limit };
    const trimmed = search?.trim();
    if (trimmed) {
      params.search = trimmed;
    }

    return getPostsRequest(params);
  },

  getPostById: async (id: string): Promise<PostDetailResponse> => {
    try {
      const response = await httpClient.get(`/posts/${id}`);
      return response.data;
    } catch {
      const response = await httpClient.get(`/post/${id}`);
      return response.data;
    }
  },
};
