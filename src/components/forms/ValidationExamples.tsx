import React, { useState } from 'react';
import { 
  safeValidate,
  LoginSchema, 
  CreateMetricSchema,
  ContactFormSchema,
  type LoginInput,
  type CreateMetricInput,
  type ContactFormInput
} from '../../utils/validation.utils';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';

// ============================================================================
// VALIDATED FORM HOOK
// ============================================================================

interface UseValidatedFormOptions<T> {
  schema: any;
  onSubmit: (data: T) => Promise<void>;
}

function useValidatedForm<T>({ schema, onSubmit }: UseValidatedFormOptions<T>) {
  const [data, setData] = useState<Partial<T>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const updateField = (field: keyof T, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
    
    // Clear error for this field
    if (errors[field as string]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field as string];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const validation = safeValidate(schema, data);
      
      if (!validation.success) {
        const newErrors: Record<string, string> = {};
        validation.error.issues.forEach(issue => {
          const field = issue.path.join('.');
          newErrors[field] = issue.message;
        });
        setErrors(newErrors);
        return;
      }
      
      await onSubmit(validation.data as T);
      setData({}); // Reset form on success
      setErrors({});
    } catch (error) {
      console.error('Form submission failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    data,
    errors,
    isLoading,
    updateField,
    handleSubmit
  };
}

// ============================================================================
// SIMPLE LOGIN FORM EXAMPLE
// ============================================================================

interface SimpleLoginFormProps {
  readonly onSubmit: (data: LoginInput) => Promise<void>;
}

export const SimpleLoginForm: React.FC<SimpleLoginFormProps> = ({ onSubmit }) => {
  const { data, errors, isLoading, updateField, handleSubmit } = useValidatedForm({
    schema: LoginSchema,
    onSubmit
  });

  return (
    <Card className="w-full max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold text-center mb-6">Sign In</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="email"
          placeholder="Email"
          value={(data.email as string) || ''}
          onChange={(e) => updateField('email', e.target.value)}
          error={errors.email}
          disabled={isLoading}
        />
        
        <Input
          type="password"
          placeholder="Password"
          value={(data.password as string) || ''}
          onChange={(e) => updateField('password', e.target.value)}
          error={errors.password}
          disabled={isLoading}
        />
        
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
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
}

export const CreateMetricForm: React.FC<CreateMetricFormProps> = ({ onSubmit }) => {
  const { data, errors, isLoading, updateField, handleSubmit } = useValidatedForm({
    schema: CreateMetricSchema,
    onSubmit
  });

  return (
    <Card className="w-full max-w-lg mx-auto p-6">
      <h2 className="text-2xl font-bold text-center mb-6">Create Metric</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="text"
          placeholder="Metric Name"
          value={(data.name as string) || ''}
          onChange={(e) => updateField('name', e.target.value)}
          error={errors.name}
          disabled={isLoading}
        />
        
        <div>
          <select
            value={(data.type as string) || ''}
            onChange={(e) => updateField('type', e.target.value)}
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
            <p className="mt-1 text-sm text-red-600">{errors.type}</p>
          )}
        </div>
        
        <div>
          <select
            value={(data.unit as string) || ''}
            onChange={(e) => updateField('unit', e.target.value)}
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
            <p className="mt-1 text-sm text-red-600">{errors.unit}</p>
          )}
        </div>
        
        <Input
          type="number"
          step="0.01"
          placeholder="Initial Value"
          value={(data.value as number)?.toString() || ''}
          onChange={(e) => updateField('value', parseFloat(e.target.value) || 0)}
          error={errors.value}
          disabled={isLoading}
        />
        
        <div>
          <textarea
            placeholder="Description (optional)"
            value={(data.description as string) || ''}
            onChange={(e) => updateField('description', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows={3}
            disabled={isLoading}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description}</p>
          )}
        </div>
        
        <Button
          type="submit"
          disabled={isLoading}
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
}

export const ContactForm: React.FC<ContactFormProps> = ({ onSubmit }) => {
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  
  const handleContactSubmit = async (data: ContactFormInput) => {
    try {
      setSubmitStatus('idle');
      await onSubmit(data);
      setSubmitStatus('success');
    } catch (error) {
      console.error('Contact form submission failed:', error);
      setSubmitStatus('error');
    }
  };

  const { data, errors, isLoading, updateField, handleSubmit } = useValidatedForm({
    schema: ContactFormSchema,
    onSubmit: handleContactSubmit
  });

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
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="text"
          placeholder="Your Name"
          value={(data.name as string) || ''}
          onChange={(e) => updateField('name', e.target.value)}
          error={errors.name}
          disabled={isLoading}
        />
        
        <Input
          type="email"
          placeholder="Your Email"
          value={(data.email as string) || ''}
          onChange={(e) => updateField('email', e.target.value)}
          error={errors.email}
          disabled={isLoading}
        />
        
        <Input
          type="text"
          placeholder="Subject"
          value={(data.subject as string) || ''}
          onChange={(e) => updateField('subject', e.target.value)}
          error={errors.subject}
          disabled={isLoading}
        />
        
        <div>
          <textarea
            placeholder="Your Message"
            value={(data.message as string) || ''}
            onChange={(e) => updateField('message', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows={5}
            disabled={isLoading}
          />
          {errors.message && (
            <p className="mt-1 text-sm text-red-600">{errors.message}</p>
          )}
        </div>
        
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? 'Sending Message...' : 'Send Message'}
        </Button>
      </form>
    </Card>
  );
};

// ============================================================================
// VALIDATION EXAMPLES FOR DOCUMENTATION
// ============================================================================

export const ValidationExamples = {
  // Example 1: Basic validation
  basicValidation: () => {
    const emailValidation = safeValidate(LoginSchema, {
      email: 'invalid-email',
      password: '123'
    });
    
    console.log('Basic validation result:', emailValidation);
  },

  // Example 2: Successful validation
  successfulValidation: () => {
    const validation = safeValidate(ContactFormSchema, {
      name: 'John Doe',
      email: 'john@example.com',
      subject: 'Hello World',
      message: 'This is a test message for validation.'
    });
    
    console.log('Successful validation:', validation);
  },

  // Example 3: Complex metric validation
  complexValidation: () => {
    const metricValidation = safeValidate(CreateMetricSchema, {
      name: 'Power Consumption',
      type: 'POWER',
      unit: 'kW',
      value: 125.5,
      description: 'Main power consumption metric'
    });
    
    console.log('Metric validation:', metricValidation);
  }
};