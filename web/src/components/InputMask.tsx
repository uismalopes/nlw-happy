import React, { InputHTMLAttributes, useCallback } from 'react';

interface PropsMask extends InputHTMLAttributes<HTMLInputElement> {
    mask: string;
}

const InputMask: React.FC<PropsMask> = ({mask, ...rest})=>{
    
    const handleMask = useCallback((e: React.FormEvent<HTMLInputElement>)=>{
        if(mask === 'phone'){
            let value = e.currentTarget.value;
            value = value.replace(/\D/g, "");
            value = value.replace(/^(\d{2})(\d)/g,"($1) $2");
            value = value.replace(/(\d)(\d{4})$/,"$1-$2");
            e.currentTarget.value = value;
            return e;
        }
    }, [ mask ]);

    return(
        <input 
        {...rest} 
        onKeyUp={handleMask}
        />
    );
};

export default InputMask;