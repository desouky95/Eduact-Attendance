declare type ApiResponse<T> = {
  data: T;
  message?: string;
  meta?: {
    current_page: null;
    first_page: number;
    first_page_url: '/?page=1';
    last_page: number;
    last_page_url: '/?page=5';
    next_page_url: null;
    per_page: number;
    previous_page_url: null;
    total: number;
  };
};
