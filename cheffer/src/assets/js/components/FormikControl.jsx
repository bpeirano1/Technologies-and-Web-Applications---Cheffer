import React from 'react';

const FormikControl = (props) => {
    const { control, ...rest } = props
    switch (control) {
      case 'input':
      case 'textarea':
      case 'select':
      case 'radio':
      case 'checkbox':
      case 'date':
      case 'chakraInput':
      default:
        return null;
    }
  };