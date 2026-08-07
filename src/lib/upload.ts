// Upload de imagens para o Supabase Storage (bucket público "uploads").
// SERVER-ONLY (usa a service_role). Retorna a URL pública ou null.

import "server-only";
import { supabaseAdmin } from "@/lib/supabase/admin";

const BUCKET = "uploads";
// Só raster: SVG é bloqueado por poder conter <script> (XSS no domínio do storage).
const TIPOS_OK = ["image/png", "image/jpeg", "image/jpg", "image/webp", "image/gif"];

export async function uploadImagem(file: File | null, prefixo: string): Promise<string | null> {
  if (!file || typeof file.arrayBuffer !== "function" || file.size === 0) return null;
  if (!TIPOS_OK.includes(file.type)) throw new Error("Formato não suportado. Use PNG, JPG, WEBP ou GIF (SVG não é aceito).");
  if (file.size > 6 * 1024 * 1024) throw new Error("Imagem muito grande (máx. 6 MB).");

  const ext = (file.name.split(".").pop() || "png").toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 5) || "png";
  const rand = Math.random().toString(36).slice(2, 8);
  const caminho = `${prefixo}/${Date.now()}-${rand}.${ext}`;

  const buf = Buffer.from(await file.arrayBuffer());
  const sb = supabaseAdmin();
  const { error } = await sb.storage.from(BUCKET).upload(caminho, buf, {
    contentType: file.type,
    upsert: false,
  });
  if (error) throw new Error(`Falha no upload da imagem: ${error.message}`);
  return sb.storage.from(BUCKET).getPublicUrl(caminho).data.publicUrl;
}
