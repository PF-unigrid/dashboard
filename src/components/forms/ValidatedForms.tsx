import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  LoginSchema, 
  CreateUserSchema, 
  CreateMetricSchema,
  ContactFormSchema,
  type LoginInput,
  type CreateUserInput,
  type CreateMetricInput,
  type ContactFormInput
} from '../../utils/validation.utils';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';

// ============================================================================
// LOGIN FORM EXAMPLE
// ============================================================================

interface LoginFormProps {
  readonly onSubmit: (data: LoginInput) => Promise<void>;
  readonly isLoading?: boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, isLoading = false }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid }
  } = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema),
    mode: 'onChange'
  });

  const handleFormSubmit = async (data: LoginInput) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold text-center mb-6">Sign In</h2>
      
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <div>
          <Input
            type="email"
            placeholder="Email"
            {...register('email')}
            error={errors.email?.message as string}
            disabled={isLoading}
          />
        </div>
        
        <div>
          <Input
            type="password"
            placeholder="Password"
            {...register('password')}
            error={errors.password?.message as string}
            disabled={isLoading}
          />
        </div>
        
        <Button
          type="submit"
          disabled={!isValid || isLoading}
          className="w-full"
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </Button>
      </form>
    </Card>
  );
};

// ============================================================================
// CREATE USER FORM EXAMPLE
// ============================================================================

interface CreateUserFormProps {
  readonly onSubmit: (data: CreateUserInput) => Promise<void>;
  readonly isLoading?: boolean;
}

