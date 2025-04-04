'use client';
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface PredictionResponse {
  prediction: number;
  label: string;
}

export default function DetectPage() {
  const [text, setText] = useState('');
  const [response, setResponse] = useState<PredictionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!text.trim()) {
      setError('Please enter some text to analyze');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('Sending request to Flask server...');
      const response = await fetch('http://127.0.0.1:5000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: text }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json() as PredictionResponse;
      console.log('Received response:', data);
      setResponse(data);
    } catch (error) {
      console.error('Error:', error);
      setError(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl">
            <span className="text-primary">SafeChat</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/signup">
              <Button>Sign Up</Button>
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <div className="container py-12">
          <div className="mb-6">
            <Link href="/" className="flex items-center text-sm text-muted-foreground hover:text-primary">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </div>
          
          <div className="max-w-2xl mx-auto bg-card rounded-lg shadow-md p-6">
            <h1 className="text-3xl font-bold mb-6">Cyberbullying Detection</h1>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="text" className="block text-sm font-medium mb-2">
                  Enter text to analyze
                </label>
                <textarea
                  id="text"
                  className="w-full px-3 py-2 border border-input rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  rows={4}
                  placeholder="Type or paste text here..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
              </div>
              
              <Button 
                className="w-full"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? 'Analyzing...' : 'Analyze Text'}
              </Button>

              {error && (
                <div className="p-3 bg-destructive/10 border border-destructive text-destructive rounded-md">
                  {error}
                </div>
              )}

              {response && !error && (
                <div className="p-4 bg-muted rounded-md">
                  <h2 className="text-lg font-semibold mb-2">Analysis Result:</h2>
                  <p className={`font-medium ${
                    response.label === 'bullying' ? 'text-destructive' : 'text-green-600'
                  }`}>
                    This text is classified as: {response.label}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <footer className="border-t py-6">
        <div className="container flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">© 2025 SafeChat. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/terms" className="text-sm text-muted-foreground hover:underline">
              Terms
            </Link>
            <Link href="/privacy" className="text-sm text-muted-foreground hover:underline">
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
} 