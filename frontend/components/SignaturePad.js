// components/SignaturePad.js

import React, { useRef, useEffect } from 'react';
import SignatureCanvas from 'react-signature-canvas';

const SignaturePad = ({ onEnd }) => {
  const signaturePadRef = useRef(null);

  useEffect(() => {
    if (signaturePadRef.current) {
      signaturePadRef.current.clear();
    }
  }, []);

  return (
    <div>
      <SignatureCanvas
        ref={signaturePadRef}
        onEnd={onEnd}
        backgroundColor="white"
        penColor="black"
        canvasProps={{ width: 500, height: 200, className: 'signature-canvas' }}
      />
    </div>
  );
};

export default SignaturePad;
