import React from 'react';

interface ToolTipProps {
  children: React.ReactNode;
}

const ToolTip = ({ children }: ToolTipProps) => {
  return (
    <div style={{ background: '#6E75A8', color: 'white', padding: '30px', borderRadius: '60%', maxWidth: '370px', textAlign: 'center' }}>
      {children}
      //Future Dummy Data insert Here
    </div>
  );
};

export default ToolTip;