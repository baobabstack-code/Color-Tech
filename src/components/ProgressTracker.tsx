import React, { useState } from 'react';
import { 
  ClipboardCheck, Camera, Clock, Wrench, CheckCircle, 
  AlertCircle, Loader, Car, ImageIcon, Phone, Truck, 
  ShieldAlert, ArrowRight, MessageSquare
} from 'lucide-react';
import { Card } from '@/components/ui/card';

interface RepairStage {
  id: number;
  title: string;
  description: string;
  status: 'completed' | 'in-progress' | 'pending';
  date?: string;
  photos?: string[];
  notes?: string;
}

interface RepairProgress {
  jobId: string;
  vehicleInfo: {
    make: string;
    model: string;
    year: string;
    color: string;
  };
  stages: RepairStage[];
  estimatedCompletion: string;
  currentStage: number;
}

interface EmergencyContact {
  title: string;
  number: string;
  hours: string;
  description: string;
}

interface TowingService {
  name: string;
  contact: string;
  coverage: string;
  eta: string;
}

export interface Stage {
  id: number;
  title: string;
  description: string;
  status: 'completed' | 'in-progress' | 'pending';
  date?: string;
  details?: string;
  photos?: string[];
  notes?: string;
}

interface ProgressTrackerProps {
  stages: Stage[];
  currentStage: number;
}

