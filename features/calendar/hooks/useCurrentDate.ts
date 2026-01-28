import { useSearchParams } from 'next/navigation';
import { parse, isValid } from 'date-fns';

export const useCurrentDate = () => {
  const searchParams = useSearchParams();
  const dateParam = searchParams.get('date');

  if (dateParam) {
    const parsedDate = parse(dateParam, 'yyyy-MM-dd', new Date());
    return isValid(parsedDate) ? parsedDate : new Date();
  }

  return new Date();
};
