
/** BazarDor API integration */

const BASE_PRIMARY = "https://api.api-store.workers.dev/api/bazardor";
const BASE_ALTERNATE = "https://api.abcz.workers.dev/api/bazardor";

export type PriceChange = {
  dir: "up" | "down" | "same";
  pct: number;
};

export type MarketPrice = {
  market: string;
  division: string;
  min: number;
  max: number;
};

export type Category = {
  id?: string | number;
  slug: string;
  name: string;
  nameBn?: string;
  title?: string;
  description?: string;
  icon?: string;
  [key: string]: unknown;
};

export type Product = {
  id: string | number;
  slug: string;
  name: string;
  nameBn: string;
  title?: string;
  description?: string;

  category: string;
  categoryNameBn?: string;
  categoryIcon?: string;

  unit: string;
  image?: string;

  today: number;
  yesterday: number;
  lastWeek: number;
  lastMonth: number;

  // Compatibility with existing UI components
  price: number;
  minPrice?: number;
  maxPrice?: number;
  averagePrice?: number;
  pct: PriceChange;
  change?: PriceChange;

  markets: MarketPrice[];

  [key: string]: unknown;
};

type RecordData = Record<string, unknown>;

function asRecord(value: unknown): RecordData | null {
  if (
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value)
  ) {
    return value as RecordData;
  }

  return null;
}

function stringValue(...values: unknown[]): string {
  const found = values.find(
    (value) => typeof value === "string" || typeof value === "number"
  );

  return found == null ? "" : String(found);
}

function numberValue(value: unknown, fallback = 0): number {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);

    if (Number.isFinite(parsed)) return parsed;
  }

  return fallback;
}

function unwrapList(value: unknown): unknown[] {
  if (Array.isArray(value)) return value;

  const obj = asRecord(value);
  if (!obj) return [];

  for (const key of [
    "data",
    "results",
    "products",
    "categories",
    "items",
    "records",
  ]) {
    const nested = obj[key];

    if (Array.isArray(nested)) return nested;

    const nestedObj = asRecord(nested);

    if (nestedObj) {
      for (const innerKey of [
        "data",
        "results",
        "items",
        "products",
        "categories",
      ]) {
        if (Array.isArray(nestedObj[innerKey])) {
          return nestedObj[innerKey] as unknown[];
        }
      }
    }
  }

  return [];
}

function unwrapOne(value: unknown): unknown {
  let current = value;

  // Support common API response wrappers.
  for (let i = 0; i < 3; i++) {
    const obj = asRecord(current);
    if (!obj) break;

    const nested =
      obj.product ??
      obj.category ??
      obj.data;

    if (nested == null || nested === current) break;

    current = nested;
  }

  return current;
}

export function normalizeCategory(
  raw: unknown,
  index = 0
): Category {
  const x = asRecord(raw) ?? {};

  const name = stringValue(
    x.nameBn,
    x.name_bn,
    x.name,
    x.categoryNameBn,
    x.categoryName,
    x.title,
    x.label
  ) || `ক্যাটাগরি ${index + 1}`;

  const slug =
    stringValue(x.slug, x.categorySlug, x.id, x._id) ||
    name.toLowerCase().replace(/\s+/g, "-");

  return {
    ...x,
    slug,
    name,
    nameBn: stringValue(x.nameBn, x.name_bn, x.name) || name,
    title: stringValue(x.title, name),
    icon: stringValue(x.icon, x.categoryIcon),
    description: stringValue(x.description, x.details),
  } as Category;
}

export function normalizeProduct(
  raw: unknown,
  index = 0
): Product {
  const x = asRecord(raw) ?? {};

  const nameBn = stringValue(
    x.nameBn,
    x.name_bn,
    x.name,
    x.title,
    x.productName,
    x.product_name
  ) || `পণ্য ${index + 1}`;

  const id =
    stringValue(x.id, x._id, x.productId, x.product_id, x.slug) ||
    String(index + 1);

const changeObj = asRecord(x.change);

const today = numberValue(
  x.today ?? x.currentPrice ?? x.current_price ?? x.price
);

const yesterday = numberValue(x.yesterday);

const rawDirection = stringValue(changeObj?.dir).toLowerCase();

const direction =
  rawDirection === "up" || rawDirection === "down"
    ? rawDirection
    : today > yesterday
      ? "up"
      : today < yesterday
        ? "down"
        : "same";

const rawPct = changeObj?.pct;

const pct =
  rawPct !== undefined && rawPct !== null && rawPct !== ""
    ? numberValue(rawPct)
    : yesterday > 0
      ? Number(
          (Math.abs((today - yesterday) / yesterday) * 100).toFixed(1)
        )
      : 0;

const rawChange: PriceChange = {
  dir: direction,
  pct,
};

  const markets: MarketPrice[] = Array.isArray(x.markets)
    ? x.markets.map((market) => {
        const m = asRecord(market) ?? {};

        return {
          market: stringValue(m.market),
          division: stringValue(m.division),
          min: numberValue(m.min),
          max: numberValue(m.max),
        };
      })
    : [];


  const lastWeek = numberValue(x.lastWeek ?? x.last_week);
  const lastMonth = numberValue(x.lastMonth ?? x.last_month);

  const minPrice =
    markets.length > 0
      ? Math.min(...markets.map((market) => market.min))
      : undefined;

  const maxPrice =
    markets.length > 0
      ? Math.max(...markets.map((market) => market.max))
      : undefined;

  return {
    ...x,

    id,
    slug: stringValue(x.slug, id),
    name: nameBn,
    nameBn,
    title: stringValue(x.title, nameBn),
    description: stringValue(x.description, x.details, x.summary),

    category: stringValue(x.category),
    categoryNameBn: stringValue(
      x.categoryNameBn,
      x.category_name_bn
    ),
    categoryIcon: stringValue(x.categoryIcon, x.category_icon),

    unit: stringValue(x.unit, x.unitName, x.unitBn) || "kg",
    image: stringValue(x.image, x.imageUrl, x.image_url),
    
    today,
    yesterday,
    lastWeek,
    lastMonth,

    // Existing components can continue using product.price.
    price: today,
    minPrice,
    maxPrice,
    averagePrice: today,

    pct: rawChange,
    change: rawChange,
    markets,
  };
}

