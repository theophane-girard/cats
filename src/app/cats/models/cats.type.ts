export type Cat = {
  id: number;
  name: string;
  birthday: string;
  breed: string;
  description: string;
  avg_rating: number;
};

export type Comment = {
  id: number;
  note: number;
  text: string;
  cat: number;
  created: Date;
};

export type GetResponse<T> = {
  count: number;
  next: string;
  previous: string;
  results: T[];
};
export type CreateCatForm = Omit<Cat, 'id' | 'avg_rating'>;
export type CreateCommentForm = Omit<Comment, 'id' | 'cat' | 'created'> & {
  cat: number;
};
