// Mock for next-intl
module.exports = {
  useTranslations: (namespace) => {
    // Create a translation function that returns the key or handles specific cases
    const t = (key, params) => {
      // Handle AlertMessage component's specific translation keys
      if (namespace === 'AlertMessage') {
        const translations = {
          'error.defaultTitle': 'Error',
          'error.defaultDescription': 'Something went wrong',
          'error.title': 'Error',
          'error.description': 'Please check the following:',
          'warning.defaultTitle': 'Warning',
          'warning.defaultDescription': 'Please be aware',
          'warning.title': 'Warning',
          'warning.description': 'Please note:',
          'success.defaultTitle': 'Success',
          'success.defaultDescription': 'Operation completed successfully',
          'success.title': 'Success',
          'success.description': 'The operation was successful:',
          'info.defaultTitle': 'Information',
          'info.defaultDescription': 'For your information',
          'info.title': 'Information',
          'info.description': 'Please note:'
        };
        return translations[key] || key;
      }
      
      // Handle Table component's specific translation keys
      if (namespace === 'Table') {
        const translations = {
          'search': 'Filter...',
          'noResults': 'No results.',
          'items': params?.count === 1 ? '1 item' : `${params?.count || 0} items`,
          'pageNumber': `Page ${params?.current || 1} of ${params?.total || 1}`,
          'previous': 'Previous',
          'next': 'Next'
        };
        return translations[key] || key;
      }
      
      // Handle EntityInfo component's specific translation keys
      if (namespace === 'EntityInfo') {
        const translations = {
          'noData': `No ${params?.type || 'data'} found`,
          'fields.email': 'Email',
          'fields.id': 'ID',
          'fields.center': 'Center',
          'fields.role': 'Role',
          'fields.status': 'Status',
          'fields.phone': 'Phone',
          'fields.dateOfBirth': 'Date of Birth',
          'fields.diagnose': 'Diagnosis',
          'notes': 'Notes',
          'note': 'Note',
          'notePlaceholder': 'Add a note...',
          'deleteNote': 'Delete Note',
          'confirmDelete': 'Are you sure you want to delete this note?',
          'cancel': 'Cancel'
        };
        return translations[key] || key;
      }
      
      return key;
    };
    
    // Add raw method to handle arrays
    t.raw = (key) => [key];
    return t;
  },
  useFormatter: () => ({
    dateTime: () => 'mocked-date',
    number: () => 'mocked-number',
  }),
  NextIntlClientProvider: ({ children }) => children,
};
