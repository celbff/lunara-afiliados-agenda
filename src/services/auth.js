// src/services/auth.js
import { createClient } from '@supabase/supabase-js';

// Inicialize o cliente Supabase
const supabaseUrl = 'https://wqzjxykmqnzcgdlbmuqj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indxemp4eWttcW56Y2dkbGJtdXFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0OTQxOTYsImV4cCI6MjA2OTA3MDE5Nn0.w61cXkhP89aUfrdhmE8QYkU9HOuDe6pG0i0Qq8Ok89c';
const supabase = createClient(supabaseUrl, supabaseKey);

// Função para login
export async function login(email, password) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;

    console.log('Login bem-sucedido!', data);
    return data;
  } catch (error) {
    console.error('Erro ao fazer login:', error.message);
    throw error;
  }
}

// Função para logout
export async function logout() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;

    console.log('Logout bem-sucedido!');
  } catch (error) {
    console.error('Erro ao fazer logout:', error.message);
  }
}
