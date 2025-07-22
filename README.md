# 🥗 NutriPlaner - Planificador de Menús Personalizados

**NutriPlaner** es una aplicación web moderna para la planificación de menús personalizados, diseñada para adaptarse a los objetivos nutricionales, rutinas y preferencias alimentarias de cada usuario.

---

## 🚀 Características

- ✅ Configuración de perfiles de usuario
- 🔥 Cálculo automático de calorías y macronutrientes
- 🧠 Generación inteligente de menús personalizados
- 📅 Planificación semanal de comidas
- 🛒 Lista de compras basada en menús (por semana o por día)
- 💾 Almacenamiento de menús favoritos
- ♻️ Sustituciones automáticas de ingredientes
- 📄 Exportación de menús (diarios y semanales) en PDF

---

## 🧰 Tecnologías

- ⚛️ [Next.js 14](https://nextjs.org/docs) (App Router)
- 🟦 TypeScript
- 🎨 [Tailwind CSS](https://tailwindcss.com/)
- 🐘 PostgreSQL
- 🧬 [Prisma ORM](https://www.prisma.io/)
- 🌐 **Context API** para la gestión global de estado

---

## 🧱 Arquitectura y Buenas Prácticas

- **Context API** para manejar estados globales como:
  - Perfil del usuario
  - Datos nutricionales y preferencias
  - Menús generados y seleccionados
  - Autenticación y sesión

- **Estructura modular del proyecto:**
  - `/app` - Rutas y páginas de la aplicación
  - `/components` - Componentes reutilizables
  - `/contexts` - Contextos para estado global
  - `/hooks` - Hooks personalizados
  - `/services` - Servicios para lógica de negocio
  - `/utils` - Utilidades y funciones auxiliares
  - `/types` - Definiciones de tipos TypeScript
  - `/lib` - Bibliotecas y configuraciones
  - `/public` - Archivos estáticos

---

## 🚀 Instalación y Configuración

### Requisitos previos

- Node.js 18.x o superior
- PostgreSQL
- pnpm (recomendado)

### Pasos para instalar

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/tu-usuario/nutriplaner.git
   cd nutriplaner
   ```

2. Instalar dependencias:
   ```bash
   pnpm install
   ```

3. Configurar variables de entorno:
   - Copia el archivo `.env.example` a `.env`
   - Actualiza las variables con tus configuraciones

4. Configurar la base de datos completa:
   ```bash
   pnpm db:setup
   ```
   Este comando ejecuta migraciones, crea datos de prueba y usuarios.

5. Iniciar el servidor de desarrollo:
   ```bash
   pnpm dev
   ```

6. Abrir [http://localhost:3000](http://localhost:3000) en tu navegador.

### Comandos Disponibles

```bash
# Desarrollo
pnpm dev          # Iniciar servidor de desarrollo
pnpm build        # Construir para producción
pnpm start        # Iniciar servidor de producción
pnpm lint         # Ejecutar linter

# Base de datos
pnpm db:setup     # Configuración completa (migraciones + datos + usuarios)
pnpm db:seed      # Solo crear datos de prueba (alimentos, recetas, códigos)
pnpm db:users     # Solo crear usuarios de prueba

# Prisma
pnpm dlx prisma migrate dev    # Ejecutar migraciones
pnpm dlx prisma generate       # Generar cliente Prisma
pnpm dlx prisma studio         # Abrir Prisma Studio
```

---

## � Usouarios de Prueba

Después de ejecutar `pnpm db:setup`, tendrás acceso a estos usuarios:

### 👑 Administrador
- **Email:** `admin@nutriplaner.com`
- **Contraseña:** `admin123456`
- **Permisos:** Gestión de usuarios y códigos de invitación

### 👤 Usuarios Regulares
- **Email:** `juan@test.com` | **Contraseña:** `password123`
- **Email:** `maria@test.com` | **Contraseña:** `password123`
- **Email:** `carlos@test.com` | **Contraseña:** `password123`
- **Permisos:** Crear perfiles, generar menús, listas de compras

## 🎫 Códigos de Invitación Disponibles

Para registrar nuevos usuarios, usa cualquiera de estos códigos:

- `WELCOME` (1000 usos)
- `NUTRI2024` (100 usos)
- `HEALTH123` (50 usos)
- `PLANNER2024` (25 usos)
- `BETA2024` (10 usos)

---

## 📝 Uso

1. **Registro y Login**: Crea una cuenta o inicia sesión con los usuarios de prueba.
2. **Configura tu Perfil**: Completa tu información personal y preferencias alimentarias.
3. **Genera Menús**: Crea menús diarios o semanales personalizados.
4. **Gestiona tus Compras**: Genera listas de compras basadas en tus menús.
5. **Guarda Favoritos**: Marca tus menús favoritos para usarlos en el futuro.

---

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor, sigue estos pasos:

1. Haz fork del proyecto
2. Crea una rama para tu característica (`git checkout -b feature/amazing-feature`)
3. Haz commit de tus cambios (`git commit -m 'Add some amazing feature'`)
4. Haz push a la rama (`git push origin feature/amazing-feature`)
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo `LICENSE` para más detalles.

---

## 📞 Contacto

Si tienes preguntas o sugerencias, no dudes en contactarnos:

- Email: [tu-email@ejemplo.com](mailto:tu-email@ejemplo.com)
- Twitter: [@tu_usuario](https://twitter.com/tu_usuario)
- GitHub: [tu-usuario](https://github.com/tu-usuario)