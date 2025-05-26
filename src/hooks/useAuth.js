/* eslint-disable linebreak-style */
// Kita tidak akan menggunakan custom hook untuk sesederhana ini.
// Status autentikasi akan dikelola langsung di Redux.
import { useSelector } from 'react-redux';

function useAuth() {
  return useSelector((state) => state.auth.token);
}

export default useAuth;
