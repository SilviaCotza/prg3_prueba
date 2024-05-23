import postgres from "postgres";

//conexion a la base de datos foodservice
    const dbConnect = postgres('postgres://usuario:IVBlxquHntKdoOBDY0rnCw2Wn2QWLdBz@dpg-cp38uu821fec73b3k7r0-a.oregon-postgres.render.com/proyecttodb1_y2ra',{
    ssl: {
        // Habilitar SSL
        rejectUnauthorized: false // Configura para aceptar certificados autofirmados, en producción, usa certificados de confianza
    }
    });

//const dbConnect = postgres('postgres://postgres:Santi00**@localhost:5432/food');

export default dbConnect;

