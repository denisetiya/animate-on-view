# Animate On View

Library animasi berperforma tinggi tanpa dependensi untuk React/Next.js dan Svelte dengan dukungan TypeScript. Buat animasi scroll yang halus dengan setup minimal.

[![npm version](https://badge.fury.io/js/animate-on-view.svg)](https://badge.fury.io/js/animate-on-view)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/animate-on-view)](https://bundlephobia.com/package/animate-on-view)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)

## Fitur

- 🚀 **Tanpa Dependensi** - Tidak memerlukan library eksternal
- ⚡ **Performa Tinggi** - Menggunakan Intersection Observer API untuk performa optimal
- 🎨 **40+ Animasi Bawaan** - Koleksi lengkap preset animasi
- 🔧 **Sepenuhnya Dapat Dikustomisasi** - Buat varian animasi sendiri
- 📱 **Responsif** - Bekerja sempurna di semua perangkat
- 🎯 **Dukungan TypeScript** - Type safety lengkap dan IntelliSense
- 🔄 **Framework Agnostic** - Mendukung React dan Svelte
- 📦 **Tree Shakeable** - Import hanya yang diperlukan
- 🎭 **Kompatibel SSR** - Bekerja dengan Next.js dan SvelteKit

## Instalasi

```bash
npm install animate-on-view
# atau
yarn add animate-on-view
# atau
pnpm add animate-on-view
```

## Mulai Cepat

### React/Next.js

```tsx
import { AnimateOnView } from 'animate-on-view/react';

function App() {
  return (
    <div>
      <AnimateOnView type="fadeIn">
        <h1>Halo Dunia!</h1>
      </AnimateOnView>
      
      <AnimateOnView type="slideUp" duration={800} delay={200}>
        <p>Teks ini slide up dengan timing kustom</p>
      </AnimateOnView>
    </div>
  );
}
```

### Svelte/SvelteKit

```svelte
<script>
  import { AnimateOnView } from 'animate-on-view/svelte';
</script>

<AnimateOnView type="fadeIn">
  <h1>Halo Dunia!</h1>
</AnimateOnView>

<AnimateOnView type="slideUp" duration={800} delay={200}>
  <p>Teks ini slide up dengan timing kustom</p>
</AnimateOnView>
```

## Jenis Animasi

### Animasi Fade Dasar
- `fadeIn` - Fade in sederhana
- `fadeInUp` - Fade in dari bawah
- `fadeInDown` - Fade in dari atas
- `fadeInLeft` - Fade in dari kiri
- `fadeInRight` - Fade in dari kanan

### Animasi Slide
- `slideUp` - Slide naik dari bawah
- `slideDown` - Slide turun dari atas
- `slideLeft` - Slide dari kanan ke kiri
- `slideRight` - Slide dari kiri ke kanan

### Animasi Scale
- `scaleIn` - Scale dari kecil ke normal
- `scaleOut` - Scale dari besar ke normal
- `scaleX` - Scale horizontal
- `scaleY` - Scale vertikal

### Animasi Rotasi
- `rotateIn` - Rotasi dan scale masuk
- `rotateInLeft` - Rotasi dari kiri
- `rotateInRight` - Rotasi dari kanan

### Animasi Flip
- `flipX` - Flip horizontal
- `flipY` - Flip vertikal

### Animasi Zoom
- `zoomIn` - Efek zoom masuk
- `zoomInUp` - Zoom masuk dari bawah
- `zoomInDown` - Zoom masuk dari atas
- `zoomInLeft` - Zoom masuk dari kiri
- `zoomInRight` - Zoom masuk dari kanan

### Animasi Bounce
- `bounceIn` - Efek bounce scale
- `bounceInUp` - Bounce dari bawah
- `bounceInDown` - Bounce dari atas
- `bounceInLeft` - Bounce dari kiri
- `bounceInRight` - Bounce dari kanan

### Animasi Elastic
- `elasticIn` - Efek elastic scale
- `elasticInUp` - Elastic dari bawah
- `elasticInDown` - Elastic dari atas

### Efek Khusus
- `blurIn` - Blur ke jernih
- `blurInUp` - Blur dan slide naik
- `skewIn` - Efek skew
- `skewInUp` - Skew dan slide naik
- `rollIn` - Efek roll masuk
- `lightSpeedIn` - Efek kecepatan cahaya
- `jackInTheBox` - Efek jack in the box

### Animasi Halus
- `gentle` - Fade dan gerak halus
- `soft` - Efek scale lembut
- `smooth` - Efek slide halus

### Animasi Dramatis
- `dramatic` - Rotasi dan scale dramatis
- `explosive` - Scale dan rotasi eksplosif

## Referensi API

### Props

| Prop | Tipe | Default | Deskripsi |
|------|------|---------|-----------|
| `type` | `AnimationType` | `'fadeIn'` | Jenis animasi yang digunakan |
| `variant` | `AnimationVariant` | - | Varian animasi kustom |
| `threshold` | `number` | `0.1` | Threshold intersection (0-1) |
| `rootMargin` | `string` | `'0px'` | Root margin untuk intersection |
| `triggerOnce` | `boolean` | `true` | Trigger animasi hanya sekali |
| `duration` | `number` | `600` | Durasi animasi dalam ms |
| `delay` | `number` | `0` | Delay animasi dalam ms |
| `easing` | `string` | `'ease-out'` | Fungsi easing CSS |
| `className` | `string` | - | Nama class CSS |
| `style` | `object/string` | - | Style inline |
| `onInView` | `function` | - | Callback saat elemen masuk view |
| `onOutView` | `function` | - | Callback saat elemen keluar view |

### Varian Animasi Kustom

Buat varian animasi sendiri:

```tsx
// React
const varianKustom = {
  initial: { 
    opacity: 0, 
    transform: 'translateY(100px) rotate(45deg)' 
  },
  animate: { 
    opacity: 1, 
    transform: 'translateY(0px) rotate(0deg)' 
  },
  transition: { 
    duration: 1000, 
    easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)' 
  }
};

<AnimateOnView variant={varianKustom}>
  <div>Animasi kustom!</div>
</AnimateOnView>
```

```svelte
<!-- Svelte -->
<script>
  const varianKustom = {
    initial: { 
      opacity: 0, 
      transform: 'translateY(100px) rotate(45deg)' 
    },
    animate: { 
      opacity: 1, 
      transform: 'translateY(0px) rotate(0deg)' 
    },
    transition: { 
      duration: 1000, 
      easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)' 
    }
  };
</script>

<AnimateOnView variant={varianKustom}>
  <div>Animasi kustom!</div>
</AnimateOnView>
```

## Penggunaan Lanjutan

### Varian Elemen React

Gunakan elemen animasi yang sudah dibuat dengan objek `animate`:

```tsx
import { animate } from 'animate-on-view/react';

function App() {
  return (
    <div>
      {/* Penggunaan dasar */}
      <animate.div type="fadeIn">
        <h1>Halo Dunia!</h1>
      </animate.div>
      
      <animate.p type="slideUp" delay={200}>
        Ini slide naik dengan delay 200ms
      </animate.p>
      
      <animate.img 
        type="scaleIn" 
        src="gambar.jpg" 
        alt="Gambar animasi"
      />
      
      {/* Penggunaan lanjutan dengan semua props */}
      <animate.h1 
        type="fadeInUp" 
        duration={800}
        delay={100}
        threshold={0.3}
      >
        Heading Animasi
      </animate.h1>
      
      <animate.section 
        type="slideLeft" 
        className="section-saya"
        style={{ padding: '20px' }}
      >
        <p>Konten Section Animasi</p>
      </animate.section>
      
      {/* Styling kustom */}
      <animate.button
        type="bounceIn"
        delay={500}
        onClick={() => alert('Diklik!')}
        className="btn btn-primary"
      >
        Tombol Animasi
      </animate.button>
    </div>
  );
}
```

**Elemen animasi yang tersedia:**
- **Elemen Teks**: `h1`, `h2`, `h3`, `h4`, `h5`, `h6`, `p`, `span`
- **Elemen Layout**: `div`, `section`, `article`, `aside`, `header`, `footer`, `main`, `nav`
- **Elemen List**: `ul`, `ol`, `li`
- **Elemen Media**: `img`
- **Elemen Interaktif**: Semua elemen mendukung atribut HTML standar dan event handler

**Keuntungan Utama:**
- Semua atribut HTML standar didukung
- Event handler bekerja normal (`onClick`, `onMouseOver`, dll.)
- CSS class dan inline style dapat diterapkan
- Dukungan TypeScript dengan props spesifik elemen yang tepat
- Mempertahankan struktur HTML semantik

### Varian Komponen Svelte

Gunakan komponen animasi yang sudah dibuat dengan semua jenis animasi yang sama seperti React:

```svelte
<script>
  import { AnimateH1, AnimateP, AnimateDiv } from 'animate-on-view/svelte';
</script>

{/* Semua 40+ jenis animasi tersedia */}
<AnimateH1 type="fadeInUp">Heading Animasi</AnimateH1>
<AnimateP type="slideLeft" delay={200}>Paragraf Animasi</AnimateP>
<AnimateDiv type="scaleIn" duration={1000}>Div Animasi</AnimateDiv>

{/* Animasi lanjutan */}
<AnimateH1 type="bounceInDown" duration={800}>Judul Bouncy</AnimateH1>
<AnimateP type="blurInUp" delay={300}>Teks Efek Blur</AnimateP>
<AnimateDiv type="jackInTheBox" delay={500}>Kotak Kejutan</AnimateDiv>

{/* Efek dramatis */}
<AnimateH1 type="dramatic">Masuk Dramatis</AnimateH1>
<AnimateP type="lightSpeedIn">Secepat Kilat</AnimateP>
```

**Komponen Tersedia:**
- `AnimateH1`, `AnimateH2` - Heading animasi
- `AnimateP` - Paragraf animasi  
- `AnimateDiv` - Container animasi
- `AnimateOnView` - Komponen dasar untuk elemen kustom

**Semua Jenis Animasi Didukung:**
Svelte sekarang mendukung semua 40+ jenis animasi yang tersedia di React, termasuk fadeIn, slideUp, bounceIn, dramatic, explosive, dan banyak lagi!

### Opsi Intersection Observer

Atur kapan animasi dipicu:

```tsx
<AnimateOnView
  type="fadeIn"
  threshold={0.5}        // Trigger saat 50% terlihat
  rootMargin="100px"     // Trigger 100px sebelum masuk viewport
  triggerOnce={false}    // Trigger ulang saat scroll kembali
>
  <div>Konten</div>
</AnimateOnView>
```

### Callbacks

Tangani event animasi:

```tsx
<AnimateOnView
  type="slideUp"
  onInView={() => console.log('Elemen masuk view!')}
  onOutView={() => console.log('Elemen keluar view!')}
>
  <div>Konten dengan callback</div>
</AnimateOnView>
```

## Tips Performa

1. **Gunakan `triggerOnce={true}`** (default) untuk performa lebih baik
2. **Sesuaikan `threshold`** sesuai kebutuhan (nilai rendah trigger lebih awal)
3. **Gunakan `rootMargin`** untuk pre-load animasi sebelum terlihat
4. **Lebih suka CSS transforms** daripada mengubah properti layout di varian kustom
5. **Import hanya yang diperlukan** untuk menjaga ukuran bundle tetap kecil

## Dukungan Browser

- Chrome 58+
- Firefox 55+
- Safari 12.1+
- Edge 16+

Menggunakan Intersection Observer API dengan fallback otomatis untuk browser lama.

## Dukungan TypeScript

Dukungan TypeScript lengkap dengan definisi tipe komprehensif:

```tsx
import type { AnimateProps, AnimationVariant } from 'animate-on-view/react';

const KomponenSaya: React.FC<AnimateProps> = (props) => {
  // Logika komponen Anda
};
```

## Contoh

### Animasi Bertahap

```tsx
const items = ['Item 1', 'Item 2', 'Item 3'];

return (
  <div>
    {items.map((item, index) => (
      <AnimateOnView
        key={item}
        type="slideUp"
        delay={index * 100}
      >
        <div>{item}</div>
      </AnimateOnView>
    ))}
  </div>
);
```

### Sekuens Animasi Kompleks

```tsx
<div>
  <AnimateOnView type="fadeInDown" duration={600}>
    <h1>Selamat Datang</h1>
  </AnimateOnView>
  
  <AnimateOnView type="slideUp" delay={300} duration={800}>
    <p>Ini adalah subtitle yang muncul setelah judul</p>
  </AnimateOnView>
  
  <AnimateOnView type="scaleIn" delay={600} duration={1000}>
    <button>Mulai</button>
  </AnimateOnView>
</div>
```

## Kontribusi

Kontribusi sangat diterima! Silakan kirim Pull Request.

## Lisensi

MIT © 2025 denisetiya

## Changelog

### v1.0.0
- Rilis awal
- Dukungan untuk React dan Svelte
- 40+ jenis animasi bawaan
- Dukungan TypeScript
- Tanpa dependensi