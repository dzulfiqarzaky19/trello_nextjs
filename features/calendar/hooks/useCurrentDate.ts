import { useSearchParams } from 'next/navigation';
import { parse, isValid } from 'date-fns';

export const useCurrentDate = () => {
  const searchParams = useSearchParams();
  const monthParam = searchParams.get('month');

  const parsedDate = monthParam
    ? parse(monthParam, 'yyyy-MM', new Date())
    : new Date();

  return isValid(parsedDate) ? parsedDate : new Date();
};
