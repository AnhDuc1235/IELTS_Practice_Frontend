import { httpClient } from "./http-client";

export interface SlideImage {
  id: string;
  url: string;
  slideId: string;
  publicId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Slide {
  id: string;
  title: string;
  imageUrl: string;
  publicId: string;
  linkUrl: string;
  order: number;
  createdAt: string;
  updatedAt: string;
  images: SlideImage[];
}

export interface SlidesResponse {
  message: string;
  data: Slide[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const slidesService = {
  getSlides: async (): Promise<SlidesResponse> => {
    try {
      const response = await httpClient.get("/slide", {
        params: {
          page: 1,
          limit: 10,
        },
      });
      return response.data;
    } catch {
      const fallback = await httpClient.get("/slides", {
        params: {
          page: 1,
          limit: 10,
        },
      });
      return fallback.data;
    }
  },
};
