interface ImportMetaEnv {
   /*
   acá se puede importar variables de entorno el .env (por ejemplo el api del backend)
   */
    readonly VITE_API_URL: string;
 }  

 interface ImportMeta {
    readonly env: ImportMetaEnv;
 }