export interface Action<P> {
  type: string;
  payload?: P;
}
