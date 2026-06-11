import { NextResponse } from 'next/server';
import { launchBrowser } from '@/lib/browser';

export async function POST() {
  try {
    const result = await launchBrowser();
    return NextResponse.json(result);
  } catch (error) {
    console.error("API Route Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to launch browser" },
      { status: 500 }
    );
  }
}