async function getJson(url: string): Promise<unknown> {
  const response = await fetch(url, {
    next: { revalidate: 300 },
  });

  if (!response.ok) {
    throw new Error(
      `BazarDor API returned ${response.status}: ${url}`
    );
  }

  return response.json() as Promise<unknown>;
}

async function getWithFallback(
  primaryUrl: string,
  fallbackUrl: string
): Promise<unknown> {
  try {
    return await getJson(primaryUrl);
  } catch (primaryError) {
    try {
      return await getJson(fallbackUrl);
    } catch {
      throw primaryError;
    }
  }
}

/** GET /categories */
export async function getCategories(): Promise<Category[]> {
  const data = await getWithFallback(
    `${BASE_PRIMARY}/categories`,
    `${BASE_ALTERNATE}/categories`
  );

  return unwrapList(data).map(normalizeCategory);
}

/** GET /categories/:slug */
export async function getCategory(
  slug: string
): Promise<Category | null> {
  try {
    const data = await getWithFallback(
      `${BASE_PRIMARY}/categories/${encodeURIComponent(slug)}`,
      `${BASE_ALTERNATE}/categories/${encodeURIComponent(slug)}`
    );

    const raw = unwrapOne(data);
    const obj = asRecord(raw);

    if (!obj) return null;

    return normalizeCategory(raw);
  } catch {
    return null;
  }
}

/** GET /products */
export async function getProducts(): Promise<Product[]> {
  const data = await getWithFallback(
    `${BASE_PRIMARY}/products`,
    `${BASE_ALTERNATE}/products`
  );

  return unwrapList(data).map(normalizeProduct);
}

/** GET /products?category=:slug */
export async function getProductsByCategory(
  slug: string
): Promise<Product[]> {
  const query = `?category=${encodeURIComponent(slug)}`;

  const data = await getWithFallback(
    `${BASE_PRIMARY}/products${query}`,
    `${BASE_ALTERNATE}/products${query}`
  );

  return unwrapList(data).map(normalizeProduct);
}

/** GET /products/:id */
export async function getProduct(
  id: string
): Promise<Product | null> {
  try {
    const data = await getWithFallback(
      `${BASE_PRIMARY}/products/${encodeURIComponent(id)}`,
      `${BASE_ALTERNATE}/products/${encodeURIComponent(id)}`
    );

    const raw = unwrapOne(data);
    const obj = asRecord(raw);

    if (!obj) return null;

    return normalizeProduct(raw);
  } catch {
    return null;
  }
}

export function numericPrice(product: Product): number {
  return numberValue(
    product.today ?? product.price ?? product.averagePrice
  );
}

export function bnNumber(value: number | string): string {
  return String(value).replace(
    /\d/g,
    (digit) => "০১২৩৪৫৬৭৮৯"[Number(digit)]
  );
}

export function money(
  value: number | string | undefined
): string {
  if (value === undefined || value === "") {
    return "দাম পাওয়া যায়নি";
  }

  const n = Number(String(value).replace(/[^\d.-]/g, ""));

  return Number.isFinite(n)
    ? `${bnNumber(n.toLocaleString("en-US"))} টাকা`
    : `${value} টাকা`;
}

export function productEmoji(product: Product): string {
  if (product.image && !/^https?:\/\//i.test(product.image)) {
    return product.image;
  }

  if (product.categoryIcon) return product.categoryIcon;

  const text =
    `${product.nameBn} ${product.category}`.toLowerCase();

  if (/চাল|rice/.test(text)) return "🍚";
  if (/ডাল|lentil/.test(text)) return "🫘";
  if (/আলু|potato/.test(text)) return "🥔";
  if (/পেঁয়াজ|পেঁয়াজ|onion/.test(text)) return "🧅";
  if (/মাছ|fish/.test(text)) return "🐟";
  if (/মাংস|মুরগি|chicken|meat/.test(text)) return "🍗";
  if (/ডিম|egg/.test(text)) return "🥚";
  if (/তেল|oil/.test(text)) return "🛢️";
  if (/সবজি|শাক|vegetable/.test(text)) return "🥬";
  if (/মরিচ|মসলা|chili|spice/.test(text)) return "🌶️";

  return "🛒";
}
