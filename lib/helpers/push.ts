export const setStepQuery = (nextStep: number) => {
  const currentPath = window.location.pathname;
  const basePathBeforeCheckout = currentPath.substring(0, currentPath.indexOf('/checkout'));
  
  window.history.pushState(
    null, 
    '', 
    `${basePathBeforeCheckout}/checkout?step=${nextStep}`
  );
}