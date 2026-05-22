[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/3nE7zRUN)
# Challenge 9 - Movie Explorer App

Selamat datang di Challenge 9! Di assignment ini, kalian akan membangun sebuah aplikasi web Movie Explorer menggunakan React, TypeScript, dan berbagai modern tools yang sering digunakan di industri.

## Deskripsi Project

Kalian akan membuat aplikasi web yang menampilkan informasi film dari **The Movie Database (TMDB)** API. Aplikasi ini harus mengikuti design yang sudah disediakan di Figma dan menggunakan tech stack yang telah ditentukan.

## Design Reference

Ikuti design dari Figma berikut:
[Movie Explorer App - Figma Design](https://www.figma.com/design/PjR3Adxi8eZbS2cmdPuG52/Front-End-Developer-Test---Movie-Explorer-App?node-id=8411-143671&t=y7BzTJGevPesnrNE-1)

## Tech Stack yang Wajib Digunakan

- **React 19** - UI Library
- **TypeScript** - Type Safety
- **Vite** - Build Tool
- **TanStack React Query** - Data Fetching & Caching
- **Zustand** - State Management
- **React Router** - Routing
- **Radix UI & shadcn/ui** - UI Components
- **Zod & React Hook Form** - Form Validation
- **Framer Motion** - Animations
- **Tailwind CSS** - Styling

## Setup Awal

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Environment Variables

Copy file `.env.example` menjadi `.env`:

```bash
cp .env.example .env
```

### 3. Dapatkan TMDB API Key

1. Buat akun di [TheMovieDB](https://www.themoviedb.org/signup)
2. Login dan pergi ke [Settings → API](https://www.themoviedb.org/settings/api)
3. Request API key (pilih developer/educational purpose)
4. Copy API key dan paste ke file `.env`:

```env
VITE_TMDB_API_KEY=your_api_key_here
```

### 4. Jalankan Development Server

```bash
npm run dev
```

## Fitur yang Harus Diimplementasikan

Berdasarkan design Figma, minimal implementasikan fitur-fitur berikut:

### Core Features

1. **Home Page**
   - Display popular movies
   - Display now playing movies
   - Search functionality
   - Filter/sorting options

2. **Movie Detail Page**
   - Movie information (title, poster, overview, rating, release date, etc.)
   - Cast & crew information
   - Similar movies recommendations
   - Trailers/videos

3. **State Management**
   - Favorites/Watchlist menggunakan Zustand
   - Persist favorites ke localStorage

4. **Data Fetching**
   - Gunakan React Query untuk semua API calls
   - Implementasikan loading states
   - Implementasikan error handling

5. **Form & Validation**
   - Search form dengan validation menggunakan Zod + React Hook Form
   - (Optional) Newsletter subscription form

6. **Animations**
   - Page transitions
   - Component animations (fade in, slide, etc.)
   - Hover effects
   - Loading animations

## Resources & Documentation

### API Documentation

- [TMDB API Documentation](https://developer.themoviedb.org/docs)
- [TMDB API Reference](https://developer.themoviedb.org/reference/intro/getting-started)

### Library Documentation

- [React Query](https://tanstack.com/query/latest/docs/framework/react/overview)
- [Zustand](https://zustand.docs.pmnd.rs/)
- [React Router](https://reactrouter.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Radix UI](https://www.radix-ui.com/)
- [React Hook Form](https://react-hook-form.com/)
- [Zod](https://zod.dev/)
- [Framer Motion](https://www.framer.com/motion/)

## Struktur Project

```
src/
├── components/       # Reusable components
│   └── ui/          # shadcn/ui components
├── pages/           # Page components
├── hooks/           # Custom React hooks
├── services/        # API service functions
├── store/           # Zustand stores
├── types/           # TypeScript interfaces/types
├── lib/             # Utility libraries (axios, utils)
└── utils/           # Helper functions
```

## Tips Pengerjaan

1. **Mulai dari API Integration**
   - Setup axios instance di `lib/axios.ts`
   - Buat service functions di `services/movieService.ts`
   - Test API calls dengan React Query

2. **Setup UI Components**
   - Install shadcn/ui components yang dibutuhkan:
     ```bash
     npx shadcn@latest add button
     npx shadcn@latest add card
     npx shadcn@latest add input
     # dst...
     ```

3. **Implementasi Routing**
   - Setup React Router untuk navigasi antar halaman
   - Buat route untuk Home dan Detail page

4. **State Management**
   - Gunakan Zustand untuk favorites/watchlist
   - Implementasi persist middleware untuk localStorage

5. **Styling & Animations**
   - Gunakan Tailwind untuk styling
   - Tambahkan Framer Motion untuk smooth animations

## Parameter Penilaian

Assignment ini akan dinilai berdasarkan 5 kriteria utama:

### 1. Code Quality & Architecture (25%)

- **Clean Code**: Kode mudah dibaca, terstruktur dengan baik, dan mengikuti best practices
- **Proper TypeScript Usage**: Type safety yang baik, interface/type definitions yang clear
- **Component Organization**: Komponen modular, reusable, dan well-organized
- **Folder Structure**: Struktur folder yang rapi dan logical

### 2. Tech Stack Implementation (25%)

- **React Query**: Proper usage untuk data fetching, caching, dan state management
- **Zustand**: Correct implementation untuk global state (favorites/watchlist)
- **React Hook Form + Zod**: Proper form handling dan validation
- **Radix UI/shadcn**: Penggunaan UI components dengan proper accessibility
- **Framer Motion**: Smooth dan meaningful animations

### 3. Functionality & Features (20%)

- **Core Features**: Semua fitur utama berfungsi dengan baik (list movies, detail, search, favorites)
- **Error Handling**: Proper error states dan user feedback
- **Loading States**: Loading indicators yang informatif
- **Data Flow**: Data fetching dan state management yang efisien

### 4. UI/UX Implementation (20%)

- **Design Accuracy**: Mengikuti design Figma dengan reasonable accuracy
- **Responsive Design**: Aplikasi responsive di berbagai ukuran layar
- **User Experience**: Navigasi intuitif, feedback yang jelas ke user
- **Visual Polish**: Attention to detail dalam styling dan animations

### 5. Best Practices & Performance (10%)

- **Performance**: Aplikasi load dengan cepat, tidak ada unnecessary re-renders
- **Code Organization**: Proper separation of concerns
- **Git Usage**: Commit messages yang descriptive dan organized
- **Documentation**: Code comments di bagian-bagian yang kompleks

## Submission Guidelines

1. Ensure aplikasi berjalan tanpa error
2. Test semua fitur yang diimplementasikan
3. Clean up console.logs dan debugging code
4. Update README jika ada setup tambahan yang diperlukan
5. Push code ke repository GitHub
6. Deploy ke platform pilihan (Vercel/Netlify) - **BONUS POINT**

## Bantuan & Pertanyaan

Jika ada pertanyaan atau butuh klarifikasi:

1. Baca dokumentasi library yang digunakan
2. Check TMDB API documentation
3. Tanya mentor di slack

## Catatan Penting

- **DILARANG** copy-paste code dari internet tanpa memahami
- **DILARANG** menggunakan AI untuk menulis seluruh code (boleh untuk reference/learning)
- **WAJIB** memahami setiap line code yang kalian tulis
- **WAJIB** menggunakan semua tech stack yang sudah ditentukan

Good luck dan have fun coding! 🚀

---

**Remember**: Yang terpenting bukan hanya aplikasi yang jadi, tapi proses learning dan pemahaman kalian terhadap tech stack yang digunakan!

## Mentor Henry Rivardo

Halo semuanya!

Saya Henry Rivardo, dan saya sangat excited melihat kalian mengerjakan Challenge 9 ini. Assignment ini memang challenging, tapi saya percaya kalian semua mampu menyelesaikannya dengan baik.

Beberapa hal yang ingin saya sampaikan:

**Jangan takut untuk mencoba dan gagal.** Setiap error yang kalian temui adalah kesempatan untuk belajar. Debugging adalah skill penting yang akan kalian gunakan sepanjang karir sebagai developer. Embrace the process!

**Manfaatkan resources yang ada.** Dokumentasi, tutorial, dan tentunya mentor kalian selalu siap membantu. Jangan ragu untuk bertanya jika ada yang tidak clear. No question is too small or silly - we're all here to learn together.

**Fokus pada pemahaman, bukan sekadar menyelesaikan.** Tech stack yang kalian pelajari di sini (React Query, Zustand, TypeScript) adalah tools yang sangat powerful dan banyak digunakan di industri. Investasi waktu kalian untuk memahami konsep-konsep ini akan sangat bermanfaat untuk karir kalian kedepannya.

**Enjoy the journey!** Coding itu fun. Jika kalian stuck atau frustasi, take a break, walk around, dan come back dengan fresh mind. Sometimes the best solutions come when we're not actively thinking about the problem.

Saya bangga dengan dedikasi dan effort yang kalian semua tunjukkan. Keep pushing, keep learning, dan yang terpenting - have fun building this awesome movie app!

If you need anything, I'm just a message away. Let's make this the best learning experience possible!

Semangat dan success untuk kalian semua!

**- Henry Rivardo**