export const CreateUserForm: React.FC<CreateUserFormProps> = ({ onSubmit, isLoading = false }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset
  } = useForm({
    resolver: zodResolver(CreateUserSchema),
    mode: 'onChange' as const
  });

  const handleFormSubmit = async (data: any) => {
    try {
      await onSubmit(data as CreateUserInput);
      reset(); // Clear form after successful submission
    } catch (error) {
      console.error('User creation failed:', error);
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto p-6">
      <h2 className="text-2xl font-bold text-center mb-6">Create User</h2>
      
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <div>
          <Input
            type="email"
            placeholder="Email"
            {...register('email')}
            error={errors.email?.message}
            disabled={isLoading}
          />
        </div>
        
        <div>
          <Input
            type="text"
            placeholder="Full Name"
            {...register('name')}
            error={errors.name?.message as string}
            disabled={isLoading}
          />
        </div>
        
        <div>
          <Input
            type="password"
            placeholder="Password"
            {...register('password')}
            error={errors.password?.message as string}
            disabled={isLoading}
          />
        </div>
        
        <div>
          <select
            {...register('role')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          >
            <option value="VIEWER">Viewer</option>
            <option value="OPERATOR">Operator</option>
            <option value="ADMIN">Admin</option>
          </select>
          {errors.role && (
            <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
          )}
        </div>
        
        <Button
          type="submit"
          disabled={!isValid || isLoading}
          className="w-full"
        >
          {isLoading ? 'Creating User...' : 'Create User'}
        </Button>
      </form>
    </Card>
  );
};

// ============================================================================
// CREATE METRIC FORM EXAMPLE
// ============================================================================

interface CreateMetricFormProps {
  readonly onSubmit: (data: CreateMetricInput) => Promise<void>;
  readonly isLoading?: boolean;
}

export const CreateMetricForm: React.FC<CreateMetricFormProps> = ({ onSubmit, isLoading = false }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset
  } = useForm<CreateMetricInput>({
    resolver: zodResolver(CreateMetricSchema),
    mode: 'onChange'
  });

  const handleFormSubmit = async (data: CreateMetricInput) => {
    try {
      await onSubmit(data);
      reset();
    } catch (error) {
      console.error('Metric creation failed:', error);
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto p-6">
      <h2 className="text-2xl font-bold text-center mb-6">Create Metric</h2>
      
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <div>
          <Input
            type="text"
            placeholder="Metric Name"
            {...register('name')}
            error={errors.name?.message}
            disabled={isLoading}
          />
        </div>
        
        <div>
          <select
            {...register('type')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          >
            <option value="">Select Type</option>
            <option value="CURRENT">Current</option>
            <option value="VOLTAGE">Voltage</option>
            <option value="POWER">Power</option>
            <option value="EFFICIENCY">Efficiency</option>
            <option value="FREQUENCY">Frequency</option>
            <option value="TEMPERATURE">Temperature</option>
            <option value="CUSTOM">Custom</option>
          </select>
          {errors.type && (
            <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
          )}
        </div>
        
        <div>
          <select
            {...register('unit')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          >
            <option value="">Select Unit</option>
            <option value="A">Ampere (A)</option>
            <option value="V">Volt (V)</option>
            <option value="W">Watt (W)</option>
            <option value="kW">Kilowatt (kW)</option>
            <option value="Hz">Hertz (Hz)</option>
            <option value="°C">Celsius (°C)</option>
            <option value="%">Percentage (%)</option>
            <option value="unit">Unit</option>
          </select>
          {errors.unit && (
            <p className="mt-1 text-sm text-red-600">{errors.unit.message}</p>
          )}
        </div>
        
        <div>
          <Input
            type="number"
            step="0.01"
            placeholder="Initial Value"
            {...register('value', { valueAsNumber: true })}
            error={errors.value?.message}
            disabled={isLoading}
          />
        </div>
        
        <div>
          <textarea
            placeholder="Description (optional)"
            {...register('description')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows={3}
            disabled={isLoading}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>
        
        <Button
          type="submit"
          disabled={!isValid || isLoading}
          className="w-full"
        >
          {isLoading ? 'Creating Metric...' : 'Create Metric'}
        </Button>
      </form>
    </Card>
  );
};

// ============================================================================
// CONTACT FORM EXAMPLE
// ============================================================================

interface ContactFormProps {
  readonly onSubmit: (data: ContactFormInput) => Promise<void>;
  readonly isLoading?: boolean;
}

export const ContactForm: React.FC<ContactFormProps> = ({ onSubmit, isLoading = false }) => {
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset
  } = useForm<ContactFormInput>({
    resolver: zodResolver(ContactFormSchema),
    mode: 'onChange'
  });

  const handleFormSubmit = async (data: ContactFormInput) => {
    try {
      setSubmitStatus('idle');
      await onSubmit(data);
      setSubmitStatus('success');
      reset();
    } catch (error) {
      console.error('Contact form submission failed:', error);
      setSubmitStatus('error');
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto p-6">
      <h2 className="text-2xl font-bold text-center mb-6">Contact Us</h2>
      
      {submitStatus === 'success' && (
        <div className="mb-4 p-3 bg-green-100 border border-green-300 rounded-md text-green-700">
          Message sent successfully! We'll get back to you soon.
        </div>
      )}
      
      {submitStatus === 'error' && (
        <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-md text-red-700">
          Failed to send message. Please try again.
        </div>
      )}
      
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <div>
          <Input
            type="text"
            placeholder="Your Name"
            {...register('name')}
            error={errors.name?.message}
            disabled={isLoading}
          />
        </div>
        
        <div>
          <Input
            type="email"
            placeholder="Your Email"
            {...register('email')}
            error={errors.email?.message as string}
            disabled={isLoading}
          />
        </div>
        
        <div>
          <Input
            type="text"
            placeholder="Subject"
            {...register('subject')}
            error={errors.subject?.message}
            disabled={isLoading}
          />
        </div>
        
        <div>
          <textarea
            placeholder="Your Message"
            {...register('message')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows={5}
            disabled={isLoading}
          />
          {errors.message && (
            <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
          )}
        </div>
        
        <Button
          type="submit"
          disabled={!isValid || isLoading}
          className="w-full"
        >
          {isLoading ? 'Sending Message...' : 'Send Message'}
        </Button>
      </form>
    </Card>
  );
};

// ============================================================================
// VALIDATED INPUT COMPONENT
// ============================================================================

interface ValidatedInputProps {
  readonly label: string;
  readonly name: string;
  readonly type?: 'text' | 'email' | 'password' | 'number';
  readonly placeholder?: string;
  readonly required?: boolean;
  readonly disabled?: boolean;
  readonly error?: string;
  readonly value?: string | number;
  readonly onChange?: (value: string) => void;
  readonly onBlur?: () => void;
  readonly schema?: any; // Zod schema for real-time validation
}

export const ValidatedInput: React.FC<ValidatedInputProps> = ({
  label,
  name,
  type = 'text',
  placeholder,
  required = false,
  disabled = false,
  error,
  value,
  onChange,
  onBlur,
  schema
}) => {
  const [localError, setLocalError] = useState<string>('');
  
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    
    // Real-time validation if schema provided
    if (schema) {
      try {
        schema.parse(newValue);
        setLocalError('');
      } catch (err: any) {
        if (err.errors?.[0]?.message) {
          setLocalError(err.errors[0].message);
        }
      }
    }
    
    onChange?.(newValue);
  };
  
  const displayError = error || localError;
  
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <Input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value?.toString() || ''}
        onChange={handleChange}
        onBlur={onBlur}
        disabled={disabled}
        error={displayError}
        className={displayError ? 'border-red-300' : ''}
      />
    </div>
  );
};