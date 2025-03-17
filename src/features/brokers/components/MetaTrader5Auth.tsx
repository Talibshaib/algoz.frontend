"use client";

import React from 'react';
import { BrokerAuthButton } from './BrokerAuthButton';
import { BrokerAuthModal, BrokerField } from './BrokerAuthModal';
import { authenticateMetaTrader5 } from '../services/brokerAuthService';

interface MetaTrader5AuthProps {
  brokerId: string;
  isActive: boolean;
  isModalOpen: boolean;
  onOpenModal: () => void;
  onCloseModal: () => void;
  onSuccess: () => void;
}

const METATRADER5_FIELDS: BrokerField[] = [
  { name: 'server', label: 'Server', type: 'text' },
  { name: 'login', label: 'Login', type: 'text' },
  { name: 'password', label: 'Password', type: 'password' }
];

export const MetaTrader5AuthButton: React.FC<Omit<MetaTrader5AuthProps, 'isModalOpen' | 'onOpenModal' | 'onCloseModal'>> = ({
  brokerId,
  isActive,
  onSuccess
}) => {
  return (
    <BrokerAuthButton
      brokerId={brokerId}
      brokerName="MetaTrader 5"
      isActive={isActive}
      onSuccess={onSuccess}
      authenticateFunction={authenticateMetaTrader5}
    />
  );
};

export const MetaTrader5AuthModal: React.FC<Omit<MetaTrader5AuthProps, 'isActive'>> = ({
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
      brokerName="MetaTrader 5"
      fields={METATRADER5_FIELDS}
      description="Enter your MetaTrader 5 server, login, and password to connect your account."
    />
  );
}; 