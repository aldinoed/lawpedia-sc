import { CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const token = localStorage.getItem('token');
  if(token === 'true'){
    return true;
  }
  alert("You need to login first!");
  return false;
};

export const adminGuard: CanActivateFn = (route, state) => {
  const token = localStorage.getItem('token');
  const admin = localStorage.getItem('admin');
  if(token === 'true' && admin === 'true'){
    return true;
  }
  alert("You are not authorized to access this page!");
  return false;
}