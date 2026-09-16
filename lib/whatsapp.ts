import { WHATSAPP_NUMBER } from '@/lib/siteConfig';

export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

export function escapeWhatsAppText(value: string): string {
  return value.replace(/[\\*_~`]/g, '\\$&');
}

export async function copyTextToClipboard(message: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(message);
      return true;
    }
  } catch {
    // The UI exposes the message when clipboard permission is unavailable.
  }

  return false;
}

export async function openWhatsAppWithCopiedMessage(message: string): Promise<{
  opened: boolean;
  copied: boolean;
}> {
  let popup: Window | null = null;
  try {
    const url = `${WHATSAPP_URL}?text=${encodeURIComponent(message)}`;
    popup = window.open(url, '_blank', 'noopener,noreferrer');
  } catch {
    popup = null;
  }

  if (popup) {
    try {
      popup.opener = null;
    } catch {
      // The noopener feature already protects the opener in supported browsers.
    }
  }

  const copied = await copyTextToClipboard(message);

  return { opened: Boolean(popup), copied };
}
