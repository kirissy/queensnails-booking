const INSTAGRAM_ACCESS_TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN;

export const isInstagramConfigured = Boolean(INSTAGRAM_ACCESS_TOKEN);

export type InstagramPost = {
  id: string;
  mediaUrl: string;
  permalink: string;
  caption?: string;
};

/**
 * Recent posts via the Instagram Graph API. Requires a Meta Developer app
 * with the Instagram API product, an Instagram professional (Business/
 * Creator) account, and a long-lived access token — see README. Returns
 * null (not an empty array) on any failure so the caller can distinguish
 * "not configured / errored" from "genuinely no posts" and fall back to
 * placeholders either way.
 */
export async function getRecentInstagramPosts(limit = 6): Promise<InstagramPost[] | null> {
  if (!INSTAGRAM_ACCESS_TOKEN) return null;

  try {
    const url = new URL("https://graph.instagram.com/me/media");
    url.searchParams.set("fields", "id,caption,media_type,media_url,thumbnail_url,permalink");
    url.searchParams.set("limit", String(limit));
    url.searchParams.set("access_token", INSTAGRAM_ACCESS_TOKEN);

    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) {
      console.error("[instagram] API error", res.status, await res.text());
      return null;
    }

    type RawItem = {
      id: string;
      media_type: string;
      media_url: string;
      thumbnail_url?: string;
      permalink: string;
      caption?: string;
    };

    const body: { data?: RawItem[] } = await res.json();
    const data: RawItem[] = body.data ?? [];
    return data.slice(0, limit).map((item) => ({
      id: item.id,
      // Videos don't have a directly-embeddable media_url thumbnail; use the still frame instead.
      mediaUrl: item.media_type === "VIDEO" ? (item.thumbnail_url ?? item.media_url) : item.media_url,
      permalink: item.permalink,
      caption: item.caption,
    }));
  } catch (err) {
    console.error("[instagram] fetch failed", err);
    return null;
  }
}
