export const getFibonacciNumbers = (number: number) => {
    const numbers = [1, 1];
    for (let i = 2; i <= number; i++) {
      numbers.push(numbers[i - 2] + numbers[i - 1]);
    }
    return numbers;
  };