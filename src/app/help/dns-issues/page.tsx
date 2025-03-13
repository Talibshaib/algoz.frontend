"use client";

import React, { useState } from "react";
import { Button, Input, Card, CardBody, CardHeader } from "@nextui-org/react";
import { ManualConnectionForm } from "@/components/ui/ManualConnectionForm";
import { HealthCheck } from "@/components/ui/HealthCheck";
import { toast } from "sonner";
import Link from "next/link";
import { ArrowLeft, Globe, Server, Wifi, WifiOff } from "lucide-react";

export default function DNSIssuesPage() {
  const [isServerOnline, setIsServerOnline] = useState(true);

  const handleConnectionSuccess = () => {
    toast.success("Connection established successfully", {
      description: "You can now use the application normally"
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Link 
        href="/"
        className="flex items-center text-blue-600 hover:underline mb-6"
      >
        <ArrowLeft size={16} className="mr-1" />
        Back to Home
      </Link>

      <h1 className="text-3xl font-bold mb-2">Troubleshooting Connection Issues</h1>
      <p className="text-gray-600 mb-8">
        If you're experiencing problems connecting to our servers, this guide will help you resolve them.
      </p>

      {/* Current server status */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Current Server Status</h2>
        <HealthCheck 
          onStatusChange={setIsServerOnline}
          className="mb-4"
        />
      </div>

      {/* Common issues section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Common Connection Issues</h2>
        
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader className="flex gap-3">
              <WifiOff className="text-red-500" />
              <div>
                <p className="text-lg font-medium">DNS Resolution Errors</p>
              </div>
            </CardHeader>
            <CardBody>
              <p className="text-sm">
                DNS resolution errors (ERR_NAME_NOT_RESOLVED) occur when your device cannot translate our domain name to an IP address. This can happen due to:
              </p>
              <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
                <li>DNS server issues</li>
                <li>Network configuration problems</li>
                <li>ISP restrictions</li>
                <li>Firewall or security software blocking connections</li>
              </ul>
            </CardBody>
          </Card>

          <Card>
            <CardHeader className="flex gap-3">
              <Globe className="text-blue-500" />
              <div>
                <p className="text-lg font-medium">Network Connectivity</p>
              </div>
            </CardHeader>
            <CardBody>
              <p className="text-sm">
                General network connectivity issues can prevent you from accessing our services:
              </p>
              <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
                <li>Unstable internet connection</li>
                <li>VPN or proxy interference</li>
                <li>Corporate network restrictions</li>
                <li>Regional access limitations</li>
              </ul>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Solutions section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Solutions</h2>
        
        <div className="space-y-6">
          <Card>
            <CardHeader className="flex gap-3">
              <Server className="text-green-500" />
              <div>
                <p className="text-lg font-medium">Manual Connection</p>
              </div>
            </CardHeader>
            <CardBody>
              <p className="text-sm mb-4">
                If you're experiencing DNS resolution issues, you can try connecting directly using our server's IP address:
              </p>
              
              <ManualConnectionForm onConnectionSuccess={handleConnectionSuccess} />
            </CardBody>
          </Card>

          <Card>
            <CardHeader className="flex gap-3">
              <Wifi className="text-purple-500" />
              <div>
                <p className="text-lg font-medium">Other Solutions</p>
              </div>
            </CardHeader>
            <CardBody>
              <p className="text-sm mb-2">Try these additional troubleshooting steps:</p>
              <ol className="list-decimal pl-5 text-sm space-y-2">
                <li>
                  <strong>Flush your DNS cache:</strong>
                  <ul className="list-disc pl-5 mt-1 text-xs">
                    <li>Windows: Open Command Prompt as administrator and run <code className="bg-gray-100 px-1 rounded">ipconfig /flushdns</code></li>
                    <li>Mac: Open Terminal and run <code className="bg-gray-100 px-1 rounded">sudo killall -HUP mDNSResponder</code></li>
                    <li>Linux: Open Terminal and run <code className="bg-gray-100 px-1 rounded">sudo systemd-resolve --flush-caches</code></li>
                  </ul>
                </li>
                <li>
                  <strong>Use alternative DNS servers:</strong>
                  <ul className="list-disc pl-5 mt-1 text-xs">
                    <li>Google DNS: 8.8.8.8 and 8.8.4.4</li>
                    <li>Cloudflare DNS: 1.1.1.1 and 1.0.0.1</li>
                  </ul>
                </li>
                <li>
                  <strong>Disable VPN or proxy:</strong> If you're using a VPN or proxy service, try disabling it temporarily.
                </li>
                <li>
                  <strong>Try a different network:</strong> If possible, connect to a different network (e.g., switch from Wi-Fi to mobile data).
                </li>
                <li>
                  <strong>Contact support:</strong> If you continue to experience issues, please <Link href="/contact" className="text-blue-600 hover:underline">contact our support team</Link>.
                </li>
              </ol>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
} 