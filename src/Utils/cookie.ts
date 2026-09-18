export const getCookie = (cname:any) => {
  if(typeof window!=='undefined') {
  let name = `${cname  }=`;
  let ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
  }
}


export const setCookies = (coName:any,val:any)=>{
  const cookieName = coName;
  const cookieValue = val;
  const daysToExpire = 70;
  const date = new Date();
  date.setTime(date.getTime() + (daysToExpire * 24 * 60 * 60 * 1000));
  const expires = `expires=${  date.toUTCString()}`;
  if(typeof window!=='undefined')
  document.cookie = `${cookieName}=${cookieValue};${expires};path=/`;
  window.location.href = '/';
}

