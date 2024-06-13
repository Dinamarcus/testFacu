import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  mode: 'development',
  // Punto de entrada de tu aplicación
  entry: './src/app.js',
  // Configuración de salida
  output: {
    filename: 'bundle.js', // Nombre del archivo de salida
    path: path.resolve(__dirname, './public/js'), // Directorio de salida
  },
};