const ProgressTracker = ({ stages, currentStage }: ProgressTrackerProps) => {
  const [activeStage, setActiveStage] = useState<number>(0);
  const [showEmergencyInfo, setShowEmergencyInfo] = useState(false);
  const [showChat, setShowChat] = useState(false);

  const repairProgress: RepairProgress = {
    jobId: 'REP-2024-001',
    vehicleInfo: {
      make: 'Toyota',
      model: 'Corolla',
      year: '2022',
      color: 'Silver'
    },
    estimatedCompletion: '2024-02-20',
    currentStage: 2,
    stages: [
      {
        id: 1,
        title: 'Initial Assessment',
        description: 'Detailed inspection and damage assessment',
        status: 'completed',
        date: '2024-02-15',
        notes: 'Multiple panels require repair and repainting',
        photos: [
          'https://images.unsplash.com/photo-1589758438368-0ad531db3366?w=400',
          'https://images.unsplash.com/photo-1589758438368-0ad531db3366?w=400'
        ]
      },
      {
        id: 2,
        title: 'Panel Beating',
        description: 'Repair and restoration of damaged panels',
        status: 'in-progress',
        date: '2024-02-16',
        notes: 'Working on rear quarter panel',
        photos: [
          'https://images.unsplash.com/photo-1589758438368-0ad531db3366?w=400'
        ]
      },
      {
        id: 3,
        title: 'Surface Preparation',
        description: 'Sanding and primer application',
        status: 'pending'
      },
      {
        id: 4,
        title: 'Paint Application',
        description: 'Color matching and painting',
        status: 'pending'
      },
      {
        id: 5,
        title: 'Quality Check',
        description: 'Final inspection and detailing',
        status: 'pending'
      }
    ]
  };

  // Emergency contacts data
  const emergencyContacts: EmergencyContact[] = [
    {
      title: "24/7 Emergency Hotline",
      number: "+263 77 911 1234",
      hours: "24/7",
      description: "Immediate assistance for urgent repairs and accidents"
    },
    {
      title: "Roadside Assistance",
      number: "+263 77 911 5678",
      hours: "24/7",
      description: "On-site emergency repairs and towing coordination"
    }
  ];

  // Towing services data
  const towingServices: TowingService[] = [
    {
      name: "Rapid Response Towing",
      contact: "+263 77 922 1234",
      coverage: "Harare Metropolitan Area",
      eta: "15-30 minutes"
    },
    {
      name: "Highway Rescue Services",
      contact: "+263 77 922 5678",
      coverage: "Nationwide",
      eta: "30-60 minutes"
    }
  ];

  const getStatusIcon = (status: Stage['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'in-progress':
        return <Clock className="w-6 h-6 text-secondary" />;
      default:
        return <AlertCircle className="w-6 h-6 text-gray-300" />;
    }
  };

  return (
    <div className="container mx-auto py-12">
      {/* Emergency Services Button */}
      <div className="mb-8">
        <button
          onClick={() => setShowEmergencyInfo(!showEmergencyInfo)}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg flex items-center justify-center w-full md:w-auto transition-colors duration-200"
        >
          <ShieldAlert className="w-5 h-5 mr-2" />
          Emergency Services & 24/7 Support
        </button>
      </div>

      {/* Emergency Services Information */}
      {showEmergencyInfo && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8 border-l-4 border-red-600">
          <h2 className="text-2xl font-bold text-primary mb-6">Emergency Services</h2>
          
          {/* Emergency Contacts */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {emergencyContacts.map((contact, index) => (
              <div key={index} className="bg-red-50 rounded-lg p-4">
                <h3 className="font-semibold text-red-700 mb-2">{contact.title}</h3>
                <div className="flex items-center mb-2">
                  <Phone className="w-5 h-5 text-red-600 mr-2" />
                  <a href={`tel:${contact.number}`} className="text-red-600 font-medium hover:text-red-700">
                    {contact.number}
                  </a>
                </div>
                <p className="text-sm text-gray-600">Hours: {contact.hours}</p>
                <p className="text-sm text-gray-600">{contact.description}</p>
              </div>
            ))}
          </div>

          {/* Towing Services */}
          <h3 className="text-xl font-semibold text-primary mb-4">Towing Services</h3>
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {towingServices.map((service, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-start">
                  <Truck className="w-5 h-5 text-secondary mt-1 mr-3" />
                  <div>
                    <h4 className="font-medium text-primary">{service.name}</h4>
                    <p className="text-sm text-gray-600 mb-2">Coverage: {service.coverage}</p>
                    <p className="text-sm text-gray-600">ETA: {service.eta}</p>
                    <a
                      href={`tel:${service.contact}`}
                      className="text-secondary hover:text-secondary/80 text-sm font-medium mt-2 inline-flex items-center"
                    >
                      Call Now <ArrowRight className="w-4 h-4 ml-1" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Emergency Guidelines */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-primary mb-4">Emergency Procedures</h3>
            <ol className="list-decimal list-inside space-y-3 text-gray-600">
              <li>Ensure personal safety and move to a secure location</li>
              <li>Call our 24/7 emergency hotline for immediate assistance</li>
              <li>Share your location and vehicle details with our team</li>
              <li>Follow the operator's instructions for towing or on-site repairs</li>
              <li>Document the damage with photos if possible and safe to do so</li>
            </ol>
          </div>
        </div>
      )}

      {/* Job Information */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-primary">Repair Progress</h2>
            <p className="text-gray-600">Job ID: {repairProgress.jobId}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Estimated Completion</p>
            <p className="text-lg font-semibold text-primary">
              {new Date(repairProgress.estimatedCompletion).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-primary mb-3">Vehicle Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Make</p>
                <p className="font-medium">{repairProgress.vehicleInfo.make}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Model</p>
                <p className="font-medium">{repairProgress.vehicleInfo.model}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Year</p>
                <p className="font-medium">{repairProgress.vehicleInfo.year}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Color</p>
                <p className="font-medium">{repairProgress.vehicleInfo.color}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-primary mb-3">Progress Overview</h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center">
                  <Wrench className="w-6 h-6 text-secondary" />
                </div>
                <div className="ml-3">
                  <p className="font-medium">Current Stage</p>
                  <p className="text-sm text-gray-600">
                    {repairProgress.stages[repairProgress.currentStage - 1].title}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-secondary">
                  {Math.round((repairProgress.currentStage / repairProgress.stages.length) * 100)}%
                </p>
                <p className="text-sm text-gray-600">Complete</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Timeline */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="space-y-6">
          {stages.map((stage, index) => (
            <div 
              key={stage.id}
              className={`relative flex items-start ${
                index !== stages.length - 1 ? 'pb-6' : ''
              }`}
            >
              {/* Connector Line */}
              {index !== stages.length - 1 && (
                <div 
                  className={`h-full w-0.5 absolute ml-3 top-6 bottom-0 ${
                    stage.status === 'completed' ? 'bg-green-500' : 'bg-gray-200'
                  }`} 
                />
              )}

              {/* Status Icon */}
              <div className="flex-shrink-0 mr-4">
                {getStatusIcon(stage.status)}
              </div>

              {/* Content */}
              <div className="flex-1">
                <button
                  className={`w-full text-left ${
                    activeStage === index ? 'bg-gray-50' : ''
                  } rounded-lg p-4 hover:bg-gray-50 transition-colors duration-200`}
                  onClick={() => setActiveStage(index)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-primary">
                      {stage.title}
                    </h3>
                    {stage.date && (
                      <span className="text-sm text-gray-500">
                        {new Date(stage.date).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600">{stage.description}</p>

                  {/* Additional Details (shown when active) */}
                  {activeStage === index && stage.photos && (
                    <div className="mt-4">
                      {stage.notes && (
                        <p className="text-sm text-gray-600 mb-3">
                          <span className="font-medium">Notes:</span> {stage.notes}
                        </p>
                      )}
                      <div className="grid grid-cols-2 gap-4">
                        {stage.photos?.map((photo, photoIndex) => (
                          <div key={photoIndex} className="relative aspect-w-4 aspect-h-3">
                            <div className="absolute inset-0 bg-gray-100 rounded-lg flex items-center justify-center">
                              <ImageIcon className="w-8 h-8 text-gray-300" />
                            </div>
                            <img
                              src={photo}
                              alt={`Progress photo ${photoIndex + 1}`}
                              className="absolute inset-0 w-full h-full object-cover rounded-lg shadow-md transition-opacity duration-200"
                              loading="lazy"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = 'https://source.unsplash.com/400x300/?car-repair';
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Support Button */}
      <button
        onClick={() => setShowChat(!showChat)}
        className="fixed bottom-6 right-6 bg-secondary hover:bg-secondary/90 text-white p-4 rounded-full shadow-lg transition-colors duration-200"
        aria-label="Chat Support"
      >
        <MessageSquare className="w-6 h-6" />
      </button>

      {/* Chat Support Modal */}
      {showChat && (
        <div className="fixed bottom-20 right-6 w-96 bg-white rounded-lg shadow-xl">
          <div className="p-4 border-b">
            <h3 className="font-semibold text-primary">Live Support</h3>
          </div>
          <div className="h-96 p-4">
            {/* Chat interface would go here */}
            <p className="text-gray-600 text-center">
              Connect with our support team for assistance
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressTracker; 