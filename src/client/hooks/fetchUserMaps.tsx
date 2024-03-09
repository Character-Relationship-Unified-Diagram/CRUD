import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setAllMaps } from '../redux/mainSlice';
import { RootState } from '../redux/store';

export const useFetchUserMaps = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.main.user.username);
  useEffect(() => {
    fetch('/maps/get-maps', {
      method: 'GET',
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => {
        dispatch(setAllMaps(data));
      })
      .catch((err) => console.log(err));
  }, [user]);
};
