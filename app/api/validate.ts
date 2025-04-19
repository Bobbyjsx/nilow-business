import http from '@/lib/https';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';

// Client-side phone validation before API call
const isValidPhoneFormat = (phone: string): boolean => {
  // Remove all non-digit characters
  const digitsOnly = phone.replace(/\D/g, '');
  
  // Check if phone has reasonable length (between 8 and 15 digits)
  // This covers most international phone number formats
  return digitsOnly.length >= 8 && digitsOnly.length <= 15;
};

const validatePhoneNumber = async (value: string) => {
  // First validate format client-side
  if (!isValidPhoneFormat(value)) {
    throw new Error('Invalid phone number format');
  }
  
  // Then check with server
  const res = await http.post('/auth/check_phone_number_exist', { phone_number: value });
  return res;
};

const validateUsername = async (value: string) => {
  if (!value || value.trim().length === 0) {
    throw new Error('Username cannot be empty');
  }
  
  const res = await http.post('/auth/check_username_exist', { username: value });
  return res;
};

export const useValidatePhone = () => {
  const [validationState, setValidationState] = useState<{
    isValid: boolean;
    message: string | null;
    validated: boolean;
  }>({
    isValid: false,
    message: null,
    validated: false
  });
  
  const {
    mutateAsync: executeValidatePhone,
    isPending: isValidatePhoneExecuting,
    error,
  } = useMutation({
    mutationFn: validatePhoneNumber,
    onSuccess: (response) => {
      const isValid = !response?.data;
      setValidationState({
        isValid,
        message: isValid ? null : 'Phone number already exists',
        validated: true
      });
    },
    onError: (error: any) => {
      setValidationState({
        isValid: false,
        message: error.message || 'Invalid phone number',
        validated: true
      });
    }
  });

  const resetValidation = () => {
    setValidationState({
      isValid: false,
      message: null,
      validated: false
    });
  };

  return { 
    executeValidatePhone, 
    isValidatePhoneExecuting, 
    error, 
    isPhoneValid: validationState.isValid,
    phoneValidationMessage: validationState.message,
    isPhoneValidated: validationState.validated,
    resetPhoneValidation: resetValidation
  };
};

export const useValidateUsername = () => {
  const [validationState, setValidationState] = useState<{
    isValid: boolean;
    message: string | null;
    validated: boolean;
  }>({
    isValid: false,
    message: null,
    validated: false
  });
  
  const {
    mutateAsync: executeValidateName,
    isPending: isValidateNameExecuting,
    error,
  } = useMutation({
    mutationFn: validateUsername,
    onSuccess: (response) => {
      const isValid = !response?.data;
      setValidationState({
        isValid,
        message: isValid ? null : 'Business name already exists',
        validated: true
      });
    },
    onError: (error: any) => {
      setValidationState({
        isValid: false,
        message: error.message || 'Invalid business name',
        validated: true
      });
    }
  });

  const resetValidation = () => {
    setValidationState({
      isValid: false,
      message: null,
      validated: false
    });
  };

  return { 
    executeValidateName, 
    isValidateNameExecuting, 
    error, 
    isNameValid: validationState.isValid,
    nameValidationMessage: validationState.message,
    isNameValidated: validationState.validated,
    resetNameValidation: resetValidation
  };
};
