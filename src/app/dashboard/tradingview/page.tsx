"use client"

import { Suspense } from "react";
import WebhookUrl from "@/components/tradingview/WebhookUrl";

export default function TradingViewPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">TradingView Webhook URL</h1>
      
      <div className="grid gap-6">
        <Suspense fallback={<div>Loading webhook URL...</div>}>
          <WebhookUrl />
        </Suspense>
        
        <div className="p-4 border rounded-lg bg-white shadow-sm">
          <h2 className="text-xl font-semibold mb-4">TradingView Integration Guide</h2>
          
          <div className="space-y-4">
            <p>
              TradingView webhooks allow you to send trading signals from TradingView directly to our platform.
              Follow these steps to set up your TradingView integration:
            </p>
            
            <div>
              <h3 className="font-medium mb-2">Step 1: Create a Pine Script Strategy</h3>
              <p className="text-sm text-gray-700">
                Create or use an existing Pine Script strategy in TradingView that generates trading signals.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Step 2: Configure Alert Conditions</h3>
              <p className="text-sm text-gray-700">
                Set up alert conditions based on your strategy's signals.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Step 3: Set Up Webhook</h3>
              <p className="text-sm text-gray-700">
                Use the webhook URL provided above in the TradingView alert settings.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Step 4: Format Alert Message</h3>
              <p className="text-sm text-gray-700">
                Format your alert message as JSON with the following structure:
              </p>
              <pre className="p-3 bg-gray-100 rounded-md text-xs overflow-auto mt-2">
{`{
  "strategy": "Your Strategy Name",
  "symbol": "{{ticker}}",
  "interval": "{{interval}}",
  "action": "{{strategy.order.action}}",
  "price": {{close}},
  "volume": {{volume}},
  "timestamp": "{{time}}",
  "message": "{{strategy.order.comment}}"
}`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 