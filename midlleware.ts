// Appliquer à toutes les pages sauf API, assets statiques et images
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.(png|jpg|jpeg|svg|ico)$).*)"],
};
