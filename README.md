# 🥗 NutriPlaner - Planificador de Menús Personalizados

**NutriPlaner** es una aplicación web moderna para la planificación de menús personalizados, diseñada para adaptarse a los objetivos nutricionales, rutinas y preferencias alimentarias de cada usuario.

---

## 🚀 Características

- ✅ Configuración de perfiles de usuario con objetivos nutricionales
- 🔥 Cálculo automático de calorías y macronutrientes basado en perfil
- 🧠 Generación inteligente de menús personalizados con algoritmos adaptativos
- 📅 Planificación diaria y semanal de comidas
- 🛒 Lista de compras automática basada en menús seleccionados
- 💾 Almacenamiento de menús favoritos y historial
- ♻️ Sustituciones automáticas de ingredientes según disponibilidad
- 📄 Exportación de menús y listas de compras en PDF
- 👥 Sistema de administración con códigos de invitación
- 🔐 Autenticación personalizada con bcrypt

---

## 🧰 Stack Tecnológico

- ⚛️ **[Next.js 15.4.2](https://nextjs.org/docs)** - Framework React con App Router
- 🟦 **TypeScript 5.x** - Tipado estático con modo estricto
- 🎨 **[Tailwind CSS 4.x](https://tailwindcss.com/)** - Framework CSS utility-first
- 🐘 **PostgreSQL** - Base de datos relacional
- 🧬 **[Prisma ORM 6.12.0](https://www.prisma.io/)** - ORM type-safe
- 🔐 **bcryptjs** - Hash de contraseñas
- 📄 **jsPDF + jspdf-autotable** - Generación de PDFs
- 🌐 **React Context API** - Gestión de estado global
- 🛠️ **ESLint + TypeScript** - Linting y análisis de código

---

## 🏗️ Arquitectura del Proyecto

### Estructura de Directorios
```
nutriplaner/
├── src/app/                 # Next.js App Router
│   ├── api/                 # API Routes (REST endpoints)
│   ├── components/          # Componentes React reutilizables
│   ├── contexts/            # React Context providers
│   ├── services/            # Lógica de negocio y servicios
│   ├── types/               # Definiciones TypeScript
│   ├── utils/               # Funciones utilitarias
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Configuraciones de librerías
│   └── scripts/             # Scripts de seeding y utilidades
├── prisma/                  # Schema y migraciones de BD
├── public/                  # Assets estáticos
└── package.json
```

### Patrones de Arquitectura

- **Context API** para estado global:
  - `AuthContext` - Autenticación y sesión de usuario
  - `ProfileContext` - Perfil nutricional y preferencias
  - `MenuContext` - Menús generados y favoritos

- **Servicios especializados:**
  - `nutritionServiceClient` - Cálculos nutricionales
  - `intelligentMenuService` - Algoritmos de generación de menús
  - `menuService` - CRUD de menús
  - `authService` - Autenticación y autorización

- **Tipos TypeScript estrictos:**
  - Interfaces para modelos de BD (User, Recipe, Menu, etc.)
  - Tipos extendidos para lógica de negocio
  - Validación de tipos en tiempo de compilación

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

## 👥 Usuarios de Prueba

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

## 🔌 API Endpoints

La aplicación expone una API REST completa para todas las funcionalidades:

### Autenticación
- `POST /api/auth/login` - Inicio de sesión
- `POST /api/auth/register` - Registro de usuario

### Perfiles de Usuario
- `GET /api/profile/[userId]` - Obtener perfil
- `PUT /api/profile/[userId]` - Actualizar perfil
- `POST /api/profile` - Crear perfil

### Menús y Planificación
- `GET /api/menus/user/[userId]` - Obtener menús del usuario
- `POST /api/nutrition/meal-plan/daily` - Generar plan diario
- `POST /api/nutrition/meal-plan/weekly` - Generar plan semanal
- `GET /api/nutrition/recipes` - Obtener recetas con información nutricional

### Administración
- `GET /api/admin/stats` - Estadísticas del sistema
- `POST /api/admin/create` - Crear recursos administrativos
- `POST /api/invitation-codes/validate` - Validar código de invitación
- `POST /api/invitation-codes/use` - Usar código de invitación

### Gestión de Usuarios (Admin)
- `GET /api/users` - Listar usuarios
- `GET /api/users/[id]` - Obtener usuario específico
- `PUT /api/users/[id]/role` - Cambiar rol de usuario
- `PUT /api/users/[id]/password` - Cambiar contraseña

---

## 🧪 Testing y Desarrollo

### Variables de Entorno Requeridas
```env
# Base de datos
DATABASE_URL="postgresql://user:password@localhost:5432/nutriplaner"

# Autenticación (opcional para desarrollo)
NEXTAUTH_SECRET="tu_secreto_seguro_aqui"
NEXTAUTH_URL="http://localhost:3000"

# Configuración de la app
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Scripts de Seeding Disponibles
```bash
# Seeding completo (recomendado para desarrollo)
pnpm db:setup              # Migraciones + datos completos

# Seeding específico
pnpm db:seed:foods         # Solo alimentos
pnpm db:seed:recipes       # Solo recetas
pnpm db:seed:more-recipes  # Recetas adicionales
pnpm db:users              # Solo usuarios de prueba
```

---

## 📝 Uso

1. **Registro y Login**: Crea una cuenta o inicia sesión con los usuarios de prueba.
2. **Configura tu Perfil**: Completa tu información personal y preferencias alimentarias.
3. **Genera Menús**: Crea menús diarios o semanales personalizados.
4. **Gestiona tus Compras**: Genera listas de compras basadas en tus menús.
5. **Guarda Favoritos**: Marca tus menús favoritos para usarlos en el futuro.

---

## 🚀 Deployment

### Preparación para Producción
1. **Variables de entorno:**
   ```bash
   # Configurar DATABASE_URL para PostgreSQL en producción
   # Generar NEXTAUTH_SECRET seguro
   # Configurar NEXT_PUBLIC_APP_URL con dominio real
   ```

2. **Build y optimización:**
   ```bash
   pnpm build    # Genera build optimizado
   pnpm start    # Servidor de producción
   ```

3. **Base de datos:**
   ```bash
   npx prisma migrate deploy  # Aplicar migraciones en producción
   ```

### Consideraciones de Producción
- Configurar conexión SSL para PostgreSQL
- Implementar rate limiting en endpoints de API
- Configurar logs y monitoreo
- Optimizar imágenes y assets estáticos
- Configurar CORS según necesidades

---

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor, sigue estos pasos:

1. **Fork del proyecto**
2. **Crea una rama feature:** `git checkout -b feature/nueva-funcionalidad`
3. **Sigue las convenciones:**
   - Código TypeScript estricto
   - Componentes funcionales con hooks
   - Servicios para lógica de negocio
   - Tests para funcionalidades críticas
4. **Commit descriptivo:** `git commit -m 'feat: agregar nueva funcionalidad'`
5. **Push y Pull Request:** `git push origin feature/nueva-funcionalidad`

### Estándares de Código
- **ESLint:** Seguir configuración de Next.js
- **TypeScript:** Modo estricto habilitado
- **Componentes:** Usar TypeScript interfaces
- **API:** Validación de entrada y manejo de errores
- **Base de datos:** Usar Prisma para todas las consultas

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo `LICENSE` para más detalles.

---

## 🔧 Troubleshooting

### Problemas Comunes

**Error de conexión a BD:**
```bash
# Verificar que PostgreSQL esté ejecutándose
# Revisar DATABASE_URL en .env
npx prisma db push  # Sincronizar schema
```

**Errores de TypeScript:**
```bash
# Regenerar tipos de Prisma
npx prisma generate
# Verificar configuración tsconfig.json
```

**Problemas con seeding:**
```bash
# Limpiar y recrear BD
npx prisma migrate reset
pnpm db:setup
```

---

## 📞 Soporte

Para reportar bugs o solicitar funcionalidades:
- **Issues:** Usar GitHub Issues con templates apropiados
- **Documentación:** Consultar código y comentarios inline
- **API:** Revisar tipos TypeScript para contratos de API