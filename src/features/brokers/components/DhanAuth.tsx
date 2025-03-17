"use client";

import React from 'react';
import { BrokerAuthButton } from './BrokerAuthButton';
import { BrokerAuthModal, BrokerField } from './BrokerAuthModal';
import { authenticateDhan } from '../services/brokerAuthService';

interface DhanAuthProps {
  brokerId: string;
  isActive: boolean;
  isModalOpen: boolean;
  onOpenModal: () => void;
  onCloseModal: () => void;
  onSuccess: () => void;
}

const DHAN_FIELDS: BrokerField[] = [
  { name: 'partner_id', label: 'Partner ID', type: 'text' },
  { name: 'partner_secret', label: 'Partner Secret', type: 'password' }
];

export const DhanAuthButton: React.FC<Omit<DhanAuthProps, 'isModalOpen' | 'onOpenModal' | 'onCloseModal'>> = ({
  brokerId,
  isActive,
  onSuccess
}) => {
  return (
    <BrokerAuthButton
      brokerId={brokerId}
      brokerName="Dhan"
      isActive={isActive}
      onSuccess={onSuccess}
      authenticateFunction={authenticateDhan}
    />
  );
};

export const DhanAuthModal: React.FC<Omit<DhanAuthProps, 'isActive'>> = ({
  brokerId,
  isModalOpen,
  onCloseModal,
  onSuccess
}) => {
  return (
    <BrokerAuthModal
      isOpen={isModalOpen}
      onClose={onCloseModal}
      onSuccess={onSuccess}
      brokerId={brokerId}
      brokerName="Dhan"
      fields={DHAN_FIELDS}
      description="Enter your Dhan Partner ID and Partner Secret to connect your account."
    />
  );
}; 