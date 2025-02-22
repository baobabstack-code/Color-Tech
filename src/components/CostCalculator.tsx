import React, { useState, useEffect } from 'react';
import { Calculator, DollarSign } from 'lucide-react';

interface ServiceRate {
  service: string;
  baseRate: number;
  description: string;
}

const CostCalculator = () => {
  const [selectedService, setSelectedService] = useState('');
  const [vehicleType, setVehicleType] = useState('sedan');
  const [damageLevel, setDamageLevel] = useState('minor');
  const [estimatedCost, setEstimatedCost] = useState<number | null>(null);

  const serviceRates: ServiceRate[] = [
    {
      service: 'Panel Beating',
      baseRate: 150,
      description: 'Repair and restoration of damaged panels'
    },
    {
      service: 'Spray Painting',
      baseRate: 200,
      description: 'Full vehicle paint job with premium materials'
    },
    {
      service: 'Dent Removal',
      baseRate: 80,
      description: 'Paintless dent removal for minor damages'
    },
    {
      service: 'Color Matching',
      baseRate: 100,
      description: 'Precise color matching and blending'
    }
  ];

  const vehicleMultipliers = {
    sedan: 1,
    suv: 1.3,
    truck: 1.5,
    luxury: 1.8
  };

  const damageLevelMultipliers = {
    minor: 1,
    moderate: 1.5,
    severe: 2.5
  };

  useEffect(() => {
    if (selectedService && vehicleType && damageLevel) {
      const baseRate = serviceRates.find(s => s.service === selectedService)?.baseRate || 0;
      const vehicleMultiplier = vehicleMultipliers[vehicleType as keyof typeof vehicleMultipliers];
      const damageMultiplier = damageLevelMultipliers[damageLevel as keyof typeof damageLevelMultipliers];
      
      const total = baseRate * vehicleMultiplier * damageMultiplier;
      setEstimatedCost(Math.round(total));
    } else {
      setEstimatedCost(null);
    }
  }, [selectedService, vehicleType, damageLevel]);

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <div className="flex items-center gap-3 mb-6">
        <Calculator className="w-6 h-6 text-secondary" />
        <h2 className="text-2xl font-bold text-primary">Cost Calculator</h2>
      </div>

      <div className="space-y-6">
        {/* Service Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Service
          </label>
          <select
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
            aria-label="Select service type"
          >
            <option value="">Choose a service</option>
            {serviceRates.map((service) => (
              <option key={service.service} value={service.service}>
                {service.service}
              </option>
            ))}
          </select>
        </div>

        {/* Vehicle Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Vehicle Type
          </label>
          <select
            value={vehicleType}
            onChange={(e) => setVehicleType(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
            aria-label="Select vehicle type"
          >
            <option value="sedan">Sedan</option>
            <option value="suv">SUV</option>
            <option value="truck">Truck</option>
            <option value="luxury">Luxury Vehicle</option>
          </select>
        </div>

        {/* Damage Level */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Damage Level
          </label>
          <select
            value={damageLevel}
            onChange={(e) => setDamageLevel(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
            aria-label="Select damage level"
          >
            <option value="minor">Minor</option>
            <option value="moderate">Moderate</option>
            <option value="severe">Severe</option>
          </select>
        </div>

        {/* Estimated Cost */}
        {estimatedCost !== null && (
          <div className="mt-8 p-6 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Estimated Cost:</span>
              <div className="flex items-center gap-1">
                <DollarSign className="w-5 h-5 text-secondary" />
                <span className="text-2xl font-bold text-primary">
                  {estimatedCost}
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              * This is a rough estimate. Final cost may vary based on actual damage assessment.
            </p>
          </div>
        )}

        {/* Disclaimer */}
        <p className="text-xs text-gray-500 mt-4">
          Note: This calculator provides an approximate cost estimate. For an accurate quote, 
          please bring your vehicle in for a professional assessment.
        </p>
      </div>
    </div>
  );
};

export default CostCalculator; 