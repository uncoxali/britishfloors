# Toast Notifications Usage Guide

This project uses React Toastify for beautiful toast notifications. Here's how to use them:

## Installation

The required packages are already installed:

- `react-toastify` - Main library
- `@types/react-toastify` - TypeScript types

## Setup

The ToastContainer is already configured in your root layout (`src/app/layout.tsx`) and the CSS is imported.

## Available Functions

### Basic Toast Functions

```typescript
import { showSuccess, showError, showWarning, showInfo } from '@/lib/utils/toast';

// Success notification (green)
showSuccess('Operation completed successfully!');

// Error notification (red)
showError('Something went wrong!');

// Warning notification (orange)
showWarning('Please check your input!');

// Info notification (blue)
showInfo('Here is some information!');
```

### Advanced Usage

```typescript
import { showToast, dismissAll, dismissToast } from '@/lib/utils/toast';

// Custom toast with type
showToast('Custom message', 'success');

// Dismiss all toasts
dismissAll();

// Dismiss specific toast (if you have the toast ID)
dismissToast('toast-id');
```

## Toast Configuration

The default configuration is:

- **Position**: Top-right
- **Auto-close**: 5 seconds
- **Progress bar**: Visible
- **Close on click**: Enabled
- **Pause on hover**: Enabled
- **Draggable**: Enabled
- **Theme**: Light

## Examples in Your Code

### Authentication Store

The auth store now shows toast notifications for:

- ✅ Login success
- ✅ Registration success
- ✅ Logout success
- ✅ Profile update success
- ✅ Email restoration success
- ❌ Login/Registration errors

### Account Page

The account page shows toast notifications for:

- ✅ Profile update success
- ❌ Profile update errors

## Customization

To customize toast behavior, you can modify the `ToastContainer` in `src/app/layout.tsx`:

```tsx
<ToastContainer
  position='bottom-center' // Change position
  autoClose={3000} // Change auto-close time
  hideProgressBar={true} // Hide progress bar
  theme='dark' // Change theme
/>
```

## Toast Types

- **Success**: Green background, checkmark icon
- **Error**: Red background, X icon
- **Warning**: Orange background, exclamation icon
- **Info**: Blue background, info icon

## Best Practices

1. **Keep messages short and clear**
2. **Use appropriate toast types** (success for confirmations, error for failures)
3. **Don't spam users** with too many toasts
4. **Use success toasts sparingly** - only for important actions
5. **Always show error toasts** for user-facing errors

## Troubleshooting

If toasts don't appear:

1. Check that `ToastContainer` is in your layout
2. Verify the CSS import is working
3. Check browser console for errors
4. Ensure the toast functions are imported correctly
