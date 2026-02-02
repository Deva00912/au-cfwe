export default function Button(props) {
  return (
    <button
      type={props?.type || "button"}
      className={props?.className}
      onClick={props?.onClick}
      title={props?.buttonTitle}
      disabled={props?.disabled}
    >
      {props?.icon && <span className="button-icon">{props?.icon}</span>}
      {props?.text || props?.children}
    </button>
  );
}
