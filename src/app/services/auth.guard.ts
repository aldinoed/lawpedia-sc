import { CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const token = localStorage.getItem('token');
  if(token === 'true'){
    return true;
  }
  alert("You need to login first!");
  return false;
};
