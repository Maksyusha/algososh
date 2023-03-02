import { ElementStates } from "../../types/element-states";

class Node<T> {
  value: T;
  next: Node<T> | null;
  constructor(value: T, next?: Node<T> | null) {
    this.value = value;
    this.next = next === undefined ? null : next;
  }
}

type TLinkedList<T> = {
  prepend: (item: T) => void;
  append: (item: T) => void;
  addByIndex: (item: T, index: number) => void;
  deleteHead: () => void;
  deleteTail: () => void;
  deleteByIndex: (index: number) => void;
  getSize: () => number;
  toArray: () => T[];
  getArray: () => { value: T; state: ElementStates }[];
};

export class LinkedList<T> implements TLinkedList<T> {
  private head: Node<T> | null;
  private size: number;
  constructor() {
    this.head = null;
    this.size = 0;
  }

  prepend(item: T) {
    if (this.head === null) {
      this.head = new Node(item);
    } else {
      const temp = this.head;
      this.head = new Node(item, temp);
    }

    this.size++;
  }

  append(item: T) {
    const node = new Node(item);

    if (this.head === null) {
      this.head = node;
    } else {
      let current = this.head;

      while (current.next) {
        current = current.next;
      }

      current.next = node;
    }

    this.size++;
  }

  addByIndex(item: T, index: number) {
    if (index < 0 || index > this.size) {
      return;
    } else {
      const node = new Node(item);

      if (index === 0) {
        node.next = this.head;
        this.head = node;
      } else {
        let current = this.head;
        let currentIndex = 0;
        let previous = null;

        while (currentIndex++ <= index) {
          if (current?.next && currentIndex !== index) {
            previous = current;
            current = current.next;
          }
        }

        if (previous !== null) {
          node.next = current;
          previous.next = node;
        }

        if (previous === null && current !== null) {
          current.next = node;
        }
      }

      this.size++;
    }
  }

  deleteHead() {
    if (this.head !== null) {
      if (this.head.next === null) {
        this.head = null;
      } else {
        this.head = this.head.next;
      }

      this.size--;
    }
  }

  deleteTail() {
    if (this.head !== null) {
      if (this.head.next === null) {
        this.head = null;
      } else {
        let current = this.head;

        while (current.next && current.next.next) {
          current = current.next;
        }

        current.next = null;
      }

      this.size--;
    }
  }

  deleteByIndex(index: number) {
    if (index < 0 || index > this.size) {
      return;
    } else {
      if (index === 0) {
        if (this.head && this.head.next) {
          this.head = this.head.next;
        } else {
          this.head = null;
        }
      } else {
        let current = this.head;
        let currentIndex = 0;
        let previous = null;

        while (currentIndex++ <= index) {
          if (current?.next && currentIndex !== index) {
            previous = current;
            current = current.next;
          }
        }

        if (previous !== null) {
          if (current) {
            previous.next = current.next;
          } else {
            previous.next = null;
          }
        }
      }

      this.size--;
    }
  }

  getSize() {
    return this.size;
  }

  toArray() {
    const arr = [];
    let current = this.head;

    while (current) {
      arr.push(current.value);
      current = current.next;
    }

    return [...arr];
  }

  getArray() {
    return this.toArray().map((item) => ({
      value: item,
      state: ElementStates.Default,
    }));
  }
}
