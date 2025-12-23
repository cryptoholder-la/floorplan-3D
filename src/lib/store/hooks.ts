import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '@/lib/store';

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector = useSelector as unknown as <TSelected>(
  selector: (state: RootState) => TSelected
) => TSelected;
