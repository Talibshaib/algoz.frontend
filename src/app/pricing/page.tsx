import React from "react";

const PricingPage = () => {
  return (
    <div className="flex-1 p-4">
      <h1 className="text-2xl font-bold mb-4">Pricing</h1>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <h2 className="text-xl font-semibold">Basic</h2>
          <p>$9.99/month</p>
          <p>Basic features</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold">Pro</h2>
          <p>$19.99/month</p>
          <p>Advanced features</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold">Enterprise</h2>
          <p>$49.99/month</p>
          <p>Unlimited features</p>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;