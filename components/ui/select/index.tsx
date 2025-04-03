'use client';

import { CustomSelect, CustomSelectProps } from './custom-select';
import { SearchableSelect, SearchableSelectProps } from './searchable-select';
import { MultiSelect, MultiSelectProps } from './multi-select';
import { Option } from './types';

// Define specific props for each variant
type DefaultSelectProps = {
  variant?: 'default';
  value?: string;
  onChange?: (value: string) => void;
} & Omit<CustomSelectProps, 'value' | 'onChange'>;

type SearchableSelectVariantProps = {
  variant: 'searchable';
  value?: string;
  onChange?: (value: string) => void;
} & Omit<SearchableSelectProps, 'value' | 'onChange'>;

type MultiSelectVariantProps = {
  variant: 'multi';
  value?: string[];
  onChange?: (value: string[]) => void;
} & Omit<MultiSelectProps, 'value' | 'onChange'>;

// Union type for all possible select props
export type SelectProps = 
  | DefaultSelectProps 
  | SearchableSelectVariantProps 
  | MultiSelectVariantProps;

// Type guard functions to check variant type
function isSearchableVariant(props: SelectProps): props is SearchableSelectVariantProps {
  return props.variant === 'searchable';
}

function isMultiVariant(props: SelectProps): props is MultiSelectVariantProps {
  return props.variant === 'multi';
}

export function Select(props: SelectProps) {
  // Handle the different variants with proper type checking
  if (isSearchableVariant(props)) {
    const { variant, ...restProps } = props;
    return <SearchableSelect {...restProps} />;
  }
  
  if (isMultiVariant(props)) {
    const { variant, ...restProps } = props;
    // Ensure value is always an array
    const safeValue = Array.isArray(restProps.value) ? restProps.value : restProps.value ? [restProps.value] : [];
    return <MultiSelect {...restProps} value={safeValue} />;
  }
  
  // Default case
  const { variant, ...restProps } = props;
  return <CustomSelect {...restProps} />;
}

export { CustomSelect, SearchableSelect, MultiSelect };
export type { Option, CustomSelectProps, SearchableSelectProps, MultiSelectProps };
