# Manual Operasional Supabase

## 1. Setup Awal

### 1.1 Membuat Project Baru
1. Buka [https://app.supabase.com](https://app.supabase.com)
2. Klik "New Project"
3. Isi:
   - Organization: Pilih atau buat organisasi baru
   - Name: Nama project
   - Database Password: Password untuk database
   - Region: Pilih region terdekat (misalnya Singapore)
4. Klik "Create New Project"

### 1.2 Konfigurasi di Next.js
1. Install package:
   ```bash
   npm install @supabase/supabase-js
   ```

2. Buat file `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://[PROJECT_ID].supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=[YOUR_ANON_KEY]
   ```

3. Setup client (`lib/supabase.js`):
   ```javascript
   import { createClient } from '@supabase/supabase-js'

   const supabase = createClient(
     process.env.NEXT_PUBLIC_SUPABASE_URL,
     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
   )

   export { supabase }
   ```

## 2. Authentication

### 2.1 Setup Auth
1. Buka project di Supabase Dashboard
2. Ke menu "Authentication" -> "Providers"
3. Enable provider yang diinginkan (Email, Google, dll)
4. Untuk Email auth:
   - Aktifkan "Enable Email Signup"
   - Atur "Confirm Email" sesuai kebutuhan

### 2.2 Penggunaan Auth di Next.js
```javascript
// Login
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'email@example.com',
  password: 'password123'
})

// Register
const { data, error } = await supabase.auth.signUp({
  email: 'email@example.com',
  password: 'password123'
})

// Logout
await supabase.auth.signOut()

// Cek user yang login
const { data: { user } } = await supabase.auth.getUser()
```

## 3. Database & Row Level Security (RLS)

### 3.1 Membuat Tabel
1. Buka "Database" -> "Table Editor"
2. Klik "New Table"
3. Isi:
   - Name: nama_tabel
   - Columns: definisikan kolom
   - Enable Row Level Security (RLS)
4. Klik "Save"

### 3.2 Contoh RLS Policy
```sql
-- Enable RLS
ALTER TABLE nama_tabel ENABLE ROW LEVEL SECURITY;

-- Policy untuk read
CREATE POLICY "Users can view own data" ON nama_tabel
FOR SELECT
USING (auth.uid() = user_id);

-- Policy untuk insert
CREATE POLICY "Users can insert own data" ON nama_tabel
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Policy untuk update
CREATE POLICY "Users can update own data" ON nama_tabel
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Policy untuk delete
CREATE POLICY "Users can delete own data" ON nama_tabel
FOR DELETE
USING (auth.uid() = user_id);
```

### 3.3 Operasi Database di Next.js
```javascript
// Select data
const { data, error } = await supabase
  .from('nama_tabel')
  .select('*')
  .eq('column', 'value')

// Insert data
const { data, error } = await supabase
  .from('nama_tabel')
  .insert([
    { column1: 'value1', column2: 'value2' }
  ])

// Update data
const { data, error } = await supabase
  .from('nama_tabel')
  .update({ column1: 'new_value' })
  .eq('id', 123)

// Delete data
const { data, error } = await supabase
  .from('nama_tabel')
  .delete()
  .eq('id', 123)
```

## 4. Storage

### 4.1 Setup Storage
1. Buka menu "Storage" -> "Create new bucket"
2. Isi:
   - Name: nama_bucket
   - Public/Private: sesuai kebutuhan
3. Klik "Create bucket"

### 4.2 Penggunaan Storage di Next.js
```javascript
// Upload file
const { data, error } = await supabase.storage
  .from('nama_bucket')
  .upload('path/file.jpg', file)

// Download file
const { data, error } = await supabase.storage
  .from('nama_bucket')
  .download('path/file.jpg')

// Delete file
const { data, error } = await supabase.storage
  .from('nama_bucket')
  .remove(['path/file.jpg'])

// Get public URL
const { data } = supabase.storage
  .from('nama_bucket')
  .getPublicUrl('path/file.jpg')
```

## 5. Realtime

### 5.1 Enable Realtime
1. Buka tabel yang ingin di-enable realtime
2. Klik "Enable Realtime"

### 5.2 Penggunaan Realtime di Next.js
```javascript
// Subscribe ke perubahan
const subscription = supabase
  .from('nama_tabel')
  .on('*', (payload) => {
    console.log('Change received!', payload)
  })
  .subscribe()

// Unsubscribe
subscription.unsubscribe()
```

## 6. Tips & Troubleshooting

### 6.1 Debugging
1. Cek Network tab di browser untuk melihat request/response
2. Gunakan `console.log(error)` untuk debug error
3. Cek logs di Supabase Dashboard

### 6.2 Best Practices
1. Selalu gunakan RLS untuk keamanan
2. Gunakan prepared statements untuk query
3. Batasi jumlah row yang di-fetch
4. Gunakan indexes untuk kolom yang sering di-query
5. Backup database secara berkala

### 6.3 Common Issues
1. RLS Policy:
   - Pastikan policy sudah enabled
   - Cek syntax policy
   - Verifikasi user sudah login

2. Auth:
   - Cek konfigurasi provider
   - Pastikan URL redirect sudah benar
   - Verifikasi credentials

3. Performance:
   - Gunakan `.select()` spesifik kolom
   - Tambahkan index
   - Batasi jumlah rows dengan `.limit()`
