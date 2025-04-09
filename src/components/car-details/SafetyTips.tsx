
import React from "react";

const SafetyTips = () => {
  return (
    <div className="bg-blue-50 rounded-lg p-4">
      <h3 className="font-semibold text-blue-800 mb-2">Safety Tips</h3>
      <ul className="text-sm text-blue-700 space-y-2">
        <li>• Sign in to contact sellers directly</li>
        <li>• Meet in a public, well-lit place</li>
        <li>• Don't pay in advance or via wire transfer</li>
        <li>• Test drive the vehicle before purchasing</li>
        <li>• Verify the VIN and vehicle history</li>
        <li>• Consider having a mechanic inspect it</li>
      </ul>
    </div>
  );
};

export default SafetyTips;
