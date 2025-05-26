interface Window {
  ENV?: {
    VITE_ODOO_URL: string;
    VITE_ODOO_DB: string;
    [key: string]: string;
  };
}