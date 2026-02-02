export default function RenderImage(props) {
  return props?.src ? (
    <img
      src={props?.src}
      alt={props?.title || props?.alt || "CEW-AU Image"}
      className={
        props?.className ? props.className : "w-full h-48 object-cover"
      }
    />
  ) : (
    <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
      <div className="text-gray-400 text-6xl">📰</div>
    </div>
  );
}
