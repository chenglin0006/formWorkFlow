// use localStorage to store the authority info, which might be sent from server in actual project.
export function getAuthority(str) {
  // return localStorage.getItem('bnq-authority') || ['admin', 'user'];
  const authorityString = typeof str === 'undefined' ? localStorage.getItem('bnq-authority') : str;
  // authorityString could be admin, "admin", ["admin"]
  let authority;
  try {
    authority = JSON.parse(authorityString);
  } catch (e) {
    authority = authorityString;
  }
  // if (typeof authority === 'string') {
  //   return [authority];
  // }
  return authority;
}

export function setAuthority(authority) {
  // const proAuthority = typeof authority === 'string' ? [authority] : authority;
  if (!authority) {
    return localStorage.removeItem('bnq-authority');
  }
  return localStorage.setItem('bnq-authority', JSON.stringify(authority));
}
