// Upload de imagens para o Supabase Storage (bucket público "uploads").
// SERVER-ONLY (usa a service_role). Retorna a URL pública ou null.

import { supabaseAdmin } from "@/lib/supabase/admin";

const BUCKET = "uploads";

export async function uploadImagem(file: File | null, prefixo: string): Promise<string | null> {
  if (!file || typeof file.arrayBuffer !== "function" || file.size === 0) return null;
  if (!file.type.startsWith("image/")) throw new Error("Envie um arquivo de imagem (PNG, JPG, WEBP…).");
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
