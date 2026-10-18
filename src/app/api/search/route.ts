import { NextResponse } from 'next/server';
import { getAllCalculators } from '@/calculators/registry';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';

    if (!query.trim()) {
      return NextResponse.json({ success: true, results: [] });
    }

    const searchQuery = query.toLowerCase().trim();
    const allCalculators = getAllCalculators();

    const results = allCalculators
      .filter((calc) => {
        // Simple search query match on slugs and categories
        return (
          calc.slug.includes(searchQuery) ||
          calc.categorySlug.includes(searchQuery)
        );
      })
      .map((calc) => ({
        slug: calc.slug,
        categorySlug: calc.categorySlug,
        translationNamespace: calc.translationNamespace,
      }));

    return NextResponse.json({ success: true, results });
  } catch (err) {
    console.error('Search API Error:', err);
    return NextResponse.json(
      { success: false, message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
