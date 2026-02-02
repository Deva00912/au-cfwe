import React from "react";

const InputBox = React.forwardRef((props, ref) => {
  return (
    <>
      {props?.labelTitle && (
        <label htmlFor={props?.id} className={props?.labelClassName}>
          {props?.labelTitle}
        </label>
      )}
      <input
        type={props?.type}
        accept={props?.accept}
        id={props?.id}
        name={props?.name}
        ref={ref}
        value={props?.value}
        onChange={props?.onChange}
        className={props?.className}
        required={props?.required}
        multiple={props?.multiple}
        placeholder={props?.placeholder}
        disabled={props?.disabled}
      />
    </>
  );
});

export default InputBox;
