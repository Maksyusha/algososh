type TStack<T> = {
  push: (item: T) => void;
  pop: () => void;
  clear: () => void;
  getItems: () => T[];
};



export class Stack<T> implements TStack<T> {
  private container: T[] = [];

  push(item: T) {
    this.container.push(item);
  }

  pop() {
    this.container.pop();
  }

  clear() {
    this.container = [];
  }

  getItems() {
    return this.container
  }
}
