'use client';
import { useCounter } from '@/hooks/use-counter';

type CounterProps = {
  from: number;
  to: number;
};

export const Counter: React.FC<CounterProps> = ({ from, to }) => {
  const count = useCounter(from, to);

  const formatLakh = (value: number) => {
    if (value >= 100000) {
      return `${(value / 100000).toFixed(2)} Lakh`;
    }
    return Math.round(value).toLocaleString('en-IN');
  };

  const displayValue = to >= 100000 ? formatLakh(count) : Math.round(count).toLocaleString('en-IN');

  return <span>{displayValue}</span>;
};
