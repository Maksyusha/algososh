type TQueue<T> = {
  isEmpty: () => boolean;
  enqueue: (item: T) => void;
  dequeue: () => void;
  getItems: () => Array<T | null>;
  getHead: () => number;
  getTail: () => number;
  clear: () => void;
};

export class Queue<T> implements TQueue<T> {
  private container: Array<T | null> = [];
  private head = 0;
  private tail = 0;
  private readonly size: number = 0;
  private length = 0;

  constructor(size: number) {
    this.size = size;
    this.container = Array(size);
  }

  isEmpty() {
    return this.length === 0;
  }

  enqueue(item: T) {
    if (this.length >= this.size) {
      return;
    }

    this.container[this.tail % this.size] = item;
    this.tail++;
    this.length++;
  }

  dequeue() {
    if (this.isEmpty()) {
      return;
    }

    this.container[this.head % this.size] = null;
    this.head++;
    this.length--;
  }

  getItems() {
    return this.container;
  }

  getHead() {
    return this.head;
  }

  getTail() {
    return this.tail;
  }

  clear() {
    this.container = Array(this.size);
    this.head = 0
    this.tail = 0
    this.length = 0
  }
}
