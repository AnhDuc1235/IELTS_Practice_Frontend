import { httpClient } from "@/services/http-client";

export interface CreateOrderPayload {
  receiverName: string;
  phone: string;
  shippingAddress: string;
  paymentMethod: string;
}

export interface CreateOrderResponse {
  message: string;
  data: {
    order: OrderDetail;
    qrUrl?: string;
  };
  qrUrl?: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  price: string;
  quantity: number;
  createdAt: string;
  updatedAt: string;
}

export interface OrderDetail {
  id: string;
  userId: string;
  subTotal: string;
  shippingFee: string;
  totalAmount: string;
  status: string;
  receiverName: string;
  phone: string;
  shippingAddress: string;
  trackingCode: string | null;
  paymentMethod: string;
  isPaid: boolean;
  sepayRef: string | null;
  createdAt: string;
  updatedAt: string;
  orderItems?: OrderItem[];
}

export interface GetOrderByIdResponse {
  message: string;
  data: OrderDetail;
}

export interface OrdersPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface GetMyOrdersResponse {
  message: string;
  data: OrderDetail[];
  pagination: OrdersPagination;
}

export type OrderSort = "newest" | "oldest";

export interface GetMyOrdersParams {
  page?: number;
  limit?: number;
  sort?: OrderSort;
}

interface ApiGetMyOrdersParams {
  page?: number;
  limit?: number;
  sort?: "asc" | "desc";
}

function buildGetMyOrdersParams(params?: GetMyOrdersParams): ApiGetMyOrdersParams {
  if (!params) {
    return {};
  }

  const queryParams: ApiGetMyOrdersParams = {
    page: params.page,
    limit: params.limit,
  };

  if (params.sort === "oldest") {
    queryParams.sort = "asc";
    return queryParams;
  }

  queryParams.sort = "desc";
  return queryParams;
}

export const orderService = {
  async createOrder(payload: CreateOrderPayload): Promise<CreateOrderResponse> {
    const response = await httpClient.post("/order", payload);
    return response.data;
  },

  async getOrderById(orderId: string): Promise<GetOrderByIdResponse> {
    const response = await httpClient.get(`/order/${orderId}`);
    return response.data;
  },

  async getMyOrders(params?: GetMyOrdersParams): Promise<GetMyOrdersResponse> {
    const response = await httpClient.get("/order/me", {
      params: buildGetMyOrdersParams(params),
    });
    return response.data;
  },
};
